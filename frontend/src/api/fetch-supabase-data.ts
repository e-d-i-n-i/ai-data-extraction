import { type SitePage } from "@/types/SitePage";

export const GetAllSitePages = async (): Promise<SitePage[]> => {
  try {
    // Fetch data from the GetAllSitePages route
    const response = await fetch(
      "http://127.0.0.1:5000/api/kb/GetAllSitePages",
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch data: ${response.statusText}`);
    }

    const data = await response.json();

    // Validate and process the data
    const processedData = data.map((page: any) => ({
      id: page.id,
      url: page.url,
      chunk_number: page.chunk_number,
      title: page.title,
      summary: page.summary,
      content: page.content,
      metadata: page.metadata,
      embedding: page.embedding, // Ensure this matches the response structure
      created_at: page.created_at,
    }));

    return processedData as SitePage[];
  } catch (error) {
    console.error("Error fetching site pages:", error);
    return []; // Return an empty array in case of an error
  }
};
