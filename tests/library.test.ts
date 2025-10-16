import { assertEquals, assertExists, assertNotEquals } from "jsr:@std/assert";
import { testDb } from "@utils/database.ts";
import { ID } from "@utils/types.ts";
import LibraryConcept from "@concepts/library.ts";

const userA = "user:Alice" as ID;
const userB = "user:Bob" as ID;

Deno.test("Principle: Add book to library, verify it exists, list user's books, and remove it", async () => {
  const [db, client] = await testDb();
  const libraryConcept = new LibraryConcept(db);

  try {
    console.log("[OP] Starting operational principle test");

    // 1. Add a book to the library
    const title = "The Great Book";
    const totalPages = 300;
    const storageUrl =
      "https://storage.googleapis.com/bucket/the-great-book.pdf";
    console.log("[OP] Adding book with:", { title, totalPages, storageUrl });

    const addResult = await libraryConcept.addBook({
      ownerId: userA,
      title,
      totalPages,
      storageUrl,
    });
    assertNotEquals(
      "error" in addResult,
      true,
      "Adding book should not fail.",
    );
    const { bookId } = addResult as { bookId: ID };
    assertExists(bookId);
    console.log("[OP] Added book with ID:", bookId);

    // 2. Verify the book exists
    const getResult = await libraryConcept.getBook({ bookId });
    assertNotEquals(
      "error" in getResult,
      true,
      "Getting book should not fail.",
    );
    const { exists } = getResult as { exists: boolean };
    assertEquals(exists, true, "Book should exist after adding");
    console.log("[OP] Verified book exists");

    // 3. List user's books
    const listResult = await libraryConcept.listBooks({ ownerId: userA });
    assertNotEquals(
      "error" in listResult,
      true,
      "Listing books should not fail.",
    );
    const { bookIds } = listResult as { bookIds: ID[] };
    assertEquals(bookIds.length, 1, "User should have one book");
    assertEquals(bookIds[0], bookId, "Listed book should match added book");
    console.log("[OP] Listed user's books correctly");

    // 4. Verify book details
    const book = await libraryConcept._getBook({ bookId });
    assertExists(book);
    assertEquals(book.title, title, "Book title should match");
    assertEquals(book.totalPages, totalPages, "Book total pages should match");
    assertEquals(book.storageUrl, storageUrl, "Book storage URL should match");
    assertEquals(book.ownerId, userA, "Book owner should match");
    console.log("[OP] Verified book details");

    // 5. Remove the book
    const removeResult = await libraryConcept.removeBook({
      ownerId: userA,
      bookId,
    });
    assertNotEquals(
      "error" in removeResult,
      true,
      "Removing book should not fail.",
    );
    console.log("[OP] Removed book successfully");

    // 6. Verify book no longer exists
    const getAfterRemoveResult = await libraryConcept.getBook({ bookId });
    assertNotEquals(
      "error" in getAfterRemoveResult,
      true,
      "Getting book after removal should not fail.",
    );
    const { exists: existsAfterRemove } = getAfterRemoveResult as {
      exists: boolean;
    };
    assertEquals(
      existsAfterRemove,
      false,
      "Book should not exist after removal",
    );
    console.log("[OP] Verified book no longer exists");
  } finally {
    await client.close();
  }
});

Deno.test("Action: addBook requires valid parameters", async () => {
  const [db, client] = await testDb();
  const libraryConcept = new LibraryConcept(db);

  try {
    console.log("[VARIANT] Testing empty title");

    const emptyTitleResult = await libraryConcept.addBook({
      ownerId: userA,
      title: "",
      totalPages: 100,
      storageUrl: "https://storage.googleapis.com/bucket/book.pdf",
    });
    assertEquals(
      "error" in emptyTitleResult,
      true,
      "Adding book with empty title should fail.",
    );
    console.log("[VARIANT] Empty title correctly rejected");

    console.log("[VARIANT] Testing zero total pages");

    const zeroPagesResult = await libraryConcept.addBook({
      ownerId: userA,
      title: "Test Book",
      totalPages: 0,
      storageUrl: "https://storage.googleapis.com/bucket/book.pdf",
    });
    assertEquals(
      "error" in zeroPagesResult,
      true,
      "Adding book with zero pages should fail.",
    );
    console.log("[VARIANT] Zero pages correctly rejected");

    console.log("[VARIANT] Testing empty storage URL");

    const emptyStorageUrlResult = await libraryConcept.addBook({
      ownerId: userA,
      title: "Test Book",
      totalPages: 100,
      storageUrl: "",
    });
    assertEquals(
      "error" in emptyStorageUrlResult,
      true,
      "Adding book with empty storage URL should fail.",
    );
    console.log("[VARIANT] Empty storage URL correctly rejected");
  } finally {
    await client.close();
  }
});

Deno.test("Action: removeBook requires existing book and correct ownership", async () => {
  const [db, client] = await testDb();
  const libraryConcept = new LibraryConcept(db);

  try {
    console.log("[VARIANT] Testing removal of non-existent book");

    const nonExistentBookId = "book:fake" as ID;
    const result = await libraryConcept.removeBook({
      ownerId: userA,
      bookId: nonExistentBookId,
    });
    assertEquals(
      "error" in result,
      true,
      "Removing non-existent book should fail.",
    );
    console.log("[VARIANT] Non-existent book correctly rejected");

    console.log("[VARIANT] Testing removal by wrong owner");

    // Add a book for userA
    const { bookId } = (await libraryConcept.addBook({
      ownerId: userA,
      title: "Test Book",
      totalPages: 100,
      storageUrl: "https://storage.googleapis.com/bucket/test-book.pdf",
    })) as { bookId: ID };

    // Try to remove as userB
    const wrongOwnerResult = await libraryConcept.removeBook({
      ownerId: userB,
      bookId,
    });
    assertEquals(
      "error" in wrongOwnerResult,
      true,
      "Removing book by wrong owner should fail.",
    );
    console.log("[VARIANT] Wrong owner correctly rejected");
  } finally {
    await client.close();
  }
});

Deno.test("Action: listBooks returns only books owned by the user", async () => {
  const [db, client] = await testDb();
  const libraryConcept = new LibraryConcept(db);

  try {
    console.log("[VARIANT] Testing book isolation by user");

    // Add books for different users
    const { bookId: book1 } = (await libraryConcept.addBook({
      ownerId: userA,
      title: "Alice's Book",
      totalPages: 100,
      storageUrl: "https://storage.googleapis.com/bucket/alice-book.pdf",
    })) as { bookId: ID };

    const { bookId: book2 } = (await libraryConcept.addBook({
      ownerId: userB,
      title: "Bob's Book",
      totalPages: 200,
      storageUrl: "https://storage.googleapis.com/bucket/bob-book.pdf",
    })) as { bookId: ID };

    const { bookId: book3 } = (await libraryConcept.addBook({
      ownerId: userA,
      title: "Alice's Second Book",
      totalPages: 150,
      storageUrl: "https://storage.googleapis.com/bucket/alice-book-2.pdf",
    })) as { bookId: ID };

    // List books for userA
    const userABooksResult = await libraryConcept.listBooks({ ownerId: userA });
    assertNotEquals(
      "error" in userABooksResult,
      true,
      "Listing books for userA should not fail.",
    );
    const { bookIds: userABooks } = userABooksResult as { bookIds: ID[] };
    assertEquals(userABooks.length, 2, "UserA should have two books");
    assertEquals(userABooks.includes(book1), true, "UserA should have book1");
    assertEquals(userABooks.includes(book3), true, "UserA should have book3");
    assertEquals(
      userABooks.includes(book2),
      false,
      "UserA should not have book2",
    );

    // List books for userB
    const userBBooksResult = await libraryConcept.listBooks({ ownerId: userB });
    assertNotEquals(
      "error" in userBBooksResult,
      true,
      "Listing books for userB should not fail.",
    );
    const { bookIds: userBBooks } = userBBooksResult as { bookIds: ID[] };
    assertEquals(userBBooks.length, 1, "UserB should have one book");
    assertEquals(userBBooks.includes(book2), true, "UserB should have book2");
    assertEquals(
      userBBooks.includes(book1),
      false,
      "UserB should not have book1",
    );

    console.log("[VARIANT] Book isolation working correctly");
  } finally {
    await client.close();
  }
});

Deno.test("Action: getBook correctly identifies book existence", async () => {
  const [db, client] = await testDb();
  const libraryConcept = new LibraryConcept(db);

  try {
    console.log("[VARIANT] Testing book existence detection");

    // Test non-existent book
    const nonExistentBookId = "book:fake" as ID;
    const nonExistentResult = await libraryConcept.getBook({
      bookId: nonExistentBookId,
    });
    assertNotEquals(
      "error" in nonExistentResult,
      true,
      "Getting non-existent book should not fail.",
    );
    const { exists: nonExistentExists } = nonExistentResult as {
      exists: boolean;
    };
    assertEquals(
      nonExistentExists,
      false,
      "Non-existent book should return false",
    );

    // Add a real book
    const { bookId } = (await libraryConcept.addBook({
      ownerId: userA,
      title: "Real Book",
      totalPages: 100,
      storageUrl: "https://storage.googleapis.com/bucket/real-book.pdf",
    })) as { bookId: ID };

    // Test existing book
    const existingResult = await libraryConcept.getBook({ bookId });
    assertNotEquals(
      "error" in existingResult,
      true,
      "Getting existing book should not fail.",
    );
    const { exists: existingExists } = existingResult as { exists: boolean };
    assertEquals(existingExists, true, "Existing book should return true");

    console.log("[VARIANT] Book existence detection working correctly");
  } finally {
    await client.close();
  }
});

Deno.test("Query: _getUserBooks retrieves books sorted by creation date", async () => {
  const [db, client] = await testDb();
  const libraryConcept = new LibraryConcept(db);

  try {
    console.log("[VARIANT] Testing user books retrieval with sorting");

    // Add multiple books for userA with small delays to ensure different timestamps
    const { bookId: book1 } = (await libraryConcept.addBook({
      ownerId: userA,
      title: "First Book",
      totalPages: 100,
      storageUrl: "https://storage.googleapis.com/bucket/first-book.pdf",
    })) as { bookId: ID };

    // Small delay to ensure different timestamps
    await new Promise((resolve) => setTimeout(resolve, 10));

    const { bookId: book2 } = (await libraryConcept.addBook({
      ownerId: userA,
      title: "Second Book",
      totalPages: 200,
      storageUrl: "https://storage.googleapis.com/bucket/second-book.pdf",
    })) as { bookId: ID };

    // Get user books (should be sorted by creation date, newest first)
    const userBooks = await libraryConcept._getUserBooks({ ownerId: userA });
    assertEquals(userBooks.length, 2, "User should have two books");
    assertEquals(userBooks[0]._id, book2, "First book should be the newer one");
    assertEquals(
      userBooks[1]._id,
      book1,
      "Second book should be the older one",
    );
    assertEquals(
      userBooks[0].title,
      "Second Book",
      "First book title should match",
    );
    assertEquals(
      userBooks[1].title,
      "First Book",
      "Second book title should match",
    );

    console.log("[VARIANT] User books retrieved with correct sorting");
  } finally {
    await client.close();
  }
});
