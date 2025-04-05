# AI-Powered Data Extraction and Storage System

## Overview

This AI-powered system is designed to extract, validate, structure, and store large volumes of unstructured data efficiently. It uses semantic search with vectorized storage to enable fast and intelligent information retrieval, making it ideal for Retrieval-Augmented Generation (RAG) applications.

## Features

- **Automated Data Extraction:** Extracts data in chunks using intelligent crawling techniques.
- **Structured Storage:** Stores extracted data in a format enriched with metadata for easy retrieval.
- **Semantic Search:** Integrates vector search using Supabase to enable context-aware information lookup.
- **Data Validation:** Ensures consistency and accuracy of extracted data using PydanticAI.
- **RAG-Ready:** Supports downstream AI tasks like document-based question answering and summarization.

## Tech Stack

- **Backend:** Python
- **Data Extraction:** Crawl4AI
- **Data Validation & Structuring:** PydanticAI
- **Storage:** Supabase (with vector column)
- **AI Integration:** Retrieval-Augmented Generation (RAG), Semantic Search

## Installation

### Prerequisites

- Python 3.9+
- Supabase Account

### Setup Instructions

1. Clone the repository:

   ```sh
   git clone https://github.com/e-d-i-n-i/ai-data-extraction.git
   cd ai-data-extraction
   ```

2. Create a virtual environment and activate it:

   ```sh
   python -m venv venv
   source venv/bin/activate  # Windows: venv\Scripts\activate
   ```

3. Install the dependencies:

   ```sh
   pip install -r requirements.txt
   ```

4. Set up your environment variables in a `.env` file:

   ```env
   SUPABASE_URL=your_supabase_url
   SUPABASE_KEY=your_supabase_api_key
   ```

5. Run the system:
   ```sh
   python main.py
   ```

## Usage

1. Configure data sources in the system.
2. Run the extractor to crawl and fetch unstructured data.
3. Validate and structure data using PydanticAI.
4. Store structured data in Supabase with vector embedding.
5. Perform semantic search or integrate with RAG pipelines for intelligent applications.

## Contributing

We welcome your contributions!

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

This project is licensed under the MIT License.

## Contact

For questions or suggestions, contact **Edini Amare** at [edini.amare.gw@gmail.com] or visit [www.edini.dev].
