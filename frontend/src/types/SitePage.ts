export interface SitePage {
  id: number;
  url: string;
  chunk_number: number;
  title: string;
  summary: string;
  content: string;
  metadata: Record<string, any>; // or a more specific type if metadata has a fixed structure
  embedding: number[] | null; // Adjust based on the actual type of embedding
  created_at: string; // or Date if you parse it
}
