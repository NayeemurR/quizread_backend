import { assertEquals, assertExists, assertNotEquals } from "jsr:@std/assert";
import { testDb } from "@utils/database.ts";
import { ID } from "@utils/types.ts";
import ReadingProgressConcept from "@concepts/reading_progress.ts";

const userA = "user:Alice" as ID;
const userB = "user:Bob" as ID;
const bookA = "book:AliceBook" as ID;
const bookB = "book:BobBook" as ID;

Deno.test("Principle: Initialize reading session, update progress, trigger engagement, and manage session state", async () => {
  const [db, client] = await testDb();
  const progressConcept = new ReadingProgressConcept(db);

  try {
    console.log("[OP] Starting operational principle test");

    // 1. Initialize reading progress
    const totalPages = 100;
    const quizInterval = 10;
    const annotationInterval = 5;
    console.log("[OP] Initializing reading session with:", {
      totalPages,
      quizInterval,
      annotationInterval,
    });

    const initResult = await progressConcept.initializeProgress({
      userId: userA,
      bookId: bookA,
      totalPages,
      quizInterval,
      annotationInterval,
    });
    assertNotEquals(
      "error" in initResult,
      true,
      "Reading session initialization should not fail.",
    );
    const { sessionId } = initResult as { sessionId: ID };
    assertExists(sessionId);
    console.log("[OP] Initialized reading session with ID:", sessionId);

    // 2. Verify session state
    const session = await progressConcept._getReadingSession({ sessionId });
    assertExists(session);
    assertEquals(session.currentPage, 1, "Session should start at page 1");
    assertEquals(session.isActive, true, "Session should be active");
    assertEquals(
      session.quizInterval,
      quizInterval,
      "Quiz interval should be set",
    );
    assertEquals(
      session.annotationInterval,
      annotationInterval,
      "Annotation interval should be set",
    );
    console.log("[OP] Verified session state");

    // 3. Update progress
    const newPage = 15;
    console.log("[OP] Updating progress to page:", newPage);

    const updateResult = await progressConcept.updateProgress({
      sessionId,
      newPage,
    });
    assertNotEquals(
      "error" in updateResult,
      true,
      "Progress update should not fail.",
    );
    console.log("[OP] Updated progress successfully");

    // 4. Check quiz trigger
    const quizTriggerResult = await progressConcept.triggerQuiz({ sessionId });
    assertNotEquals(
      "error" in quizTriggerResult,
      true,
      "Quiz trigger check should not fail.",
    );
    const { shouldTrigger: quizShouldTrigger } = quizTriggerResult as {
      shouldTrigger: boolean;
    };
    assertEquals(
      quizShouldTrigger,
      true,
      "Quiz should trigger at page 15 (interval 10)",
    );
    console.log("[OP] Quiz trigger check passed");

    // 5. Record quiz triggered
    const recordQuizResult = await progressConcept.recordQuizTriggered({
      sessionId,
    });
    assertNotEquals(
      "error" in recordQuizResult,
      true,
      "Recording quiz trigger should not fail.",
    );
    console.log("[OP] Recorded quiz trigger");

    // 6. Check annotation trigger
    const annotationTriggerResult = await progressConcept.triggerAnnotation({
      sessionId,
    });
    assertNotEquals(
      "error" in annotationTriggerResult,
      true,
      "Annotation trigger check should not fail.",
    );
    const { shouldTrigger: annotationShouldTrigger } =
      annotationTriggerResult as { shouldTrigger: boolean };
    assertEquals(
      annotationShouldTrigger,
      true,
      "Annotation should trigger at page 15 (interval 5)",
    );
    console.log("[OP] Annotation trigger check passed");

    // 7. Record annotation triggered
    const recordAnnotationResult = await progressConcept
      .recordAnnotationTriggered({ sessionId });
    assertNotEquals(
      "error" in recordAnnotationResult,
      true,
      "Recording annotation trigger should not fail.",
    );
    console.log("[OP] Recorded annotation trigger");
  } finally {
    await client.close();
  }
});

Deno.test("Action: initializeProgress requires valid parameters", async () => {
  const [db, client] = await testDb();
  const progressConcept = new ReadingProgressConcept(db);

  try {
    console.log("[VARIANT] Testing invalid totalPages");

    const invalidTotalPagesResult = await progressConcept.initializeProgress({
      userId: userA,
      bookId: bookA,
      totalPages: 0,
      quizInterval: 10,
      annotationInterval: 5,
    });
    assertEquals(
      "error" in invalidTotalPagesResult,
      true,
      "Initializing with totalPages <= 0 should fail.",
    );
    console.log("[VARIANT] Invalid totalPages correctly rejected");

    console.log("[VARIANT] Testing invalid quizInterval");

    const invalidQuizIntervalResult = await progressConcept.initializeProgress({
      userId: userA,
      bookId: bookA,
      totalPages: 100,
      quizInterval: 0,
      annotationInterval: 5,
    });
    assertEquals(
      "error" in invalidQuizIntervalResult,
      true,
      "Initializing with quizInterval <= 0 should fail.",
    );
    console.log("[VARIANT] Invalid quizInterval correctly rejected");

    console.log("[VARIANT] Testing invalid annotationInterval");

    const invalidAnnotationIntervalResult = await progressConcept
      .initializeProgress({
        userId: userA,
        bookId: bookA,
        totalPages: 100,
        quizInterval: 10,
        annotationInterval: 0,
      });
    assertEquals(
      "error" in invalidAnnotationIntervalResult,
      true,
      "Initializing with annotationInterval <= 0 should fail.",
    );
    console.log("[VARIANT] Invalid annotationInterval correctly rejected");
  } finally {
    await client.close();
  }
});

Deno.test("Action: updateProgress requires valid page progression", async () => {
  const [db, client] = await testDb();
  const progressConcept = new ReadingProgressConcept(db);

  try {
    console.log("[VARIANT] Testing invalid page progression");

    // Initialize a session
    const { sessionId } = (await progressConcept.initializeProgress({
      userId: userA,
      bookId: bookA,
      totalPages: 100,
      quizInterval: 10,
      annotationInterval: 5,
    })) as { sessionId: ID };

    // Update to page 15
    await progressConcept.updateProgress({ sessionId, newPage: 15 });

    // Try to update to lower page
    const lowerPageResult = await progressConcept.updateProgress({
      sessionId,
      newPage: 10,
    });
    assertEquals(
      "error" in lowerPageResult,
      true,
      "Updating to lower page should fail.",
    );
    console.log("[VARIANT] Lower page update correctly rejected");

    // Try to update beyond total pages
    const beyondTotalResult = await progressConcept.updateProgress({
      sessionId,
      newPage: 150,
    });
    assertEquals(
      "error" in beyondTotalResult,
      true,
      "Updating beyond total pages should fail.",
    );
    console.log("[VARIANT] Beyond total pages update correctly rejected");
  } finally {
    await client.close();
  }
});

Deno.test("Action: triggerQuiz and triggerAnnotation work correctly with intervals", async () => {
  const [db, client] = await testDb();
  const progressConcept = new ReadingProgressConcept(db);

  try {
    console.log("[VARIANT] Testing trigger logic with intervals");

    // Initialize with specific intervals
    const { sessionId } = (await progressConcept.initializeProgress({
      userId: userA,
      bookId: bookA,
      totalPages: 100,
      quizInterval: 10,
      annotationInterval: 5,
    })) as { sessionId: ID };

    // At page 1, neither should trigger
    const quizTrigger1 = await progressConcept.triggerQuiz({ sessionId });
    const annotationTrigger1 = await progressConcept.triggerAnnotation({
      sessionId,
    });
    assertEquals(
      (quizTrigger1 as { shouldTrigger: boolean }).shouldTrigger,
      false,
      "Quiz should not trigger at page 1",
    );
    assertEquals(
      (annotationTrigger1 as { shouldTrigger: boolean }).shouldTrigger,
      false,
      "Annotation should not trigger at page 1",
    );

    // Update to page 5, annotation should trigger
    await progressConcept.updateProgress({ sessionId, newPage: 5 });
    const annotationTrigger5 = await progressConcept.triggerAnnotation({
      sessionId,
    });
    assertEquals(
      (annotationTrigger5 as { shouldTrigger: boolean }).shouldTrigger,
      true,
      "Annotation should trigger at page 5",
    );

    // Update to page 10, quiz should trigger
    await progressConcept.updateProgress({ sessionId, newPage: 10 });
    const quizTrigger10 = await progressConcept.triggerQuiz({ sessionId });
    assertEquals(
      (quizTrigger10 as { shouldTrigger: boolean }).shouldTrigger,
      true,
      "Quiz should trigger at page 10",
    );

    console.log("[VARIANT] Trigger logic working correctly");
  } finally {
    await client.close();
  }
});

Deno.test("Action: pauseReading and resumeReading manage session state correctly", async () => {
  const [db, client] = await testDb();
  const progressConcept = new ReadingProgressConcept(db);

  try {
    console.log("[VARIANT] Testing pause and resume functionality");

    // Initialize a session
    const { sessionId } = (await progressConcept.initializeProgress({
      userId: userA,
      bookId: bookA,
      totalPages: 100,
      quizInterval: 10,
      annotationInterval: 5,
    })) as { sessionId: ID };

    // Verify session is active
    const activeSession = await progressConcept._getReadingSession({
      sessionId,
    });
    assertExists(activeSession);
    assertEquals(
      activeSession.isActive,
      true,
      "Session should be active initially",
    );

    // Pause reading
    const pauseResult = await progressConcept.pauseReading({ sessionId });
    assertNotEquals(
      "error" in pauseResult,
      true,
      "Pausing reading should not fail.",
    );
    console.log("[VARIANT] Paused reading successfully");

    // Verify session is paused
    const pausedSession = await progressConcept._getReadingSession({
      sessionId,
    });
    assertExists(pausedSession);
    assertEquals(
      pausedSession.isActive,
      false,
      "Session should be inactive after pause",
    );

    // Resume reading
    const resumeResult = await progressConcept.resumeReading({ sessionId });
    assertNotEquals(
      "error" in resumeResult,
      true,
      "Resuming reading should not fail.",
    );
    console.log("[VARIANT] Resumed reading successfully");

    // Verify session is active again
    const resumedSession = await progressConcept._getReadingSession({
      sessionId,
    });
    assertExists(resumedSession);
    assertEquals(
      resumedSession.isActive,
      true,
      "Session should be active after resume",
    );
  } finally {
    await client.close();
  }
});

Deno.test("Action: pauseReading requires active session, resumeReading requires inactive session", async () => {
  const [db, client] = await testDb();
  const progressConcept = new ReadingProgressConcept(db);

  try {
    console.log("[VARIANT] Testing pause/resume state requirements");

    // Initialize a session
    const { sessionId } = (await progressConcept.initializeProgress({
      userId: userA,
      bookId: bookA,
      totalPages: 100,
      quizInterval: 10,
      annotationInterval: 5,
    })) as { sessionId: ID };

    // Try to resume an active session (should fail)
    const resumeActiveResult = await progressConcept.resumeReading({
      sessionId,
    });
    assertEquals(
      "error" in resumeActiveResult,
      true,
      "Resuming active session should fail.",
    );
    console.log("[VARIANT] Resume active session correctly rejected");

    // Pause the session
    await progressConcept.pauseReading({ sessionId });

    // Try to pause an inactive session (should fail)
    const pauseInactiveResult = await progressConcept.pauseReading({
      sessionId,
    });
    assertEquals(
      "error" in pauseInactiveResult,
      true,
      "Pausing inactive session should fail.",
    );
    console.log("[VARIANT] Pause inactive session correctly rejected");
  } finally {
    await client.close();
  }
});

Deno.test("Query: _getUserSessions retrieves all sessions for a user", async () => {
  const [db, client] = await testDb();
  const progressConcept = new ReadingProgressConcept(db);

  try {
    console.log("[VARIANT] Testing user sessions retrieval");

    // Create sessions for different users and books
    const { sessionId: session1 } = (await progressConcept.initializeProgress({
      userId: userA,
      bookId: bookA,
      totalPages: 100,
      quizInterval: 10,
      annotationInterval: 5,
    })) as { sessionId: ID };

    const { sessionId: session2 } = (await progressConcept.initializeProgress({
      userId: userA,
      bookId: bookB,
      totalPages: 200,
      quizInterval: 15,
      annotationInterval: 8,
    })) as { sessionId: ID };

    const { sessionId: session3 } = (await progressConcept.initializeProgress({
      userId: userB,
      bookId: bookA,
      totalPages: 100,
      quizInterval: 10,
      annotationInterval: 5,
    })) as { sessionId: ID };

    // Get sessions for userA
    const userASessions = await progressConcept._getUserSessions({
      userId: userA,
    });
    assertEquals(
      userASessions.length,
      2,
      "UserA should have two sessions.",
    );
    assertEquals(userASessions[0]._id, session1);
    assertEquals(userASessions[1]._id, session2);

    // Get sessions for userB
    const userBSessions = await progressConcept._getUserSessions({
      userId: userB,
    });
    assertEquals(
      userBSessions.length,
      1,
      "UserB should have one session.",
    );
    assertEquals(userBSessions[0]._id, session3);

    console.log("[VARIANT] User sessions retrieved correctly");
  } finally {
    await client.close();
  }
});
