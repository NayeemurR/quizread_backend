import { Collection, Db } from "mongodb";
import { Empty, ID } from "@utils/types.ts";
import { freshID } from "@utils/database.ts";
import {
  deleteFile,
  generateSignedUploadUrl,
  generateSignedViewUrl,
  verifyFileExists,
} from "@utils/gcs.ts";

// Collection prefix to ensure namespace separation
const PREFIX = "Library" + ".";

// Generic types for the concept's external dependencies
type User = ID;
type Book = ID;

// Internal entity types, represented as IDs
type LibraryBook = ID;

/**
 * State: A set of Books with owner, metadata, and Google Cloud storage link.
 */
interface BookDoc {
  _id: LibraryBook;
  ownerId: User;
  title: string;
  storageUrl: string; // URL to Google Cloud storage where PDF is stored
  createdAt: Date;
}

/**
 * @concept Library
 * @purpose Store metadata about books a user owns/reads with links to Google Cloud storage
 */
export default class LibraryConcept {
  books: Collection<BookDoc>;

  constructor(private readonly db: Db) {
    this.books = this.db.collection(PREFIX + "books");
  }

  /**
   * Action: Prepares a file upload by generating a signed URL for Google Cloud Storage.
   * @requires fileName must be non-empty
   * @requires contentType must be application/pdf
   * @effects Returns signed URL for direct upload to GCS
   */
  async prepareUpload(
    {
      ownerId,
      fileName,
      contentType = "application/pdf",
    }: {
      ownerId: User;
      fileName: string;
      contentType?: string;
    },
  ): Promise<
    { signedUrl: string; publicUrl: string; fileName: string } | {
      error: string;
    }
  > {
    if (!fileName || fileName.trim().length === 0) {
      return { error: "fileName cannot be empty" };
    }

    const result = await generateSignedUploadUrl(
      fileName,
      contentType,
      ownerId,
    );
    if ("error" in result) {
      return result;
    }

    return {
      signedUrl: result.signedUrl,
      publicUrl: result.publicUrl,
      fileName: result.fileName,
    };
  }

  /**
   * Action: Adds a new book to the user's library.
   * @requires title must be non-empty
   * @requires storageUrl must be non-empty
   * @effects Inserts a book with link to Google Cloud storage
   */
  async addBook(
    {
      ownerId,
      title,
      storageUrl,
      fileName,
    }: {
      ownerId: User;
      title: string;
      storageUrl: string;
      fileName?: string; // Optional: for verification
    },
  ): Promise<{ bookId: LibraryBook } | { error: string }> {
    if (!title || title.trim().length === 0) {
      return { error: "title cannot be empty" };
    }
    if (!storageUrl || storageUrl.trim().length === 0) {
      return { error: "storageUrl cannot be empty" };
    }

    // Verify the file exists in Google Cloud Storage if fileName is provided
    if (fileName) {
      const fileExists = await verifyFileExists(fileName);
      if (!fileExists) {
        return {
          error: "File not found in storage. Please upload the file first.",
        };
      }
    }

    const bookId = freshID() as LibraryBook;
    await this.books.insertOne({
      _id: bookId,
      ownerId,
      title,
      storageUrl,
      createdAt: new Date(),
    });

    return { bookId };
  }

  /**
   * Action: Checks if a book exists.
   * @requires Book must exist
   * @effects Returns whether book exists (for tests)
   */
  async getBook(
    { bookId }: { bookId: LibraryBook },
  ): Promise<{ exists: boolean } | { error: string }> {
    const book = await this.books.findOne({ _id: bookId });
    return { exists: !!book };
  }

  /**
   * Action: Lists all books owned by a user.
   * @requires User must exist
   * @effects Returns books owned by user
   */
  async listBooks(
    { ownerId }: { ownerId: User },
  ): Promise<{ bookIds: LibraryBook[] } | { error: string }> {
    const userBooks = await this.books.find({ ownerId }).toArray();
    const bookIds = userBooks.map((book) => book._id);
    return { bookIds };
  }

  /**
   * Action: Removes a book from the user's library.
   * @requires Book must exist and ownerId must match
   * @effects Deletes the book and its associated file from GCS
   */
  async removeBook(
    { ownerId, bookId }: { ownerId: User; bookId: LibraryBook },
  ): Promise<Empty | { error: string }> {
    const book = await this.books.findOne({ _id: bookId });
    if (!book) {
      return { error: "Book not found" };
    }
    if (book.ownerId !== ownerId) {
      return { error: "Book does not belong to user" };
    }

    // Extract fileName from storageUrl for GCS deletion
    const storageUrl = book.storageUrl;
    const fileName = storageUrl.split("/").slice(-2).join("/"); // Get books/userId/filename part

    // Delete from MongoDB first
    await this.books.deleteOne({ _id: bookId });

    // Delete from Google Cloud Storage (don't fail if this fails)
    try {
      await deleteFile(fileName);
    } catch (error) {
      console.warn(`Failed to delete file ${fileName} from GCS:`, error);
      // Don't return error since the book is already removed from MongoDB
    }

    return {};
  }

  /**
   * Action: Cleans up a failed upload by deleting the file from Google Cloud Storage.
   * @requires fileName must be non-empty
   * @effects Deletes the file from GCS
   */
  async cleanupFailedUpload(
    { fileName }: { fileName: string },
  ): Promise<Empty | { error: string }> {
    if (!fileName || fileName.trim().length === 0) {
      return { error: "fileName cannot be empty" };
    }

    const result = await deleteFile(fileName);
    if (!result.success) {
      return { error: result.error || "Failed to delete file" };
    }

    return {};
  }

  /**
   * Action: Generates a signed URL for viewing a book's PDF.
   * @requires bookId must exist and belong to ownerId
   * @effects Returns a signed URL for secure PDF access
   */
  async getViewUrl(
    { ownerId, bookId, expiresInMinutes = 60 }: {
      ownerId: User;
      bookId: LibraryBook;
      expiresInMinutes?: number;
    },
  ): Promise<{ viewUrl: string } | { error: string }> {
    // Verify the book exists and belongs to the user
    const book = await this.books.findOne({ _id: bookId });
    if (!book) {
      return { error: "Book not found" };
    }
    if (book.ownerId !== ownerId) {
      return { error: "Book does not belong to user" };
    }

    // Extract fileName from storageUrl
    const storageUrl = book.storageUrl;
    const fileName = storageUrl.split("/").slice(-2).join("/"); // Get books/userId/filename part

    // Generate signed URL for viewing
    const result = await generateSignedViewUrl(fileName, expiresInMinutes);
    if ("error" in result) {
      return result;
    }

    return { viewUrl: result.signedUrl };
  }

  /**
   * Query: Retrieves a book by its ID.
   */
  async _getBook(
    { bookId }: { bookId: LibraryBook },
  ): Promise<BookDoc | null> {
    return await this.books.findOne({ _id: bookId });
  }

  /**
   * Query: Retrieves all books owned by a specific user.
   */
  async _getUserBooks(
    { ownerId }: { ownerId: User },
  ): Promise<BookDoc[]> {
    return await this.books.find({ ownerId }).sort({ createdAt: -1 }).toArray();
  }

  /**
   * Query: Retrieves all books in the library.
   */
  async _getAllBooks(): Promise<BookDoc[]> {
    return await this.books.find({}).sort({ createdAt: -1 }).toArray();
  }
}
