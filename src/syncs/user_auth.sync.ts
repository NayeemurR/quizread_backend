/**
 * UserAuth synchronizations
 * Handles excluded UserAuth routes through the Requesting concept
 */

import { Requesting, UserAuth } from "@concepts";
import { actions, Frames, Sync } from "@engine";
import type { ID } from "@utils/types.ts";

/**
 * Sync: Handle _getUser request
 * Since _getUser is a query (starts with _), we need to use it in a where clause
 * Note: _getUser returns UserDoc | null, so we wrap it in an array for query handling
 */
export const GetUserRequest: Sync = ({ request, userId, user }) => ({
  when: actions([
    Requesting.request,
    { path: "/UserAuth/_getUser", userId },
    { request },
  ]),
  where: async (frames) => {
    // Query returns array, but _getUser returns single object, so we wrap it
    const newFrames = new Frames();
    for (const frame of frames) {
      const userIdValue = frame[userId] as ID;
      const result = await UserAuth._getUser({ userId: userIdValue });
      const userArray = result ? [result] : [];
      for (const userDoc of userArray) {
        newFrames.push({ ...frame, [user]: userDoc });
      }
      // If no results, still keep one frame but with null user
      if (userArray.length === 0) {
        newFrames.push({ ...frame, [user]: null });
      }
    }
    return newFrames;
  },
  then: actions([Requesting.respond, { request, user }]),
});

/**
 * Sync: Handle _getUserByEmail request
 * Since _getUserByEmail is a query (starts with _), we need to use it in a where clause
 */
export const GetUserByEmailRequest: Sync = ({ request, email, user }) => ({
  when: actions([
    Requesting.request,
    { path: "/UserAuth/_getUserByEmail", email },
    { request },
  ]),
  where: async (frames) => {
    // Query returns array, but _getUserByEmail returns single object, so we wrap it
    const newFrames = new Frames();
    for (const frame of frames) {
      const emailValue = frame[email] as string;
      const result = await UserAuth._getUserByEmail({ email: emailValue });
      const userArray = result ? [result] : [];
      for (const userDoc of userArray) {
        newFrames.push({ ...frame, [user]: userDoc });
      }
      // If no results, still keep one frame but with null user
      if (userArray.length === 0) {
        newFrames.push({ ...frame, [user]: null });
      }
    }
    return newFrames;
  },
  then: actions([Requesting.respond, { request, user }]),
});

/**
 * Sync: Handle _getAllUsers request
 * Since _getAllUsers is a query (starts with _), we need to use it in a where clause
 */
export const GetAllUsersRequest: Sync = ({ request, users }) => ({
  when: actions([
    Requesting.request,
    { path: "/UserAuth/_getAllUsers" },
    { request },
  ]),
  where: async (frames) => {
    // _getAllUsers returns UserDoc[] directly, so we manually call it and wrap in frames
    const allUsers = await UserAuth._getAllUsers();
    const newFrames = new Frames();
    for (const frame of frames) {
      // Collect all users into an array
      newFrames.push({ ...frame, [users]: allUsers });
    }
    return newFrames;
  },
  then: actions([Requesting.respond, { request, users }]),
});
