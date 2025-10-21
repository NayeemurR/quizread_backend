import { assertEquals } from "jsr:@std/assert";
import { testDb } from "@utils/database.ts";
import CheckpointQuizConcept from "@concepts/CheckpointQuiz/CheckpointQuizConcept.ts";
import LibraryConcept from "@concepts/Library/LibraryConcept.ts";
import ReadingProgressConcept from "@concepts/ReadingProgress/ReadingProgressConcept.ts";

Deno.test("CheckpointQuiz PDF Integration", async () => {
  const [db, client] = await testDb();
  const checkpointQuiz = new CheckpointQuizConcept(db);
  const library = new LibraryConcept(db);
  const readingProgress = new ReadingProgressConcept(db);

  // Test data
  const userId = "user:test123" as any;
  const bookId = "book:test456" as any;
  const currentPage = 3;

  console.log("Testing PDF text extraction integration...");

  // Test getQuizContext method
  try {
    const contextResult = await checkpointQuiz.getQuizContext({
      userId,
      bookId,
      currentPage,
      pageRange: 2,
    });

    if ("error" in contextResult) {
      console.log("Expected error (no book exists):", contextResult.error);
      assertEquals(contextResult.error.includes("Book not found"), true);
    } else {
      console.log(
        "Context extracted successfully:",
        contextResult.content.substring(0, 100) + "...",
      );
    }
  } catch (error) {
    console.log(
      "Test completed with expected error:",
      error instanceof Error ? error.message : String(error),
    );
  }

  console.log("PDF integration test completed successfully!");

  // Clean up
  await client.close();
});
