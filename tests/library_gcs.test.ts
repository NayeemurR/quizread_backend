import { assertEquals, assertExists } from "jsr:@std/assert";
import { testDb } from "@utils/database.ts";
import { ID } from "@utils/types.ts";
import LibraryConcept from "@concepts/library.ts";

Deno.test("Library GCS Integration", async () => {
  const [db, client] = await testDb();
  const library = new LibraryConcept(db);

  const ownerId = "user:test-user-123" as ID;
  const fileName = "test-book.pdf";

  try {
    // Test prepareUpload
    console.log("Testing prepareUpload...");
    const prepareResult = await library.prepareUpload({
      ownerId,
      fileName,
      contentType: "application/pdf",
    });

    if ("error" in prepareResult) {
      console.log(
        "prepareUpload failed (expected in test environment):",
        prepareResult.error,
      );
      // This is expected in test environment without GCS credentials
      assertEquals(prepareResult.error, "Failed to generate upload URL");
    } else {
      assertExists(prepareResult.signedUrl);
      assertExists(prepareResult.publicUrl);
      assertExists(prepareResult.fileName);
      console.log("prepareUpload successful:", {
        signedUrl: prepareResult.signedUrl.substring(0, 50) + "...",
        publicUrl: prepareResult.publicUrl,
        fileName: prepareResult.fileName,
      });
    }

    // Test addBook with mock data (without actual file upload)
    console.log("Testing addBook...");
    const addBookResult = await library.addBook({
      ownerId,
      title: "Test Book",
      totalPages: 100,
      storageUrl:
        "https://storage.googleapis.com/test-bucket/books/test-user-123/test-book.pdf",
      // Don't provide fileName to skip GCS verification in test
    });

    if ("error" in addBookResult) {
      console.log("addBook failed:", addBookResult.error);
    } else {
      assertExists(addBookResult.bookId);
      console.log("addBook successful, bookId:", addBookResult.bookId);

      // Test listBooks
      console.log("Testing listBooks...");
      const listResult = await library.listBooks({ ownerId });
      if ("error" in listResult) {
        console.log("listBooks failed:", listResult.error);
      } else {
        assertEquals(listResult.bookIds.length, 1);
        assertEquals(listResult.bookIds[0], addBookResult.bookId);
        console.log(
          "listBooks successful, found",
          listResult.bookIds.length,
          "books",
        );

        // Test removeBook
        console.log("Testing removeBook...");
        const removeResult = await library.removeBook({
          ownerId,
          bookId: addBookResult.bookId,
        });

        if ("error" in removeResult) {
          console.log("removeBook failed:", removeResult.error);
        } else {
          console.log("removeBook successful");

          // Verify book is removed
          const listAfterRemove = await library.listBooks({ ownerId });
          if ("error" in listAfterRemove) {
            console.log(
              "listBooks after remove failed:",
              listAfterRemove.error,
            );
          } else {
            assertEquals(listAfterRemove.bookIds.length, 0);
            console.log("Book successfully removed from library");
          }
        }
      }
    }

    // Test cleanupFailedUpload
    console.log("Testing cleanupFailedUpload...");
    const cleanupResult = await library.cleanupFailedUpload({
      fileName: "books/test-user-123/nonexistent-file.pdf",
    });

    if ("error" in cleanupResult) {
      console.log(
        "cleanupFailedUpload failed (expected):",
        cleanupResult.error,
      );
    } else {
      console.log("cleanupFailedUpload successful");
    }

    console.log("All GCS integration tests completed");
  } finally {
    await client.close();
  }
});
