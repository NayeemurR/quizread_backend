import { Storage } from "npm:@google-cloud/storage@7.7.0";
import pdf from "npm:pdf-parse@1.1.1";

// Initialize Google Cloud Storage client
const storage = new Storage({
  // Credentials will be loaded from environment variables or service account key file
});

// pdf-parse doesn't need worker configuration

const BUCKET_NAME = Deno.env.get("GCS_BUCKET_NAME") || "quizread-books";

export interface TextExtractionResult {
  text: string;
  pageCount: number;
}

export interface PageRange {
  startPage: number;
  endPage: number;
}

/**
 * Extracts text from a PDF stored in Google Cloud Storage
 * @param fileName - The GCS file name (e.g., "books/userId/timestamp_filename.pdf")
 * @param pageRange - Optional page range to extract (1-based indexing)
 * @returns Extracted text and page count
 */
export async function extractTextFromPDF(
  fileName: string,
  pageRange?: PageRange,
): Promise<TextExtractionResult | { error: string }> {
  try {
    // Get the PDF file from GCS
    const bucket = storage.bucket(BUCKET_NAME);
    const file = bucket.file(fileName);

    // Check if file exists
    const [exists] = await file.exists();
    if (!exists) {
      return { error: "PDF file not found in GCS" };
    }

    // Download the PDF as a buffer
    const [pdfBuffer] = await file.download();

    // Extract text using pdf-parse
    const data = await pdf(pdfBuffer);

    // Note: pdf-parse extracts all text, we can't easily extract specific pages
    // For now, we'll return all text and let the caller handle page filtering
    const extractedText = data.text;

    return {
      text: extractedText.trim(),
      pageCount: data.numpages || 1, // pdf-parse provides page count
    };
  } catch (error) {
    console.error("Error extracting text from PDF:", error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    return { error: `Failed to extract text: ${errorMessage}` };
  }
}

/**
 * Extracts text from a specific page range of a PDF
 * @param fileName - The GCS file name
 * @param currentPage - The current page number (1-based)
 * @param pageRange - Number of pages to extract around current page (default: 2)
 * @returns Extracted text from the specified page range
 */
export async function extractTextFromPageRange(
  fileName: string,
  currentPage: number,
  pageRange: number = 2,
): Promise<TextExtractionResult | { error: string }> {
  // For now, we'll extract all text since pdf-parse doesn't support page ranges easily
  // In a production system, you might want to implement page-specific extraction
  const result = await extractTextFromPDF(fileName);

  if ("error" in result) {
    return result;
  }

  // For now, return all text - in the future, you could implement text segmentation
  // based on page breaks or other heuristics
  return result;
}

/**
 * Gets the total page count of a PDF without extracting text
 * @param fileName - The GCS file name
 * @returns Total page count
 */
export async function getPDFPageCount(
  fileName: string,
): Promise<number | { error: string }> {
  try {
    const bucket = storage.bucket(BUCKET_NAME);
    const file = bucket.file(fileName);

    const [exists] = await file.exists();
    if (!exists) {
      return { error: "PDF file not found in GCS" };
    }

    const [pdfBuffer] = await file.download();
    const data = await pdf(pdfBuffer);

    return data.numpages || 1;
  } catch (error) {
    console.error("Error getting PDF page count:", error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    return { error: `Failed to get page count: ${errorMessage}` };
  }
}
