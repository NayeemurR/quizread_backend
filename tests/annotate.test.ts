import { assertEquals, assertExists, assertNotEquals } from "jsr:@std/assert";
import { testDb } from "@utils/database.ts";
import { ID } from "@utils/types.ts";
import AnnotateConcept from "@concepts/Annotate/AnnotateConcept.ts";

const userA = "user:Alice" as ID;
const userB = "user:Bob" as ID;
const bookA = "book:SampleBook" as ID;
const bookB = "book:AnotherBook" as ID;

Deno.test("Principle: User saves annotation with key ideas, system persists and retrieves it", async () => {
  const [db, client] = await testDb();
  const annotateConcept = new AnnotateConcept(db);

  try {
    console.log("[OP] Starting operational principle test");

    // 1. User saves an annotation with key ideas
    const content = "This is a sample text about technology and innovation.";
    const keyIdeas = "Key concepts: AI, machine learning, and automation";
    console.log("[OP] Saving annotation with content:", content);
    console.log("[OP] Key ideas:", keyIdeas);

    const saveResult = await annotateConcept.saveAnnotation({
      userId: userA,
      bookId: bookA,
      content,
      keyIdeas,
    });
    assertNotEquals(
      "error" in saveResult,
      true,
      "Annotation saving should not fail.",
    );
    const { annotationId } = saveResult as { annotationId: ID };
    assertExists(annotationId);
    console.log("[OP] Saved annotation with ID:", annotationId);

    // 2. System can retrieve the annotation
    const userAnnotations = await annotateConcept._getUserAnnotations({
      userId: userA,
      content,
    });
    assertEquals(
      userAnnotations.length,
      1,
      "User should have one annotation for this content.",
    );
    assertEquals(userAnnotations[0]._id, annotationId);
    assertEquals(userAnnotations[0].content, content);
    assertEquals(userAnnotations[0].keyIdeas, keyIdeas);
    assertEquals(userAnnotations[0].userId, userA);
    console.log("[OP] Verified annotation was saved and retrieved correctly");
  } finally {
    await client.close();
  }
});

Deno.test("Action: saveAnnotation requires non-empty keyIdeas", async () => {
  const [db, client] = await testDb();
  const annotateConcept = new AnnotateConcept(db);

  try {
    console.log("[VARIANT] Testing empty keyIdeas");

    const emptyResult = await annotateConcept.saveAnnotation({
      userId: userA,
      bookId: bookA,
      content: "Some content",
      keyIdeas: "",
    });
    assertEquals(
      "error" in emptyResult,
      true,
      "Saving annotation with empty keyIdeas should fail.",
    );
    console.log("[VARIANT] Empty keyIdeas correctly rejected");

    const whitespaceResult = await annotateConcept.saveAnnotation({
      userId: userA,
      bookId: bookA,
      content: "Some content",
      keyIdeas: "   ",
    });
    assertEquals(
      "error" in whitespaceResult,
      true,
      "Saving annotation with whitespace-only keyIdeas should fail.",
    );
    console.log("[VARIANT] Whitespace-only keyIdeas correctly rejected");
  } finally {
    await client.close();
  }
});

Deno.test("Action: saveAnnotation allows multiple annotations for same content", async () => {
  const [db, client] = await testDb();
  const annotateConcept = new AnnotateConcept(db);

  try {
    console.log("[VARIANT] Testing multiple annotations for same content");

    const content = "Sample content for multiple annotations";
    const keyIdeas1 = "First key idea: important concept";
    const keyIdeas2 = "Second key idea: another important concept";

    // Save first annotation
    const result1 = await annotateConcept.saveAnnotation({
      userId: userA,
      bookId: bookA,
      content,
      keyIdeas: keyIdeas1,
    });
    assertNotEquals(
      "error" in result1,
      true,
      "First annotation should save successfully.",
    );
    const { annotationId: id1 } = result1 as { annotationId: ID };
    console.log("[VARIANT] First annotation saved with ID:", id1);

    // Wait a bit to ensure different timestamps
    await new Promise((resolve) => setTimeout(resolve, 10));

    // Save second annotation
    const result2 = await annotateConcept.saveAnnotation({
      userId: userA,
      bookId: bookA,
      content,
      keyIdeas: keyIdeas2,
    });
    assertNotEquals(
      "error" in result2,
      true,
      "Second annotation should save successfully.",
    );
    const { annotationId: id2 } = result2 as { annotationId: ID };
    console.log("[VARIANT] Second annotation saved with ID:", id2);

    // Verify both annotations exist
    const userAnnotations = await annotateConcept._getUserAnnotations({
      userId: userA,
      content,
    });
    assertEquals(
      userAnnotations.length,
      2,
      "User should have two annotations for this content.",
    );
    assertEquals(userAnnotations[0]._id, id2); // Newer first due to sort
    assertEquals(userAnnotations[1]._id, id1);
    console.log("[VARIANT] Both annotations retrieved correctly");
  } finally {
    await client.close();
  }
});

Deno.test("Action: saveAnnotation isolates annotations by user", async () => {
  const [db, client] = await testDb();
  const annotateConcept = new AnnotateConcept(db);

  try {
    console.log("[VARIANT] Testing user isolation");

    const content = "Shared content between users";
    const keyIdeasA = "Alice's key ideas about this content";
    const keyIdeasB = "Bob's key ideas about this content";

    // Save annotation for userA
    const resultA = await annotateConcept.saveAnnotation({
      userId: userA,
      bookId: bookA,
      content,
      keyIdeas: keyIdeasA,
    });
    assertNotEquals(
      "error" in resultA,
      true,
      "UserA annotation should save successfully.",
    );
    const { annotationId: idA } = resultA as { annotationId: ID };
    console.log("[VARIANT] UserA annotation saved with ID:", idA);

    // Save annotation for userB
    const resultB = await annotateConcept.saveAnnotation({
      userId: userB,
      bookId: bookA,
      content,
      keyIdeas: keyIdeasB,
    });
    assertNotEquals(
      "error" in resultB,
      true,
      "UserB annotation should save successfully.",
    );
    const { annotationId: idB } = resultB as { annotationId: ID };
    console.log("[VARIANT] UserB annotation saved with ID:", idB);

    // Verify user isolation
    const userAAnnotations = await annotateConcept._getUserAnnotations({
      userId: userA,
      content,
    });
    assertEquals(
      userAAnnotations.length,
      1,
      "UserA should have one annotation.",
    );
    assertEquals(userAAnnotations[0]._id, idA);
    assertEquals(userAAnnotations[0].keyIdeas, keyIdeasA);

    const userBAnnotations = await annotateConcept._getUserAnnotations({
      userId: userB,
      content,
    });
    assertEquals(
      userBAnnotations.length,
      1,
      "UserB should have one annotation.",
    );
    assertEquals(userBAnnotations[0]._id, idB);
    assertEquals(userBAnnotations[0].keyIdeas, keyIdeasB);
    console.log("[VARIANT] User isolation verified correctly");
  } finally {
    await client.close();
  }
});

Deno.test("Query: _getAllUserAnnotations retrieves all annotations by user", async () => {
  const [db, client] = await testDb();
  const annotateConcept = new AnnotateConcept(db);

  try {
    console.log("[VARIANT] Testing retrieval of all user annotations");

    const content1 = "First content piece";
    const content2 = "Second content piece";
    const keyIdeas1 = "Key ideas for first content";
    const keyIdeas2 = "Key ideas for second content";

    // Save annotations for different content
    const result1 = await annotateConcept.saveAnnotation({
      userId: userA,
      bookId: bookA,
      content: content1,
      keyIdeas: keyIdeas1,
    });
    const { annotationId: id1 } = result1 as { annotationId: ID };

    const result2 = await annotateConcept.saveAnnotation({
      userId: userA,
      bookId: bookA,
      content: content2,
      keyIdeas: keyIdeas2,
    });
    const { annotationId: id2 } = result2 as { annotationId: ID };

    // Retrieve all annotations for userA
    const allAnnotations = await annotateConcept._getAllUserAnnotations({
      userId: userA,
    });
    assertEquals(
      allAnnotations.length,
      2,
      "UserA should have two annotations total.",
    );
    assertEquals(allAnnotations[0]._id, id2); // Newer first due to sort
    assertEquals(allAnnotations[1]._id, id1);
    console.log("[VARIANT] All user annotations retrieved correctly");
  } finally {
    await client.close();
  }
});

Deno.test("Action: getAnnotationsForBook retrieves annotations for specific user and book", async () => {
  const [db, client] = await testDb();
  const annotateConcept = new AnnotateConcept(db);

  try {
    console.log("[VARIANT] Testing getAnnotationsForBook action");

    const content1 = "First content in book A";
    const content2 = "Second content in book A";
    const content3 = "Content in book B";
    const keyIdeas1 = "Key ideas for first content in book A";
    const keyIdeas2 = "Key ideas for second content in book A";
    const keyIdeas3 = "Key ideas for content in book B";

    // Save annotations for bookA
    const result1 = await annotateConcept.saveAnnotation({
      userId: userA,
      bookId: bookA,
      content: content1,
      keyIdeas: keyIdeas1,
    });
    const { annotationId: id1 } = result1 as { annotationId: ID };

    const result2 = await annotateConcept.saveAnnotation({
      userId: userA,
      bookId: bookA,
      content: content2,
      keyIdeas: keyIdeas2,
    });
    const { annotationId: id2 } = result2 as { annotationId: ID };

    // Save annotation for bookB
    const result3 = await annotateConcept.saveAnnotation({
      userId: userA,
      bookId: bookB,
      content: content3,
      keyIdeas: keyIdeas3,
    });
    const { annotationId: id3 } = result3 as { annotationId: ID };

    // Get annotations for bookA
    const bookAAnnotations = await annotateConcept.getAnnotationsForBook({
      userId: userA,
      bookId: bookA,
    });
    assertEquals(
      bookAAnnotations.length,
      2,
      "UserA should have two annotations for bookA.",
    );
    assertEquals(bookAAnnotations[0]._id, id2); // Newer first due to sort
    assertEquals(bookAAnnotations[1]._id, id1);
    assertEquals(bookAAnnotations[0].bookId, bookA);
    assertEquals(bookAAnnotations[1].bookId, bookA);

    // Get annotations for bookB
    const bookBAnnotations = await annotateConcept.getAnnotationsForBook({
      userId: userA,
      bookId: bookB,
    });
    assertEquals(
      bookBAnnotations.length,
      1,
      "UserA should have one annotation for bookB.",
    );
    assertEquals(bookBAnnotations[0]._id, id3);
    assertEquals(bookBAnnotations[0].bookId, bookB);

    console.log(
      "[VARIANT] getAnnotationsForBook retrieved correct annotations",
    );
  } finally {
    await client.close();
  }
});

Deno.test("Action: getAnnotationsForBook isolates annotations by user and book", async () => {
  const [db, client] = await testDb();
  const annotateConcept = new AnnotateConcept(db);

  try {
    console.log(
      "[VARIANT] Testing user and book isolation in getAnnotationsForBook",
    );

    const content = "Shared content between users and books";
    const keyIdeasA1 = "Alice's key ideas for book A";
    const keyIdeasA2 = "Alice's key ideas for book B";
    const keyIdeasB1 = "Bob's key ideas for book A";

    // Save annotations for different user/book combinations
    const resultA1 = await annotateConcept.saveAnnotation({
      userId: userA,
      bookId: bookA,
      content,
      keyIdeas: keyIdeasA1,
    });
    const { annotationId: idA1 } = resultA1 as { annotationId: ID };

    const resultA2 = await annotateConcept.saveAnnotation({
      userId: userA,
      bookId: bookB,
      content,
      keyIdeas: keyIdeasA2,
    });
    const { annotationId: idA2 } = resultA2 as { annotationId: ID };

    const resultB1 = await annotateConcept.saveAnnotation({
      userId: userB,
      bookId: bookA,
      content,
      keyIdeas: keyIdeasB1,
    });
    const { annotationId: idB1 } = resultB1 as { annotationId: ID };

    // Verify isolation - userA should only see their annotations for bookA
    const userABookAAnnotations = await annotateConcept.getAnnotationsForBook({
      userId: userA,
      bookId: bookA,
    });
    assertEquals(
      userABookAAnnotations.length,
      1,
      "UserA should have one annotation for bookA.",
    );
    assertEquals(userABookAAnnotations[0]._id, idA1);
    assertEquals(userABookAAnnotations[0].userId, userA);
    assertEquals(userABookAAnnotations[0].bookId, bookA);

    // Verify isolation - userA should only see their annotations for bookB
    const userABookBAnnotations = await annotateConcept.getAnnotationsForBook({
      userId: userA,
      bookId: bookB,
    });
    assertEquals(
      userABookBAnnotations.length,
      1,
      "UserA should have one annotation for bookB.",
    );
    assertEquals(userABookBAnnotations[0]._id, idA2);
    assertEquals(userABookBAnnotations[0].userId, userA);
    assertEquals(userABookBAnnotations[0].bookId, bookB);

    // Verify isolation - userB should only see their annotations for bookA
    const userBBookAAnnotations = await annotateConcept.getAnnotationsForBook({
      userId: userB,
      bookId: bookA,
    });
    assertEquals(
      userBBookAAnnotations.length,
      1,
      "UserB should have one annotation for bookA.",
    );
    assertEquals(userBBookAAnnotations[0]._id, idB1);
    assertEquals(userBBookAAnnotations[0].userId, userB);
    assertEquals(userBBookAAnnotations[0].bookId, bookA);

    console.log("[VARIANT] User and book isolation verified correctly");
  } finally {
    await client.close();
  }
});
