import asyncio
from flask import Blueprint, jsonify, request
from supabase import create_client, Client
from dotenv import load_dotenv
import os
import logging

from components.pdf_processor_c import process_and_store_document
from components.sitemap_processor import SiteMapProcessor
from components.web_link_processor import WebCrawlerProcessor

# Load environment variables from .env file
load_dotenv()

# Blueprint and chatbot instance
supabase_bp = Blueprint("supa", __name__)
logger = logging.getLogger(__name__)

# Initialize Supabase client using environment variables
supabase_url = os.getenv("SUPABASE_URL")
supabase_key = os.getenv("SUPABASE_SERVICE_KEY")
supabase: Client = create_client(supabase_url, supabase_key)

# Route to fetch all site pages
@supabase_bp.route('/GetAllSitePages', methods=['GET'])
def GetAllSitePages():
    try:
        # Fetch all records from the site_pages table
        response = supabase.table("site_pages").select("*").execute()
        
        # Extract data from the response
        site_pages_records = response.data

        return jsonify(site_pages_records), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# Route to delete a site page by id
@supabase_bp.route('/DeleteSitePage', methods=['POST'])
def DeleteSitePage():
    try:
        # Get data from the request body
        data = request.json
        page_id = data.get('page_id')

        # Validate required fields
        if not page_id:
            logger.error("Missing required fields in request.")
            return jsonify({"error": "page_id is required."}), 400

        # Fetch the site page to ensure it exists
        site_page = supabase.table("site_pages").select("*").eq("id", page_id).execute()
        if not site_page.data:
            logger.error(f"Site page not found: {page_id}")
            return jsonify({"error": "Site page not found."}), 404

        # Delete the site page
        supabase.table("site_pages").delete().eq("id", page_id).execute()
        logger.info(f"Site page deleted successfully: {page_id}")

        return jsonify({"message": "Site page deleted successfully"}), 200

    except Exception as e:
        logger.error(f"An unexpected error occurred: {str(e)}", exc_info=True)
        return jsonify({"error": "An unexpected error occurred.", "details": str(e)}), 500
    
# Route to process a PDF file
@supabase_bp.route('/ProcessPDF', methods=['POST'])
def process_pdf():
    try:
        # Get data from the request
        url = request.form.get('url')
        source = request.form.get('source')
        pdf_file = request.files.get('pdf_file')

        if not all([url, source, pdf_file]):
            return jsonify({"error": "Missing required fields"}), 400

        # Process the PDF file
        asyncio.run(process_and_store_document(url, source, pdf_file))

        return jsonify({"message": "PDF processed successfully"}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@supabase_bp.route('/ProcessWebCrawl', methods=['POST'])
def process_web_crawl():
    try:
        # Get data from the request
        url = request.form.get('url')
        source = request.form.get('source')

        # Validate required fields
        if not all([url, source]):
            return jsonify({"error": "Missing required fields"}), 400

        # Process the web crawl asynchronously
        async def run_crawl():
            async with WebCrawlerProcessor() as processor:
                await processor.crawl_website(url, source)

        # Run the async function in the event loop
        asyncio.run(run_crawl())

        return jsonify({"message": "Web crawl processed successfully"}), 200
    except Exception as e:
        logger.error(f"Error in process_web_crawl: {e}")
        return jsonify({"error": str(e)}), 500

@supabase_bp.route('/ProcessSiteMap', methods=['POST'])
def process_site_map():
    try:
        # Get data from the request
        sitemap_file = request.files.get('sitemap_file')
        source = request.form.get('source')

        # Validate required fields
        if not all([sitemap_file, source]):
            return jsonify({"error": "Missing required fields"}), 400

        # Process the sitemap file asynchronously
        async def run_sitemap_processing():
            async with SiteMapProcessor() as processor:
                await processor.process_sitemap_file(sitemap_file, source)

        # Run the async function in the event loop
        asyncio.run(run_sitemap_processing())

        return jsonify({"message": "Sitemap processed successfully"}), 200
    except Exception as e:
        logger.error(f"Error in process_site_map: {e}")
        return jsonify({"error": str(e)}), 500