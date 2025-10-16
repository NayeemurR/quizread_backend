import { assertEquals, assertExists, assertNotEquals } from "jsr:@std/assert";
import { testDb } from "@utils/database.ts";
import { ID } from "@utils/types.ts";
import CheckpointQuizConcept from "@concepts/checkpoint_quiz.ts";
import { Db } from "mongodb";

const userA = "user:Alice" as ID;
const userB = "user:Bob" as ID;

// Mock the GeminiLLM for testing
class MockGeminiLLM {
  executeLLM(prompt: string): string {
    // Return a deterministic response based on content length
    const contentMatch = prompt.match(/Content: (.+)/);
    const content = contentMatch ? contentMatch[1] : "";
    const contentLength = content.length;

    return JSON.stringify({
      question:
        `What is the main topic of this ${contentLength}-character text?`,
      answers: ["Technology", "Science", "Literature", "History"],
      correctIndex: contentLength % 4,
    });
  }
}

// Create a test version of the concept that uses the mock
class TestCheckpointQuizConcept extends CheckpointQuizConcept {
  constructor(db: Db) {
    super(db);
    // Override the LLM with our mock
    (this as unknown as { llm: MockGeminiLLM }).llm = new MockGeminiLLM();
  }
}

Deno.test("Principle: Generate quiz from content, user submits answer, system records attempt", async () => {
  const [db, client] = await testDb();
  const quizConcept = new TestCheckpointQuizConcept(db);

  try {
    console.log("[OP] Starting operational principle test");

    // 1. Generate a quiz from content
    const contentText =
      "This is a sample text about technology and innovation.";
    console.log("[OP] Creating quiz from content:", contentText);

    const createQuizResult = await quizConcept.createQuiz({
      content: contentText,
    });
    assertNotEquals(
      "error" in createQuizResult,
      true,
      "Quiz creation should not fail.",
    );
    const { quizId } = createQuizResult as { quizId: ID };
    assertExists(quizId);
    console.log("[OP] Created quiz with ID:", quizId);

    // 2. User submits an answer
    const selectedIndex = 0;
    console.log("[OP] Submitting answer with index:", selectedIndex);

    const submitResult = await quizConcept.submitQuizAnswer({
      userId: userA,
      quizId,
      selectedIndex,
    });
    assertNotEquals(
      "error" in submitResult,
      true,
      "Answer submission should not fail.",
    );
    const { attemptId, isCorrect } = submitResult as {
      attemptId: ID;
      isCorrect: boolean;
    };
    assertExists(attemptId);
    console.log(
      "[OP] Submitted answer, attempt ID:",
      attemptId,
      "isCorrect:",
      isCorrect,
    );

    // 3. Verify the attempt was recorded
    const userAttempts = await quizConcept._getUserAttempts({ userId: userA });
    assertEquals(
      userAttempts.length,
      1,
      "User should have one attempt recorded.",
    );
    assertEquals(userAttempts[0].quizId, quizId);
    assertEquals(userAttempts[0].selectedIndex, selectedIndex);
    assertEquals(userAttempts[0].isCorrect, isCorrect);
    console.log("[OP] Verified attempt was recorded correctly");
  } finally {
    await client.close();
  }
});

Deno.test("Action: createQuiz requires non-empty content", async () => {
  const [db, client] = await testDb();
  const quizConcept = new TestCheckpointQuizConcept(db);

  try {
    console.log("[VARIANT] Testing empty content");

    const emptyResult = await quizConcept.createQuiz({ content: "" });
    assertEquals(
      "error" in emptyResult,
      true,
      "Creating quiz with empty content should fail.",
    );
    console.log("[VARIANT] Empty content correctly rejected");

    const whitespaceResult = await quizConcept.createQuiz({ content: "   " });
    assertEquals(
      "error" in whitespaceResult,
      true,
      "Creating quiz with whitespace-only content should fail.",
    );
    console.log("[VARIANT] Whitespace-only content correctly rejected");
  } finally {
    await client.close();
  }
});

Deno.test("Action: submitQuizAnswer requires existing quiz", async () => {
  const [db, client] = await testDb();
  const quizConcept = new TestCheckpointQuizConcept(db);

  try {
    console.log("[VARIANT] Testing submission to non-existent quiz");

    const nonExistentQuizId = "quiz:fake" as ID;
    const result = await quizConcept.submitQuizAnswer({
      userId: userA,
      quizId: nonExistentQuizId,
      selectedIndex: 0,
    });
    assertEquals(
      "error" in result,
      true,
      "Submitting answer to non-existent quiz should fail.",
    );
    console.log("[VARIANT] Non-existent quiz correctly rejected");
  } finally {
    await client.close();
  }
});

Deno.test("Action: submitQuizAnswer requires valid selectedIndex", async () => {
  const [db, client] = await testDb();
  const quizConcept = new TestCheckpointQuizConcept(db);

  try {
    console.log("[VARIANT] Testing invalid selectedIndex");

    // First create a valid quiz
    const { quizId } = (await quizConcept.createQuiz({
      content: "Sample content for testing",
    })) as { quizId: ID };

    // Test negative index
    const negativeResult = await quizConcept.submitQuizAnswer({
      userId: userA,
      quizId,
      selectedIndex: -1,
    });
    assertEquals(
      "error" in negativeResult,
      true,
      "Submitting with negative index should fail.",
    );
    console.log("[VARIANT] Negative index correctly rejected");

    // Test index >= 4
    const highResult = await quizConcept.submitQuizAnswer({
      userId: userA,
      quizId,
      selectedIndex: 4,
    });
    assertEquals(
      "error" in highResult,
      true,
      "Submitting with index >= 4 should fail.",
    );
    console.log("[VARIANT] High index correctly rejected");
  } finally {
    await client.close();
  }
});

Deno.test("Action: submitQuizAnswer correctly determines correctness", async () => {
  const [db, client] = await testDb();
  const quizConcept = new TestCheckpointQuizConcept(db);

  try {
    console.log("[VARIANT] Testing correctness determination");

    // Create quiz with content that will have correctIndex = 2 (content length 25 % 4 = 1, but our mock uses % 4)
    const contentText = "This content has exactly 25 chars";
    const { quizId } =
      (await quizConcept.createQuiz({ content: contentText })) as {
        quizId: ID;
      };

    // Get the quiz to see what the correct answer should be
    const quiz = await quizConcept._getQuiz({ quizId });
    assertExists(quiz);
    console.log("[VARIANT] Quiz correct index:", quiz.correctIndex);

    // Submit correct answer
    const correctResult = await quizConcept.submitQuizAnswer({
      userId: userA,
      quizId,
      selectedIndex: quiz.correctIndex,
    });
    assertNotEquals(
      "error" in correctResult,
      true,
      "Submitting correct answer should succeed.",
    );
    const { isCorrect: correctIsCorrect } = correctResult as {
      isCorrect: boolean;
    };
    assertEquals(
      correctIsCorrect,
      true,
      "Correct answer should be marked as correct.",
    );
    console.log("[VARIANT] Correct answer marked as correct");

    // Submit wrong answer
    const wrongIndex = (quiz.correctIndex + 1) % 4;
    const wrongResult = await quizConcept.submitQuizAnswer({
      userId: userB,
      quizId,
      selectedIndex: wrongIndex,
    });
    assertNotEquals(
      "error" in wrongResult,
      true,
      "Submitting wrong answer should succeed.",
    );
    const { isCorrect: wrongIsCorrect } = wrongResult as { isCorrect: boolean };
    assertEquals(
      wrongIsCorrect,
      false,
      "Wrong answer should be marked as incorrect.",
    );
    console.log("[VARIANT] Wrong answer marked as incorrect");
  } finally {
    await client.close();
  }
});

Deno.test("Query: _getQuizAttempts retrieves all attempts for a quiz", async () => {
  const [db, client] = await testDb();
  const quizConcept = new TestCheckpointQuizConcept(db);

  try {
    console.log("[VARIANT] Testing quiz attempts retrieval");

    // Create a quiz
    const { quizId } = (await quizConcept.createQuiz({
      content: "Test content for multiple attempts",
    })) as { quizId: ID };

    // Submit multiple attempts from different users
    await quizConcept.submitQuizAnswer({
      userId: userA,
      quizId,
      selectedIndex: 0,
    });
    await quizConcept.submitQuizAnswer({
      userId: userB,
      quizId,
      selectedIndex: 1,
    });

    // Retrieve all attempts for this quiz
    const quizAttempts = await quizConcept._getQuizAttempts({ quizId });
    assertEquals(
      quizAttempts.length,
      2,
      "Should have two attempts for the quiz.",
    );
    assertEquals(quizAttempts[0].quizId, quizId);
    assertEquals(quizAttempts[1].quizId, quizId);
    console.log("[VARIANT] Retrieved correct number of attempts for quiz");
  } finally {
    await client.close();
  }
});
