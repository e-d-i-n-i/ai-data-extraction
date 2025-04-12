import os
import json
import asyncio
from xml.etree import ElementTree
from typing import List, Dict, Any
from dataclasses import dataclass
from datetime import datetime, timezone
from urllib.parse import urlparse
from dotenv import load_dotenv

from crawl4ai import AsyncWebCrawler, BrowserConfig, CrawlerRunConfig, CacheMode
from openai import AsyncOpenAI
from supabase import create_client, Client

load_dotenv()

# Initialize OpenAI and Supabase clients
openai_client = AsyncOpenAI(api_key=os.getenv("OPENAI_API_KEY"))
supabase: Client = create_client(
    os.getenv("SUPABASE_URL"),
    os.getenv("SUPABASE_SERVICE_KEY")
)

@dataclass
class ProcessedChunk:
    url: str  # This will now store the title
    chunk_number: int
    title: str
    summary: str
    content: str
    metadata: Dict[str, Any]
    embedding: List[float]

class SiteMapProcessor:
    def __init__(self):
        self.crawler = None

    async def __aenter__(self):
        """Initialize the browser when entering the context."""
        try:
            self.crawler = AsyncWebCrawler(config=BrowserConfig(headless=True))
            await self.crawler.start()
            print("Browser initialized successfully.")
            return self
        except Exception as e:
            print(f"Error initializing browser: {e}")
            raise

    async def __aexit__(self, exc_type, exc_val, exc_tb):
        """Close the browser when exiting the context."""
        if self.crawler:
            await self.crawler.close()
            print("Browser closed successfully.")

    async def crawl_website(self, url: str, source: str):
        """Crawl a single website."""
        if not self.crawler:
            raise RuntimeError("Browser not initialized. Use the context manager.")

        try:
            result = await self.crawler.arun(
                url=url,
                config=CrawlerRunConfig(cache_mode=CacheMode.BYPASS),
                session_id="session1"
            )
            if result.success:
                print(f"Successfully crawled: {url}")
                await self.process_and_store_document(url, source, result.markdown_v2.raw_markdown)
            else:
                print(f"Failed: {url} - Error: {result.error_message}")
        except Exception as e:
            print(f"Error crawling website: {e}")

    async def process_and_store_document(self, url: str, source: str, markdown: str):
        """Process a document and store its chunks in parallel."""
        chunks = self.chunk_text(markdown)
        tasks = [self.process_chunk(chunk, i, url, source) for i, chunk in enumerate(chunks)]
        processed_chunks = await asyncio.gather(*tasks)
        
        insert_tasks = [self.insert_chunk(chunk) for chunk in processed_chunks]
        await asyncio.gather(*insert_tasks)

    def chunk_text(self, text: str, chunk_size: int = 5000) -> List[str]:
        """Split text into chunks, respecting code blocks and paragraphs."""
        chunks = []
        start = 0
        text_length = len(text)

        while start < text_length:
            end = start + chunk_size
            if end >= text_length:
                chunks.append(text[start:].strip())
                break

            chunk = text[start:end]
            code_block = chunk.rfind('```')
            if code_block != -1 and code_block > chunk_size * 0.3:
                end = start + code_block
            elif '\n\n' in chunk:
                last_break = chunk.rfind('\n\n')
                if last_break > chunk_size * 0.3:
                    end = start + last_break
            elif '. ' in chunk:
                last_period = chunk.rfind('. ')
                if last_period > chunk_size * 0.3:
                    end = start + last_period + 1

            chunk = text[start:end].strip()
            if chunk:
                chunks.append(chunk)

            start = max(start + 1, end)

        return chunks

    async def process_chunk(self, chunk: str, chunk_number: int, url: str, source: str) -> ProcessedChunk:
        """Process a single chunk of text."""
        extracted = await self.get_title_and_summary(chunk, url)
        embedding = await self.get_embedding(chunk)
        metadata = {
            "source": source,
            "chunk_size": len(chunk),
            "crawled_at": datetime.now(timezone.utc).isoformat(),
            "url_path": urlparse(url).path  # Store the actual URL path in metadata
        }
        return ProcessedChunk(
            url=extracted['title'],  # Use the title for the `url` field
            chunk_number=chunk_number,
            title=extracted['title'],
            summary=extracted['summary'],
            content=chunk,
            metadata=metadata,
            embedding=embedding
        )

    async def get_title_and_summary(self, chunk: str, url: str) -> Dict[str, str]:
        """Extract title and summary using GPT-4."""
        system_prompt = """You are an AI that extracts titles and summaries from documentation chunks.
        Return a JSON object with 'title' and 'summary' keys.
        For the title: If this seems like the start of a document, extract its title. If it's a middle chunk, derive a descriptive title.
        For the summary: Create a concise summary of the main points in this chunk.
        Keep both title and summary concise but informative."""
        
        try:
            response = await openai_client.chat.completions.create(
                model=os.getenv("LLM_MODEL", "gpt-4-turbo-preview"),
                messages=[
                    {"role": "system", "content": system_prompt},
                    {"role": "user", "content": f"URL: {url}\n\nContent:\n{chunk[:1000]}..."}
                ],
                response_format={ "type": "json_object" }
            )
            return json.loads(response.choices[0].message.content)
        except Exception as e:
            print(f"Error getting title and summary: {e}")
            return {"title": "Error processing title", "summary": "Error processing summary"}

    async def get_embedding(self, text: str) -> List[float]:
        """Get embedding vector from OpenAI."""
        try:
            response = await openai_client.embeddings.create(
                model="text-embedding-3-small",
                input=text
            )
            return response.data[0].embedding
        except Exception as e:
            print(f"Error getting embedding: {e}")
            return [0] * 1536

    async def insert_chunk(self, chunk: ProcessedChunk):
        """Insert a processed chunk into Supabase."""
        try:
            data = {
                "url": chunk.url,  # This now stores the title
                "chunk_number": chunk.chunk_number,
                "title": chunk.title,
                "summary": chunk.summary,
                "content": chunk.content,
                "metadata": chunk.metadata,
                "embedding": chunk.embedding
            }
            result = supabase.table("site_pages").insert(data).execute()
            print(f"Inserted chunk {chunk.chunk_number} for {chunk.url}")
            return result
        except Exception as e:
            print(f"Error inserting chunk: {e}")
            return None

    def get_urls_from_sitemap_file(self, sitemap_file) -> List[str]:
        """Extract URLs from an uploaded sitemap.xml file."""
        try:
            # Read the uploaded file directly
            content = sitemap_file.read().decode("utf-8")
            
            # Parse the XML content
            root = ElementTree.fromstring(content)
            namespace = {'ns': 'http://www.sitemaps.org/schemas/sitemap/0.9'}
            urls = [loc.text for loc in root.findall('.//ns:loc', namespace)]
            return urls
        except Exception as e:
            print(f"Error parsing sitemap file: {e}")
            return []

    async def process_sitemap_file(self, sitemap_file, source: str):
        """Process all URLs in an uploaded sitemap.xml file."""
        urls = self.get_urls_from_sitemap_file(sitemap_file)
        if not urls:
            print("No URLs found in sitemap.")
            return
        
        for url in urls:
            await self.crawl_website(url, source)