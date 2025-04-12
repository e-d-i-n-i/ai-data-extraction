import { v4 as uuidv4 } from "uuid";

/**
 * Generates a UUID in the format: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
 * Example: 1846f2a6-e01c-11ef-a1d1-005056c00001
 * @returns {string} A UUID string.
 */
export function generateUUID(): string {
  return uuidv4();
}

// Example usage
console.log(generateUUID()); // Outputs something like: 1846f2a6-e01c-11ef-a1d1-005056c00001
