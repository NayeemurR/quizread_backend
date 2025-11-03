import { Storage } from "npm:@google-cloud/storage@7.7.0";

/**
 * Initialize Google Cloud Storage client with credentials.
 * Supports multiple credential sources:
 * 1. GOOGLE_APPLICATION_CREDENTIALS_JSON (for cloud platforms like Render.com) - JSON string
 * 2. GOOGLE_APPLICATION_CREDENTIALS (for local development) - file path
 * 3. Default credentials (if using gcloud auth)
 */
async function initializeStorage(): Promise<Storage> {
  try {
    const credentialsJson = Deno.env.get("GOOGLE_APPLICATION_CREDENTIALS_JSON");
    if (credentialsJson) {
      // Parse the JSON string and use it as credentials (for Render.com and cloud platforms)
      const credentials = JSON.parse(credentialsJson);
      return new Storage({
        credentials,
      });
    } else {
      // Fallback to file path or default credentials
      const credentialsPath = Deno.env.get("GOOGLE_APPLICATION_CREDENTIALS");
      if (credentialsPath) {
        const credentials = JSON.parse(
          await Deno.readTextFile(credentialsPath),
        );
        return new Storage({
          credentials,
        });
      } else {
        // Use default credentials (for local development with gcloud auth)
        return new Storage();
      }
    }
  } catch (error) {
    console.error("Error initializing GCS Storage client:", error);
    throw new Error(
      "Failed to initialize GCS Storage. Please set GOOGLE_APPLICATION_CREDENTIALS_JSON environment variable with your service account JSON (for cloud) or GOOGLE_APPLICATION_CREDENTIALS for local development.",
    );
  }
}

// Initialize Google Cloud Storage client
const storage = await initializeStorage();

// Export storage instance for use in other modules
export { storage };

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
 * Generates a signed URL for viewing/downloading a file from Google Cloud Storage
 */
export async function generateSignedViewUrl(
  fileName: string,
  expiresInMinutes: number = 60,
): Promise<{ signedUrl: string } | { error: string }> {
  try {
    const bucket = storage.bucket(BUCKET_NAME);
    const file = bucket.file(fileName);

    // Generate signed URL for viewing/downloading
    const [signedUrl] = await file.getSignedUrl({
      version: "v4",
      action: "read",
      expires: Date.now() + expiresInMinutes * 60 * 1000,
    });

    return { signedUrl };
  } catch (error) {
    console.error("Error generating signed view URL:", error);
    return { error: "Failed to generate view URL" };
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
