import { assertEquals, assertExists, assertNotEquals } from "jsr:@std/assert";
import { testDb } from "@utils/database.ts";
import { ID } from "@utils/types.ts";
import FocusTimerConcept from "@concepts/focus_timer.ts";

Deno.test("Principle: Start timer, pause it, resume it, and verify state changes", async () => {
  const [db, client] = await testDb();
  const timerConcept = new FocusTimerConcept(db);

  try {
    console.log("[OP] Starting operational principle test");

    // 1. Start a timer
    const durationMs = 30000; // 30 seconds
    const phase = "reading";
    console.log(
      "[OP] Starting timer with duration:",
      durationMs,
      "phase:",
      phase,
    );

    const startResult = await timerConcept.start({ durationMs, phase });
    assertNotEquals(
      "error" in startResult,
      true,
      "Timer start should not fail.",
    );
    const { timerId } = startResult as { timerId: ID };
    assertExists(timerId);
    console.log("[OP] Started timer with ID:", timerId);

    // 2. Verify timer is active
    const timer = await timerConcept._getTimer({ timerId });
    assertExists(timer);
    assertEquals(timer.isActive, true, "Timer should be active after start");
    assertEquals(timer.phase, phase, "Timer should have correct phase");
    assertEquals(
      timer.durationMs,
      durationMs,
      "Timer should have correct duration",
    );
    console.log("[OP] Verified timer is active and configured correctly");

    // 3. Pause the timer
    const pauseResult = await timerConcept.pause({ timerId });
    assertNotEquals(
      "error" in pauseResult,
      true,
      "Timer pause should not fail.",
    );
    console.log("[OP] Paused timer");

    // 4. Verify timer is paused
    const pausedTimer = await timerConcept._getTimer({ timerId });
    assertExists(pausedTimer);
    assertEquals(
      pausedTimer.isActive,
      false,
      "Timer should be inactive after pause",
    );
    console.log("[OP] Verified timer is paused");

    // 5. Resume the timer
    const resumeResult = await timerConcept.resume({ timerId });
    assertNotEquals(
      "error" in resumeResult,
      true,
      "Timer resume should not fail.",
    );
    console.log("[OP] Resumed timer");

    // 6. Verify timer is active again
    const resumedTimer = await timerConcept._getTimer({ timerId });
    assertExists(resumedTimer);
    assertEquals(
      resumedTimer.isActive,
      true,
      "Timer should be active after resume",
    );
    console.log("[OP] Verified timer is active after resume");
  } finally {
    await client.close();
  }
});

Deno.test("Action: start requires valid duration and phase", async () => {
  const [db, client] = await testDb();
  const timerConcept = new FocusTimerConcept(db);

  try {
    console.log("[VARIANT] Testing invalid duration");

    const invalidDurationResult = await timerConcept.start({
      durationMs: 0,
      phase: "reading",
    });
    assertEquals(
      "error" in invalidDurationResult,
      true,
      "Starting timer with duration <= 0 should fail.",
    );
    console.log("[VARIANT] Invalid duration correctly rejected");

    const negativeDurationResult = await timerConcept.start({
      durationMs: -1000,
      phase: "reading",
    });
    assertEquals(
      "error" in negativeDurationResult,
      true,
      "Starting timer with negative duration should fail.",
    );
    console.log("[VARIANT] Negative duration correctly rejected");

    console.log("[VARIANT] Testing invalid phase");

    const invalidPhaseResult = await timerConcept.start({
      durationMs: 30000,
      phase: "invalid",
    });
    assertEquals(
      "error" in invalidPhaseResult,
      true,
      "Starting timer with invalid phase should fail.",
    );
    console.log("[VARIANT] Invalid phase correctly rejected");
  } finally {
    await client.close();
  }
});

Deno.test("Action: pause requires existing and active timer", async () => {
  const [db, client] = await testDb();
  const timerConcept = new FocusTimerConcept(db);

  try {
    console.log("[VARIANT] Testing pause of non-existent timer");

    const nonExistentTimerId = "timer:fake" as ID;
    const result = await timerConcept.pause({ timerId: nonExistentTimerId });
    assertEquals(
      "error" in result,
      true,
      "Pausing non-existent timer should fail.",
    );
    console.log("[VARIANT] Non-existent timer correctly rejected");

    console.log("[VARIANT] Testing pause of inactive timer");

    // Start a timer
    const { timerId } = (await timerConcept.start({
      durationMs: 30000,
      phase: "reading",
    })) as { timerId: ID };

    // Pause it first
    await timerConcept.pause({ timerId });

    // Try to pause again
    const pauseAgainResult = await timerConcept.pause({ timerId });
    assertEquals(
      "error" in pauseAgainResult,
      true,
      "Pausing inactive timer should fail.",
    );
    console.log("[VARIANT] Inactive timer correctly rejected");
  } finally {
    await client.close();
  }
});

Deno.test("Action: resume requires existing and inactive timer", async () => {
  const [db, client] = await testDb();
  const timerConcept = new FocusTimerConcept(db);

  try {
    console.log("[VARIANT] Testing resume of non-existent timer");

    const nonExistentTimerId = "timer:fake" as ID;
    const result = await timerConcept.resume({ timerId: nonExistentTimerId });
    assertEquals(
      "error" in result,
      true,
      "Resuming non-existent timer should fail.",
    );
    console.log("[VARIANT] Non-existent timer correctly rejected");

    console.log("[VARIANT] Testing resume of active timer");

    // Start a timer (it's active by default)
    const { timerId } = (await timerConcept.start({
      durationMs: 30000,
      phase: "reading",
    })) as { timerId: ID };

    // Try to resume an active timer
    const resumeActiveResult = await timerConcept.resume({ timerId });
    assertEquals(
      "error" in resumeActiveResult,
      true,
      "Resuming active timer should fail.",
    );
    console.log("[VARIANT] Active timer correctly rejected");
  } finally {
    await client.close();
  }
});

Deno.test("Action: expire flips phase and resets timer", async () => {
  const [db, client] = await testDb();
  const timerConcept = new FocusTimerConcept(db);

  try {
    console.log("[VARIANT] Testing timer expiration and phase flip");

    // Start with very short duration
    const { timerId } = (await timerConcept.start({
      durationMs: 100,
      phase: "reading",
    })) as { timerId: ID };

    // Wait for timer to expire
    await new Promise((resolve) => setTimeout(resolve, 150));

    // Expire the timer
    const expireResult = await timerConcept.expire({ timerId });
    assertNotEquals(
      "error" in expireResult,
      true,
      "Expiring timer should not fail.",
    );
    console.log("[VARIANT] Timer expired successfully");

    // Verify phase flipped and timer reset
    const expiredTimer = await timerConcept._getTimer({ timerId });
    assertExists(expiredTimer);
    assertEquals(
      expiredTimer.phase,
      "break",
      "Phase should flip from reading to break",
    );
    assertEquals(
      expiredTimer.isActive,
      true,
      "Timer should still be active after expiration",
    );
    console.log("[VARIANT] Phase flipped and timer reset correctly");
  } finally {
    await client.close();
  }
});

Deno.test("Action: expire requires timer to have reached duration", async () => {
  const [db, client] = await testDb();
  const timerConcept = new FocusTimerConcept(db);

  try {
    console.log("[VARIANT] Testing expire before duration reached");

    // Start with longer duration
    const { timerId } = (await timerConcept.start({
      durationMs: 5000, // 5 seconds
      phase: "reading",
    })) as { timerId: ID };

    // Try to expire immediately (should fail)
    const expireResult = await timerConcept.expire({ timerId });
    assertEquals(
      "error" in expireResult,
      true,
      "Expiring timer before duration should fail.",
    );
    console.log("[VARIANT] Early expiration correctly rejected");
  } finally {
    await client.close();
  }
});

Deno.test("Query: _getActiveTimers retrieves only active timers", async () => {
  const [db, client] = await testDb();
  const timerConcept = new FocusTimerConcept(db);

  try {
    console.log("[VARIANT] Testing active timers retrieval");

    // Start multiple timers
    const { timerId: timer1 } = (await timerConcept.start({
      durationMs: 30000,
      phase: "reading",
    })) as { timerId: ID };

    const { timerId: timer2 } = (await timerConcept.start({
      durationMs: 30000,
      phase: "break",
    })) as { timerId: ID };

    // Pause one timer
    await timerConcept.pause({ timerId: timer1 });

    // Get active timers
    const activeTimers = await timerConcept._getActiveTimers();
    assertEquals(
      activeTimers.length,
      1,
      "Should have one active timer.",
    );
    assertEquals(activeTimers[0]._id, timer2, "Active timer should be timer2");
    console.log("[VARIANT] Retrieved correct active timers");
  } finally {
    await client.close();
  }
});
