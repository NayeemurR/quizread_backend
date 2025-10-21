import { Storage } from "npm:@google-cloud/storage@7.7.0";

// Initialize Google Cloud Storage client
const storage = new Storage({
  // Credentials will be loaded from environment variables or service account key file
  // Set GOOGLE_APPLICATION_CREDENTIALS environment variable or use default credentials
});

// Configuration
const BUCKET_NAME = Deno.env.get("GCS_BUCKET_NAME") || "quizread-books";
const UPLOAD_EXPIRY_MINUTES = 60; // Signed URL expires in 1 hour

export interface UploadConfig {
  bucketName: string;
  fileName: string;
  contentType: string;
  expiresInMinutes: number;
}

export interface SignedUrlResult {
  signedUrl: string;
  publicUrl: string;
  fileName: string;
}

/**
 * Generates a signed URL for uploading a file to Google Cloud Storage
 */
export async function generateSignedUploadUrl(
  fileName: string,
  contentType: string = "application/pdf",
  userId: string,
): Promise<SignedUrlResult | { error: string }> {
  try {
    // Validate file type
    if (!contentType.startsWith("application/pdf")) {
      return { error: "Only PDF files are allowed" };
    }

    // Generate unique filename to prevent conflicts
    const timestamp = Date.now();
    const sanitizedFileName = fileName.replace(/[^a-zA-Z0-9.-]/g, "_");
    const uniqueFileName = `books/${userId}/${timestamp}_${sanitizedFileName}`;

    const bucket = storage.bucket(BUCKET_NAME);
    const file = bucket.file(uniqueFileName);

    // Generate signed URL for upload
    const [signedUrl] = await file.getSignedUrl({
      version: "v4",
      action: "write",
      expires: Date.now() + UPLOAD_EXPIRY_MINUTES * 60 * 1000,
      contentType,
    });

    // Generate public URL for accessing the file
    const publicUrl =
      `https://storage.googleapis.com/${BUCKET_NAME}/${uniqueFileName}`;

    return {
      signedUrl,
      publicUrl,
      fileName: uniqueFileName,
    };
  } catch (error) {
    console.error("Error generating signed URL:", error);
    return { error: "Failed to generate upload URL" };
  }
}

/**
 * Verifies that a file exists in Google Cloud Storage
 */
export async function verifyFileExists(fileName: string): Promise<boolean> {
  try {
    const bucket = storage.bucket(BUCKET_NAME);
    const file = bucket.file(fileName);
    const [exists] = await file.exists();
    return exists;
  } catch (error) {
    console.error("Error verifying file existence:", error);
    return false;
  }
}

/**
 * Deletes a file from Google Cloud Storage
 */
export async function deleteFile(
  fileName: string,
): Promise<{ success: boolean; error?: string }> {
  try {
    const bucket = storage.bucket(BUCKET_NAME);
    const file = bucket.file(fileName);
    await file.delete();
    return { success: true };
  } catch (error) {
    console.error("Error deleting file:", error);
    return { success: false, error: "Failed to delete file" };
  }
}

/**
 * Gets file metadata from Google Cloud Storage
 */
export async function getFileMetadata(fileName: string) {
  try {
    const bucket = storage.bucket(BUCKET_NAME);
    const file = bucket.file(fileName);
    const [metadata] = await file.getMetadata();
    return metadata;
  } catch (error) {
    console.error("Error getting file metadata:", error);
    return null;
  }
}
