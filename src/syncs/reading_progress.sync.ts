/**
 * ReadingProgress synchronizations
 * Handles excluded ReadingProgress routes through the Requesting concept
 */

import { ReadingProgress, Requesting } from "@concepts";
import { actions, Frames, Sync } from "@engine";
import type { ID } from "@utils/types.ts";

/**
 * Sync: Handle initializeProgress request
 */
export const InitializeProgressRequest: Sync = ({
  request,
  userId,
  bookId,
  totalPages,
  quizInterval,
  annotationInterval,
}) => ({
  when: actions([
    Requesting.request,
    {
      path: "/ReadingProgress/initializeProgress",
      userId,
      bookId,
      totalPages,
      quizInterval,
      annotationInterval,
    },
    { request },
  ]),
  then: actions([
    ReadingProgress.initializeProgress,
    {
      userId,
      bookId,
      totalPages,
      quizInterval,
      annotationInterval,
    },
  ]),
});

export const InitializeProgressResponse: Sync = ({ request, sessionId }) => ({
  when: actions(
    [Requesting.request, { path: "/ReadingProgress/initializeProgress" }, {
      request,
    }],
    [ReadingProgress.initializeProgress, {}, { sessionId }],
  ),
  then: actions([Requesting.respond, { request, sessionId }]),
});

export const InitializeProgressResponseError: Sync = ({ request, error }) => ({
  when: actions(
    [Requesting.request, { path: "/ReadingProgress/initializeProgress" }, {
      request,
    }],
    [ReadingProgress.initializeProgress, {}, { error }],
  ),
  then: actions([Requesting.respond, { request, error }]),
});

/**
 * Sync: Handle updateProgress request
 */
export const UpdateProgressRequest: Sync = ({
  request,
  sessionId,
  newPage,
}) => ({
  when: actions([
    Requesting.request,
    { path: "/ReadingProgress/updateProgress", sessionId, newPage },
    { request },
  ]),
  then: actions([ReadingProgress.updateProgress, { sessionId, newPage }]),
});

export const UpdateProgressResponse: Sync = ({ request }) => ({
  when: actions(
    [Requesting.request, { path: "/ReadingProgress/updateProgress" }, {
      request,
    }],
    [ReadingProgress.updateProgress, {}, {}],
  ),
  // Empty response - RequestingConcept will return {} when response is empty
  then: actions([Requesting.respond, { request }]),
});

export const UpdateProgressResponseError: Sync = ({ request, error }) => ({
  when: actions(
    [Requesting.request, { path: "/ReadingProgress/updateProgress" }, {
      request,
    }],
    [ReadingProgress.updateProgress, {}, { error }],
  ),
  then: actions([Requesting.respond, { request, error }]),
});

/**
 * Sync: Handle triggerQuiz request
 */
export const TriggerQuizRequest: Sync = ({ request, sessionId }) => ({
  when: actions([
    Requesting.request,
    { path: "/ReadingProgress/triggerQuiz", sessionId },
    { request },
  ]),
  then: actions([ReadingProgress.triggerQuiz, { sessionId }]),
});

export const TriggerQuizResponse: Sync = ({ request, shouldTrigger }) => ({
  when: actions(
    [Requesting.request, { path: "/ReadingProgress/triggerQuiz" }, { request }],
    [ReadingProgress.triggerQuiz, {}, { shouldTrigger }],
  ),
  then: actions([Requesting.respond, { request, shouldTrigger }]),
});

export const TriggerQuizResponseError: Sync = ({ request, error }) => ({
  when: actions(
    [Requesting.request, { path: "/ReadingProgress/triggerQuiz" }, { request }],
    [ReadingProgress.triggerQuiz, {}, { error }],
  ),
  then: actions([Requesting.respond, { request, error }]),
});

/**
 * Sync: Handle triggerAnnotation request
 */
export const TriggerAnnotationRequest: Sync = ({ request, sessionId }) => ({
  when: actions([
    Requesting.request,
    { path: "/ReadingProgress/triggerAnnotation", sessionId },
    { request },
  ]),
  then: actions([ReadingProgress.triggerAnnotation, { sessionId }]),
});

export const TriggerAnnotationResponse: Sync = (
  { request, shouldTrigger },
) => ({
  when: actions(
    [Requesting.request, { path: "/ReadingProgress/triggerAnnotation" }, {
      request,
    }],
    [ReadingProgress.triggerAnnotation, {}, { shouldTrigger }],
  ),
  then: actions([Requesting.respond, { request, shouldTrigger }]),
});

export const TriggerAnnotationResponseError: Sync = ({ request, error }) => ({
  when: actions(
    [Requesting.request, { path: "/ReadingProgress/triggerAnnotation" }, {
      request,
    }],
    [ReadingProgress.triggerAnnotation, {}, { error }],
  ),
  then: actions([Requesting.respond, { request, error }]),
});

/**
 * Sync: Handle recordQuizTriggered request
 */
export const RecordQuizTriggeredRequest: Sync = ({ request, sessionId }) => ({
  when: actions([
    Requesting.request,
    { path: "/ReadingProgress/recordQuizTriggered", sessionId },
    { request },
  ]),
  then: actions([ReadingProgress.recordQuizTriggered, { sessionId }]),
});

export const RecordQuizTriggeredResponse: Sync = ({ request }) => ({
  when: actions(
    [Requesting.request, { path: "/ReadingProgress/recordQuizTriggered" }, {
      request,
    }],
    [ReadingProgress.recordQuizTriggered, {}, {}],
  ),
  // Empty response - RequestingConcept will return {} when response is empty
  then: actions([Requesting.respond, { request }]),
});

export const RecordQuizTriggeredResponseError: Sync = ({ request, error }) => ({
  when: actions(
    [Requesting.request, { path: "/ReadingProgress/recordQuizTriggered" }, {
      request,
    }],
    [ReadingProgress.recordQuizTriggered, {}, { error }],
  ),
  then: actions([Requesting.respond, { request, error }]),
});

/**
 * Sync: Handle recordAnnotationTriggered request
 */
export const RecordAnnotationTriggeredRequest: Sync = ({
  request,
  sessionId,
}) => ({
  when: actions([
    Requesting.request,
    { path: "/ReadingProgress/recordAnnotationTriggered", sessionId },
    { request },
  ]),
  then: actions([
    ReadingProgress.recordAnnotationTriggered,
    { sessionId },
  ]),
});

export const RecordAnnotationTriggeredResponse: Sync = ({ request }) => ({
  when: actions(
    [
      Requesting.request,
      { path: "/ReadingProgress/recordAnnotationTriggered" },
      { request },
    ],
    [ReadingProgress.recordAnnotationTriggered, {}, {}],
  ),
  // Empty response - RequestingConcept will return {} when response is empty
  then: actions([Requesting.respond, { request }]),
});

export const RecordAnnotationTriggeredResponseError: Sync = ({
  request,
  error,
}) => ({
  when: actions(
    [
      Requesting.request,
      { path: "/ReadingProgress/recordAnnotationTriggered" },
      { request },
    ],
    [ReadingProgress.recordAnnotationTriggered, {}, { error }],
  ),
  then: actions([Requesting.respond, { request, error }]),
});

/**
 * Sync: Handle pauseReading request
 */
export const PauseReadingRequest: Sync = ({ request, sessionId }) => ({
  when: actions([
    Requesting.request,
    { path: "/ReadingProgress/pauseReading", sessionId },
    { request },
  ]),
  then: actions([ReadingProgress.pauseReading, { sessionId }]),
});

export const PauseReadingResponse: Sync = ({ request }) => ({
  when: actions(
    [Requesting.request, { path: "/ReadingProgress/pauseReading" }, {
      request,
    }],
    [ReadingProgress.pauseReading, {}, {}],
  ),
  // Empty response - RequestingConcept will return {} when response is empty
  then: actions([Requesting.respond, { request }]),
});

export const PauseReadingResponseError: Sync = ({ request, error }) => ({
  when: actions(
    [Requesting.request, { path: "/ReadingProgress/pauseReading" }, {
      request,
    }],
    [ReadingProgress.pauseReading, {}, { error }],
  ),
  then: actions([Requesting.respond, { request, error }]),
});

/**
 * Sync: Handle resumeReading request
 */
export const ResumeReadingRequest: Sync = ({ request, sessionId }) => ({
  when: actions([
    Requesting.request,
    { path: "/ReadingProgress/resumeReading", sessionId },
    { request },
  ]),
  then: actions([ReadingProgress.resumeReading, { sessionId }]),
});

export const ResumeReadingResponse: Sync = ({ request }) => ({
  when: actions(
    [Requesting.request, { path: "/ReadingProgress/resumeReading" }, {
      request,
    }],
    [ReadingProgress.resumeReading, {}, {}],
  ),
  // Empty response - RequestingConcept will return {} when response is empty
  then: actions([Requesting.respond, { request }]),
});

export const ResumeReadingResponseError: Sync = ({ request, error }) => ({
  when: actions(
    [Requesting.request, { path: "/ReadingProgress/resumeReading" }, {
      request,
    }],
    [ReadingProgress.resumeReading, {}, { error }],
  ),
  then: actions([Requesting.respond, { request, error }]),
});

/**
 * Sync: Handle _getReadingSession query (returns ReadingSessionDoc | null)
 * Note: Returns single object or null to match passthrough behavior
 */
export const GetReadingSessionRequest: Sync = ({
  request,
  sessionId,
  session,
}) => ({
  when: actions([
    Requesting.request,
    { path: "/ReadingProgress/_getReadingSession", sessionId },
    { request },
  ]),
  where: async (frames) => {
    // Query returns single object or null, so we wrap it manually
    const newFrames = new Frames();
    for (const frame of frames) {
      const sessionIdValue = frame[sessionId] as ID;
      const result = await ReadingProgress._getReadingSession({
        sessionId: sessionIdValue,
      });
      // Push result (ReadingSessionDoc or null) directly into frame
      newFrames.push({ ...frame, [session]: result });
    }
    return newFrames;
  },
  // RequestingConcept will auto-detect single-value responses and return
  // the value directly (session or null) to match passthrough behavior
  then: actions([Requesting.respond, { request, session }]),
});

/**
 * Sync: Handle _getUserSessions query (returns ReadingSessionDoc[])
 * Note: Returns array directly to match passthrough behavior
 */
export const GetUserSessionsRequest: Sync = ({
  request,
  userId,
  sessions,
}) => ({
  when: actions([
    Requesting.request,
    { path: "/ReadingProgress/_getUserSessions", userId },
    { request },
  ]),
  where: async (frames) => {
    const newFrames = new Frames();
    for (const frame of frames) {
      const userIdValue = frame[userId] as ID;
      const allSessions = await ReadingProgress._getUserSessions({
        userId: userIdValue,
      });
      // Store sessions array for response - RequestingConcept will return it directly
      newFrames.push({ ...frame, [sessions]: allSessions });
    }
    return newFrames;
  },
  // RequestingConcept will auto-detect single array responses and return
  // the array directly to match passthrough behavior
  then: actions([Requesting.respond, { request, sessions }]),
});

/**
 * Sync: Handle _getBookSessions query (returns ReadingSessionDoc[])
 * Note: Returns array directly to match passthrough behavior
 */
export const GetBookSessionsRequest: Sync = ({
  request,
  bookId,
  sessions,
}) => ({
  when: actions([
    Requesting.request,
    { path: "/ReadingProgress/_getBookSessions", bookId },
    { request },
  ]),
  where: async (frames) => {
    const newFrames = new Frames();
    for (const frame of frames) {
      const bookIdValue = frame[bookId] as ID;
      const allSessions = await ReadingProgress._getBookSessions({
        bookId: bookIdValue,
      });
      // Store sessions array for response - RequestingConcept will return it directly
      newFrames.push({ ...frame, [sessions]: allSessions });
    }
    return newFrames;
  },
  // RequestingConcept will auto-detect single array responses and return
  // the array directly to match passthrough behavior
  then: actions([Requesting.respond, { request, sessions }]),
});

/**
 * Sync: Handle _getActiveSessions query (returns ReadingSessionDoc[])
 * Note: Returns array directly to match passthrough behavior
 */
export const GetActiveSessionsRequest: Sync = ({
  request,
  sessions,
}) => ({
  when: actions([
    Requesting.request,
    { path: "/ReadingProgress/_getActiveSessions" },
    { request },
  ]),
  where: async (frames) => {
    const newFrames = new Frames();
    for (const frame of frames) {
      const allSessions = await ReadingProgress._getActiveSessions();
      // Store sessions array for response - RequestingConcept will return it directly
      newFrames.push({ ...frame, [sessions]: allSessions });
    }
    return newFrames;
  },
  // RequestingConcept will auto-detect single array responses and return
  // the array directly to match passthrough behavior
  then: actions([Requesting.respond, { request, sessions }]),
});
