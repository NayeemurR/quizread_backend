/**
 * CheckpointQuiz synchronizations
 * Handles excluded CheckpointQuiz routes through the Requesting concept
 */

import { CheckpointQuiz, Requesting } from "@concepts";
import { actions, Frames, Sync } from "@engine";
import type { ID } from "@utils/types.ts";

/**
 * Sync: Handle createQuiz request
 */
export const CreateQuizRequest: Sync = ({
  request,
  content,
}) => ({
  when: actions([
    Requesting.request,
    { path: "/CheckpointQuiz/createQuiz", content },
    { request },
  ]),
  then: actions([CheckpointQuiz.createQuiz, { content }]),
});

export const CreateQuizResponse: Sync = ({ request, quiz }) => ({
  when: actions(
    [Requesting.request, { path: "/CheckpointQuiz/createQuiz" }, { request }],
    [CheckpointQuiz.createQuiz, {}, { quiz }],
  ),
  then: actions([Requesting.respond, { request, quiz }]),
});

export const CreateQuizResponseError: Sync = ({ request, error }) => ({
  when: actions(
    [Requesting.request, { path: "/CheckpointQuiz/createQuiz" }, { request }],
    [CheckpointQuiz.createQuiz, {}, { error }],
  ),
  then: actions([Requesting.respond, { request, error }]),
});

/**
 * Sync: Handle submitQuizAnswer request
 */
export const SubmitQuizAnswerRequest: Sync = ({
  request,
  userId,
  quizId,
  selectedIndex,
}) => ({
  when: actions([
    Requesting.request,
    { path: "/CheckpointQuiz/submitQuizAnswer", userId, quizId, selectedIndex },
    { request },
  ]),
  then: actions([
    CheckpointQuiz.submitQuizAnswer,
    { userId, quizId, selectedIndex },
  ]),
});

export const SubmitQuizAnswerResponse: Sync = ({
  request,
  attemptId,
  isCorrect,
}) => ({
  when: actions(
    [Requesting.request, { path: "/CheckpointQuiz/submitQuizAnswer" }, {
      request,
    }],
    [CheckpointQuiz.submitQuizAnswer, {}, { attemptId, isCorrect }],
  ),
  then: actions([
    Requesting.respond,
    { request, attemptId, isCorrect },
  ]),
});

export const SubmitQuizAnswerResponseError: Sync = ({ request, error }) => ({
  when: actions(
    [Requesting.request, { path: "/CheckpointQuiz/submitQuizAnswer" }, {
      request,
    }],
    [CheckpointQuiz.submitQuizAnswer, {}, { error }],
  ),
  then: actions([Requesting.respond, { request, error }]),
});

/**
 * Sync: Handle getQuizContext request
 */
export const GetQuizContextRequest: Sync = ({
  request,
  userId,
  bookId,
  currentPage,
  pageRange,
}) => ({
  when: actions([
    Requesting.request,
    { path: "/CheckpointQuiz/getQuizContext", userId, bookId, currentPage },
    { request },
  ]),
  where: async (frames) => {
    // Extract optional pageRange from original request if present
    const newFrames = new Frames();
    for (const frame of frames) {
      const requestId = frame[request] as ID;
      const requestDoc = await Requesting._getRequest({ request: requestId });
      const requestInput =
        requestDoc?.input as { path: string; [key: string]: unknown } || {};

      const userIdValue = frame[userId];
      const bookIdValue = frame[bookId];
      const currentPageValue = frame[currentPage];
      const pageRangeValue = requestInput.pageRange ?? null;

      const newFrame = {
        ...frame,
        [userId]: userIdValue,
        [bookId]: bookIdValue,
        [currentPage]: currentPageValue,
        [pageRange]: pageRangeValue,
      };

      newFrames.push(newFrame);
    }
    return newFrames;
  },
  then: actions([
    CheckpointQuiz.getQuizContext,
    { userId, bookId, currentPage, pageRange },
  ]),
});

export const GetQuizContextResponse: Sync = ({ request, content }) => ({
  when: actions(
    [Requesting.request, { path: "/CheckpointQuiz/getQuizContext" }, {
      request,
    }],
    [CheckpointQuiz.getQuizContext, {}, { content }],
  ),
  then: actions([Requesting.respond, { request, content }]),
});

export const GetQuizContextResponseError: Sync = ({ request, error }) => ({
  when: actions(
    [Requesting.request, { path: "/CheckpointQuiz/getQuizContext" }, {
      request,
    }],
    [CheckpointQuiz.getQuizContext, {}, { error }],
  ),
  then: actions([Requesting.respond, { request, error }]),
});

/**
 * Sync: Handle createQuizFromPDF request
 */
export const CreateQuizFromPDFRequest: Sync = ({
  request,
  userId,
  bookId,
  currentPage,
  pageRange,
}) => ({
  when: actions([
    Requesting.request,
    { path: "/CheckpointQuiz/createQuizFromPDF", userId, bookId, currentPage },
    { request },
  ]),
  where: async (frames) => {
    // Extract optional pageRange from original request if present
    const newFrames = new Frames();
    for (const frame of frames) {
      const requestId = frame[request] as ID;
      const requestDoc = await Requesting._getRequest({ request: requestId });
      const requestInput =
        requestDoc?.input as { path: string; [key: string]: unknown } || {};

      const userIdValue = frame[userId];
      const bookIdValue = frame[bookId];
      const currentPageValue = frame[currentPage];
      const pageRangeValue = requestInput.pageRange ?? null;

      const newFrame = {
        ...frame,
        [userId]: userIdValue,
        [bookId]: bookIdValue,
        [currentPage]: currentPageValue,
        [pageRange]: pageRangeValue,
      };

      newFrames.push(newFrame);
    }
    return newFrames;
  },
  then: actions([
    CheckpointQuiz.createQuizFromPDF,
    { userId, bookId, currentPage, pageRange },
  ]),
});

export const CreateQuizFromPDFResponse: Sync = ({ request, quiz }) => ({
  when: actions(
    [Requesting.request, { path: "/CheckpointQuiz/createQuizFromPDF" }, {
      request,
    }],
    [CheckpointQuiz.createQuizFromPDF, {}, { quiz }],
  ),
  then: actions([Requesting.respond, { request, quiz }]),
});

export const CreateQuizFromPDFResponseError: Sync = ({ request, error }) => ({
  when: actions(
    [Requesting.request, { path: "/CheckpointQuiz/createQuizFromPDF" }, {
      request,
    }],
    [CheckpointQuiz.createQuizFromPDF, {}, { error }],
  ),
  then: actions([Requesting.respond, { request, error }]),
});

/**
 * Sync: Handle _getQuiz query (returns QuizDoc | null)
 * Note: Returns single object or null to match passthrough behavior
 */
export const GetQuizRequest: Sync = ({
  request,
  quizId,
  quiz,
}) => ({
  when: actions([
    Requesting.request,
    { path: "/CheckpointQuiz/_getQuiz", quizId },
    { request },
  ]),
  where: async (frames) => {
    // Query returns single object or null, so we wrap it manually
    const newFrames = new Frames();
    for (const frame of frames) {
      const quizIdValue = frame[quizId] as ID;
      const result = await CheckpointQuiz._getQuiz({ quizId: quizIdValue });
      // Push result (QuizDoc or null) directly into frame
      newFrames.push({ ...frame, [quiz]: result });
    }
    return newFrames;
  },
  // RequestingConcept will auto-detect single-value responses and return
  // the value directly (quiz or null) to match passthrough behavior
  then: actions([Requesting.respond, { request, quiz }]),
});

/**
 * Sync: Handle _getQuizAttempts query (returns QuizAttemptDoc[])
 * Note: Returns array directly to match passthrough behavior
 */
export const GetQuizAttemptsRequest: Sync = ({
  request,
  quizId,
  attempts,
}) => ({
  when: actions([
    Requesting.request,
    { path: "/CheckpointQuiz/_getQuizAttempts", quizId },
    { request },
  ]),
  where: async (frames) => {
    const newFrames = new Frames();
    for (const frame of frames) {
      const quizIdValue = frame[quizId] as ID;
      const allAttempts = await CheckpointQuiz._getQuizAttempts({
        quizId: quizIdValue,
      });
      // Store attempts array for response - RequestingConcept will return it directly
      newFrames.push({ ...frame, [attempts]: allAttempts });
    }
    return newFrames;
  },
  // RequestingConcept will auto-detect single array responses and return
  // the array directly to match passthrough behavior
  then: actions([Requesting.respond, { request, attempts }]),
});

/**
 * Sync: Handle _getUserAttempts query (returns QuizAttemptDoc[])
 * Note: Returns array directly to match passthrough behavior
 */
export const GetUserAttemptsRequest: Sync = ({
  request,
  userId,
  attempts,
}) => ({
  when: actions([
    Requesting.request,
    { path: "/CheckpointQuiz/_getUserAttempts", userId },
    { request },
  ]),
  where: async (frames) => {
    const newFrames = new Frames();
    for (const frame of frames) {
      const userIdValue = frame[userId] as ID;
      const allAttempts = await CheckpointQuiz._getUserAttempts({
        userId: userIdValue,
      });
      // Store attempts array for response - RequestingConcept will return it directly
      newFrames.push({ ...frame, [attempts]: allAttempts });
    }
    return newFrames;
  },
  // RequestingConcept will auto-detect single array responses and return
  // the array directly to match passthrough behavior
  then: actions([Requesting.respond, { request, attempts }]),
});
