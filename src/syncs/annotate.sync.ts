/**
 * Annotate synchronizations
 * Handles excluded Annotate routes through the Requesting concept
 */

import { Annotate, Requesting } from "@concepts";
import { actions, Frames, Sync } from "@engine";
import type { ID } from "@utils/types.ts";

/**
 * Sync: Handle saveAnnotation request
 */
export const SaveAnnotationRequest: Sync = ({
  request,
  userId,
  bookId,
  content,
  keyIdeas,
}) => ({
  when: actions([
    Requesting.request,
    { path: "/Annotate/saveAnnotation", userId, bookId, content, keyIdeas },
    { request },
  ]),
  then: actions([Annotate.saveAnnotation, {
    userId,
    bookId,
    content,
    keyIdeas,
  }]),
});

export const SaveAnnotationResponse: Sync = ({ request, annotationId }) => ({
  when: actions(
    [Requesting.request, { path: "/Annotate/saveAnnotation" }, { request }],
    [Annotate.saveAnnotation, {}, { annotationId }],
  ),
  then: actions([Requesting.respond, { request, annotationId }]),
});

export const SaveAnnotationResponseError: Sync = ({ request, error }) => ({
  when: actions(
    [Requesting.request, { path: "/Annotate/saveAnnotation" }, { request }],
    [Annotate.saveAnnotation, {}, { error }],
  ),
  then: actions([Requesting.respond, { request, error }]),
});

/**
 * Sync: Handle _getUserAnnotations query (returns AnnotationDoc[])
 * Note: Returns array directly to match passthrough behavior
 */
export const GetUserAnnotationsRequest: Sync = ({
  request,
  userId,
  content,
  annotations,
}) => ({
  when: actions([
    Requesting.request,
    { path: "/Annotate/_getUserAnnotations", userId, content },
    { request },
  ]),
  where: async (frames) => {
    const newFrames = new Frames();
    for (const frame of frames) {
      const userIdValue = frame[userId] as ID;
      const contentValue = frame[content] as string;
      const allAnnotations = await Annotate._getUserAnnotations({
        userId: userIdValue,
        content: contentValue,
      });
      // Store annotations array for response - RequestingConcept will return it directly
      newFrames.push({ ...frame, [annotations]: allAnnotations });
    }
    return newFrames;
  },
  // RequestingConcept will auto-detect single array responses and return
  // the array directly to match passthrough behavior
  then: actions([Requesting.respond, { request, annotations }]),
});

/**
 * Sync: Handle _getAllUserAnnotations query (returns AnnotationDoc[])
 * Note: Returns array directly to match passthrough behavior
 */
export const GetAllUserAnnotationsRequest: Sync = ({
  request,
  userId,
  annotations,
}) => ({
  when: actions([
    Requesting.request,
    { path: "/Annotate/_getAllUserAnnotations", userId },
    { request },
  ]),
  where: async (frames) => {
    const newFrames = new Frames();
    for (const frame of frames) {
      const userIdValue = frame[userId] as ID;
      const allAnnotations = await Annotate._getAllUserAnnotations({
        userId: userIdValue,
      });
      // Store annotations array for response - RequestingConcept will return it directly
      newFrames.push({ ...frame, [annotations]: allAnnotations });
    }
    return newFrames;
  },
  // RequestingConcept will auto-detect single array responses and return
  // the array directly to match passthrough behavior
  then: actions([Requesting.respond, { request, annotations }]),
});

/**
 * Sync: Handle _getAnnotationsForBook query (returns AnnotationDoc[])
 * Note: Returns array directly to match passthrough behavior
 */
export const GetAnnotationsForBookRequest: Sync = ({
  request,
  userId,
  bookId,
  annotations,
}) => ({
  when: actions([
    Requesting.request,
    { path: "/Annotate/_getAnnotationsForBook", userId, bookId },
    { request },
  ]),
  where: async (frames) => {
    const newFrames = new Frames();
    for (const frame of frames) {
      const userIdValue = frame[userId] as ID;
      const bookIdValue = frame[bookId] as ID;
      const allAnnotations = await Annotate._getAnnotationsForBook({
        userId: userIdValue,
        bookId: bookIdValue,
      });
      // Store annotations array for response - RequestingConcept will return it directly
      newFrames.push({ ...frame, [annotations]: allAnnotations });
    }
    return newFrames;
  },
  // RequestingConcept will auto-detect single array responses and return
  // the array directly to match passthrough behavior
  then: actions([Requesting.respond, { request, annotations }]),
});
