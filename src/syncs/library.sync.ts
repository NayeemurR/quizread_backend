/**
 * Library synchronizations
 * Handles excluded Library routes through the Requesting concept
 */

import { Library, Requesting } from "@concepts";
import { actions, Frames, Sync } from "@engine";
import type { ID } from "@utils/types.ts";

/**
 * Sync: Handle prepareUpload request
 * Note: contentType is optional with a default value, so we omit it from the pattern
 * and extract it from the original request if present
 */
export const PrepareUploadRequest: Sync = ({
  request,
  ownerId,
  fileName,
  contentType,
}) => ({
  when: actions([
    Requesting.request,
    { path: "/Library/prepareUpload", ownerId, fileName },
    { request },
  ]),
  where: async (frames) => {
    // Extract contentType from the original request if present
    const newFrames = new Frames();
    for (const frame of frames) {
      const requestId = frame[request] as ID;
      const requestDoc = await Requesting._getRequest({ request: requestId });
      const requestInput =
        requestDoc?.input as { path: string; [key: string]: unknown } || {};

      // Use null instead of undefined for optional contentType to avoid matchThen errors
      const contentTypeValue = requestInput.contentType ?? null;

      const newFrame = {
        ...frame,
        [ownerId]: frame[ownerId],
        [fileName]: frame[fileName],
        [contentType]: contentTypeValue, // null if not provided (action has default)
      };

      newFrames.push(newFrame);
    }
    return newFrames;
  },
  then: actions([
    Library.prepareUpload,
    { ownerId, fileName, contentType },
  ]),
});

export const PrepareUploadResponse: Sync = ({
  request,
  signedUrl,
  publicUrl,
  fileName: resultFileName,
}) => ({
  when: actions(
    [Requesting.request, { path: "/Library/prepareUpload" }, { request }],
    [Library.prepareUpload, {}, {
      signedUrl,
      publicUrl,
      fileName: resultFileName,
    }],
  ),
  then: actions([
    Requesting.respond,
    { request, signedUrl, publicUrl, fileName: resultFileName },
  ]),
});

export const PrepareUploadResponseError: Sync = ({ request, error }) => ({
  when: actions(
    [Requesting.request, { path: "/Library/prepareUpload" }, { request }],
    [Library.prepareUpload, {}, { error }],
  ),
  then: actions([Requesting.respond, { request, error }]),
});

/**
 * Sync: Handle addBook request
 * Note: fileName is optional, so we omit it from the pattern to avoid matching failures
 * We use a where clause to extract it from the original request if present
 */
export const AddBookRequest: Sync = ({
  request,
  ownerId,
  title,
  storageUrl,
  fileName,
}) => ({
  when: actions([
    Requesting.request,
    { path: "/Library/addBook", ownerId, title, storageUrl },
    { request },
  ]),
  where: async (frames) => {
    // Build action input, including fileName if it was in the original request
    // We need to access the original Requesting.request input to get optional params
    const newFrames = new Frames();
    for (const frame of frames) {
      const requestId = frame[request] as ID;
      // Get the request document to access all input parameters (including optional ones)
      const requestDoc = await Requesting._getRequest({ request: requestId });
      const requestInput =
        requestDoc?.input as { path: string; [key: string]: unknown } || {};

      // Extract individual values
      const ownerIdValue = frame[ownerId];
      const titleValue = frame[title];
      const storageUrlValue = frame[storageUrl];
      // For optional fileName, use null instead of undefined to avoid matchThen errors
      // The action will receive null and can handle it (or we filter it out)
      const fileNameValue = requestInput.fileName ?? null;

      // Bind all values to the frame
      const newFrame = {
        ...frame,
        [ownerId]: ownerIdValue,
        [title]: titleValue,
        [storageUrl]: storageUrlValue,
        [fileName]: fileNameValue, // null if not provided (instead of undefined)
      };

      newFrames.push(newFrame);
    }
    return newFrames;
  },
  then: actions([Library.addBook, { ownerId, title, storageUrl, fileName }]),
});

export const AddBookResponse: Sync = ({ request, bookId }) => ({
  when: actions(
    [Requesting.request, { path: "/Library/addBook" }, { request }],
    [Library.addBook, {}, { bookId }],
  ),
  then: actions([Requesting.respond, { request, bookId }]),
});

export const AddBookResponseError: Sync = ({ request, error }) => ({
  when: actions(
    [Requesting.request, { path: "/Library/addBook" }, { request }],
    [Library.addBook, {}, { error }],
  ),
  then: actions([Requesting.respond, { request, error }]),
});

/**
 * Sync: Handle getBook request
 */
export const GetBookRequest: Sync = ({ request, bookId }) => ({
  when: actions([
    Requesting.request,
    { path: "/Library/getBook", bookId },
    { request },
  ]),
  then: actions([Library.getBook, { bookId }]),
});

export const GetBookResponse: Sync = ({ request, exists }) => ({
  when: actions(
    [Requesting.request, { path: "/Library/getBook" }, { request }],
    [Library.getBook, {}, { exists }],
  ),
  then: actions([Requesting.respond, { request, exists }]),
});

/**
 * Sync: Handle listBooks request
 */
export const ListBooksRequest: Sync = ({ request, ownerId }) => ({
  when: actions([
    Requesting.request,
    { path: "/Library/listBooks", ownerId },
    { request },
  ]),
  then: actions([Library.listBooks, { ownerId }]),
});

export const ListBooksResponse: Sync = ({ request, bookIds }) => ({
  when: actions(
    [Requesting.request, { path: "/Library/listBooks" }, { request }],
    [Library.listBooks, {}, { bookIds }],
  ),
  then: actions([Requesting.respond, { request, bookIds }]),
});

/**
 * Sync: Handle removeBook request
 */
export const RemoveBookRequest: Sync = ({ request, ownerId, bookId }) => ({
  when: actions([
    Requesting.request,
    { path: "/Library/removeBook", ownerId, bookId },
    { request },
  ]),
  then: actions([Library.removeBook, { ownerId, bookId }]),
});

export const RemoveBookResponse: Sync = ({ request }) => ({
  when: actions(
    [Requesting.request, { path: "/Library/removeBook" }, { request }],
    [Library.removeBook, {}, {}],
  ),
  // Empty response - RequestingConcept will return {} when response is empty
  then: actions([Requesting.respond, { request }]),
});

export const RemoveBookResponseError: Sync = ({ request, error }) => ({
  when: actions(
    [Requesting.request, { path: "/Library/removeBook" }, { request }],
    [Library.removeBook, {}, { error }],
  ),
  then: actions([Requesting.respond, { request, error }]),
});

/**
 * Sync: Handle cleanupFailedUpload request
 */
export const CleanupFailedUploadRequest: Sync = ({ request, fileName }) => ({
  when: actions([
    Requesting.request,
    { path: "/Library/cleanupFailedUpload", fileName },
    { request },
  ]),
  then: actions([Library.cleanupFailedUpload, { fileName }]),
});

export const CleanupFailedUploadResponse: Sync = ({ request }) => ({
  when: actions(
    [Requesting.request, { path: "/Library/cleanupFailedUpload" }, { request }],
    [Library.cleanupFailedUpload, {}, {}],
  ),
  // Empty response - RequestingConcept will return {} when response is empty
  then: actions([Requesting.respond, { request }]),
});

export const CleanupFailedUploadResponseError: Sync = ({ request, error }) => ({
  when: actions(
    [Requesting.request, { path: "/Library/cleanupFailedUpload" }, { request }],
    [Library.cleanupFailedUpload, {}, { error }],
  ),
  then: actions([Requesting.respond, { request, error }]),
});

/**
 * Sync: Handle getViewUrl request
 */
export const GetViewUrlRequest: Sync = ({
  request,
  ownerId,
  bookId,
  expiresInMinutes,
}) => ({
  when: actions([
    Requesting.request,
    {
      path: "/Library/getViewUrl",
      ownerId,
      bookId,
      expiresInMinutes,
    },
    { request },
  ]),
  then: actions([
    Library.getViewUrl,
    { ownerId, bookId, expiresInMinutes },
  ]),
});

export const GetViewUrlResponse: Sync = ({ request, viewUrl }) => ({
  when: actions(
    [Requesting.request, { path: "/Library/getViewUrl" }, { request }],
    [Library.getViewUrl, {}, { viewUrl }],
  ),
  then: actions([Requesting.respond, { request, viewUrl }]),
});

export const GetViewUrlResponseError: Sync = ({ request, error }) => ({
  when: actions(
    [Requesting.request, { path: "/Library/getViewUrl" }, { request }],
    [Library.getViewUrl, {}, { error }],
  ),
  then: actions([Requesting.respond, { request, error }]),
});

/**
 * Sync: Handle _getBook query (returns BookDoc | null)
 * Returns the book directly or null to match passthrough behavior
 */
export const GetBookQueryRequest: Sync = ({ request, bookId, book }) => ({
  when: actions([
    Requesting.request,
    { path: "/Library/_getBook", bookId },
    { request },
  ]),
  where: async (frames) => {
    const newFrames = new Frames();
    for (const frame of frames) {
      const bookIdValue = frame[bookId] as ID;
      const result = await Library._getBook({ bookId: bookIdValue });
      const bookArray = result ? [result] : [];
      for (const bookDoc of bookArray) {
        newFrames.push({ ...frame, [book]: bookDoc });
      }
      if (bookArray.length === 0) {
        newFrames.push({ ...frame, [book]: null });
      }
    }
    return newFrames;
  },
  // RequestingConcept will auto-detect single-value responses and return
  // the value directly (book or null) to match passthrough behavior
  then: actions([Requesting.respond, { request, book }]),
});

/**
 * Sync: Handle _getUserBooks query (returns BookDoc[])
 * Note: Returns array directly to match passthrough behavior
 */
export const GetUserBooksRequest: Sync = ({ request, ownerId, books }) => ({
  when: actions([
    Requesting.request,
    { path: "/Library/_getUserBooks", ownerId },
    { request },
  ]),
  where: async (frames) => {
    const newFrames = new Frames();
    for (const frame of frames) {
      const ownerIdValue = frame[ownerId] as ID;
      const allBooks = await Library._getUserBooks({ ownerId: ownerIdValue });
      // Store books array for response - we'll return it directly
      newFrames.push({ ...frame, [books]: allBooks });
    }
    return newFrames;
  },
  // RequestingConcept will auto-detect single array responses and return
  // the array directly to match passthrough behavior
  then: actions([Requesting.respond, { request, books }]),
});

/**
 * Sync: Handle _getAllBooks query (returns BookDoc[])
 */
export const GetAllBooksRequest: Sync = ({ request, books }) => ({
  when: actions([
    Requesting.request,
    { path: "/Library/_getAllBooks" },
    { request },
  ]),
  where: async (frames) => {
    const newFrames = new Frames();
    for (const frame of frames) {
      const allBooks = await Library._getAllBooks();
      newFrames.push({ ...frame, [books]: allBooks });
    }
    return newFrames;
  },
  then: actions([Requesting.respond, { request, books }]),
});
