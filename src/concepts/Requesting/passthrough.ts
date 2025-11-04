/**
 * The Requesting concept exposes passthrough routes by default,
 * which allow POSTs to the route:
 *
 * /{REQUESTING_BASE_URL}/{Concept name}/{action or query}
 *
 * to passthrough directly to the concept action or query.
 * This is a convenient and natural way to expose concepts to
 * the world, but should only be done intentionally for public
 * actions and queries.
 *
 * This file allows you to explicitly set inclusions and exclusions
 * for passthrough routes:
 * - inclusions: those that you can justify their inclusion
 * - exclusions: those to exclude, using Requesting routes instead
 */

/**
 * INCLUSIONS
 *
 * Each inclusion must include a justification for why you think
 * the passthrough is appropriate (e.g. public query).
 *
 * inclusions = {"route": "justification"}
 */

export const inclusions: Record<string, string> = {
  // UserAuth - Public actions that anyone can call
  "/api/UserAuth/register": "public action - anyone can register",
  "/api/UserAuth/login": "public action - anyone can login",
  // Library - Currently all routes require auth/ownership checks, so none included
  // Annotate - All routes require user authentication, so none included
  // CheckpointQuiz - All routes require auth/ownership checks, so none included
  // FocusTimer - All routes require auth checks, so none included
  // ReadingProgress - All routes require auth checks, so none included
};

/**
 * EXCLUSIONS
 *
 * Excluded routes fall back to the Requesting concept, and will
 * instead trigger the normal Requesting.request action. As this
 * is the intended behavior, no justification is necessary.
 *
 * exclusions = ["route"]
 */

export const exclusions: Array<string> = [
  // UserAuth - Private queries that should go through syncs (for future auth checks)
  "/api/UserAuth/_getUser",
  "/api/UserAuth/_getUserByEmail",
  "/api/UserAuth/_getAllUsers",
  // Library - All routes excluded for auth/ownership verification via syncs
  "/api/Library/prepareUpload",
  "/api/Library/addBook",
  "/api/Library/getBook",
  "/api/Library/listBooks",
  "/api/Library/removeBook",
  "/api/Library/cleanupFailedUpload",
  "/api/Library/getViewUrl",
  "/api/Library/_getBook",
  "/api/Library/_getUserBooks",
  "/api/Library/_getAllBooks",
  // Annotate - All routes excluded for auth/ownership verification via syncs
  "/api/Annotate/saveAnnotation",
  "/api/Annotate/_getUserAnnotations",
  "/api/Annotate/_getAllUserAnnotations",
  "/api/Annotate/_getAnnotationsForBook",
  // CheckpointQuiz - All routes excluded for auth/ownership verification via syncs
  "/api/CheckpointQuiz/createQuiz",
  "/api/CheckpointQuiz/submitQuizAnswer",
  "/api/CheckpointQuiz/getQuizContext",
  "/api/CheckpointQuiz/createQuizFromPDF",
  "/api/CheckpointQuiz/_getQuiz",
  "/api/CheckpointQuiz/_getQuizAttempts",
  "/api/CheckpointQuiz/_getUserAttempts",
  // FocusTimer - All routes excluded for auth checks via syncs
  "/api/FocusTimer/start",
  "/api/FocusTimer/pause",
  "/api/FocusTimer/resume",
  "/api/FocusTimer/expire",
  "/api/FocusTimer/_getTimer",
  "/api/FocusTimer/_getActiveTimers",
  "/api/FocusTimer/_getTimersByPhase",
  // ReadingProgress - All routes excluded for auth checks via syncs
  "/api/ReadingProgress/initializeProgress",
  "/api/ReadingProgress/updateProgress",
  "/api/ReadingProgress/triggerQuiz",
  "/api/ReadingProgress/triggerAnnotation",
  "/api/ReadingProgress/recordQuizTriggered",
  "/api/ReadingProgress/recordAnnotationTriggered",
  "/api/ReadingProgress/pauseReading",
  "/api/ReadingProgress/resumeReading",
  "/api/ReadingProgress/_getReadingSession",
  "/api/ReadingProgress/_getUserSessions",
  "/api/ReadingProgress/_getBookSessions",
  "/api/ReadingProgress/_getActiveSessions",
];
