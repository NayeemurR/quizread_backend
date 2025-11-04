/**
 * FocusTimer synchronizations
 * Handles excluded FocusTimer routes through the Requesting concept
 */

import { FocusTimer, Requesting } from "@concepts";
import { actions, Frames, Sync } from "@engine";
import type { ID } from "@utils/types.ts";

/**
 * Sync: Handle start request
 */
export const StartRequest: Sync = ({
  request,
  durationMs,
  phase,
}) => ({
  when: actions([
    Requesting.request,
    { path: "/FocusTimer/start", durationMs, phase },
    { request },
  ]),
  then: actions([FocusTimer.start, { durationMs, phase }]),
});

export const StartResponse: Sync = ({ request, timerId }) => ({
  when: actions(
    [Requesting.request, { path: "/FocusTimer/start" }, { request }],
    [FocusTimer.start, {}, { timerId }],
  ),
  then: actions([Requesting.respond, { request, timerId }]),
});

export const StartResponseError: Sync = ({ request, error }) => ({
  when: actions(
    [Requesting.request, { path: "/FocusTimer/start" }, { request }],
    [FocusTimer.start, {}, { error }],
  ),
  then: actions([Requesting.respond, { request, error }]),
});

/**
 * Sync: Handle pause request
 */
export const PauseRequest: Sync = ({ request, timerId }) => ({
  when: actions([
    Requesting.request,
    { path: "/FocusTimer/pause", timerId },
    { request },
  ]),
  then: actions([FocusTimer.pause, { timerId }]),
});

export const PauseResponse: Sync = ({ request }) => ({
  when: actions(
    [Requesting.request, { path: "/FocusTimer/pause" }, { request }],
    [FocusTimer.pause, {}, {}],
  ),
  // Empty response - RequestingConcept will return {} when response is empty
  then: actions([Requesting.respond, { request }]),
});

export const PauseResponseError: Sync = ({ request, error }) => ({
  when: actions(
    [Requesting.request, { path: "/FocusTimer/pause" }, { request }],
    [FocusTimer.pause, {}, { error }],
  ),
  then: actions([Requesting.respond, { request, error }]),
});

/**
 * Sync: Handle resume request
 */
export const ResumeRequest: Sync = ({ request, timerId }) => ({
  when: actions([
    Requesting.request,
    { path: "/FocusTimer/resume", timerId },
    { request },
  ]),
  then: actions([FocusTimer.resume, { timerId }]),
});

export const ResumeResponse: Sync = ({ request }) => ({
  when: actions(
    [Requesting.request, { path: "/FocusTimer/resume" }, { request }],
    [FocusTimer.resume, {}, {}],
  ),
  // Empty response - RequestingConcept will return {} when response is empty
  then: actions([Requesting.respond, { request }]),
});

export const ResumeResponseError: Sync = ({ request, error }) => ({
  when: actions(
    [Requesting.request, { path: "/FocusTimer/resume" }, { request }],
    [FocusTimer.resume, {}, { error }],
  ),
  then: actions([Requesting.respond, { request, error }]),
});

/**
 * Sync: Handle expire request
 */
export const ExpireRequest: Sync = ({ request, timerId }) => ({
  when: actions([
    Requesting.request,
    { path: "/FocusTimer/expire", timerId },
    { request },
  ]),
  then: actions([FocusTimer.expire, { timerId }]),
});

export const ExpireResponse: Sync = ({ request }) => ({
  when: actions(
    [Requesting.request, { path: "/FocusTimer/expire" }, { request }],
    [FocusTimer.expire, {}, {}],
  ),
  // Empty response - RequestingConcept will return {} when response is empty
  then: actions([Requesting.respond, { request }]),
});

export const ExpireResponseError: Sync = ({ request, error }) => ({
  when: actions(
    [Requesting.request, { path: "/FocusTimer/expire" }, { request }],
    [FocusTimer.expire, {}, { error }],
  ),
  then: actions([Requesting.respond, { request, error }]),
});

/**
 * Sync: Handle _getTimer query (returns TimerDoc | null)
 * Note: Returns single object or null to match passthrough behavior
 */
export const GetTimerRequest: Sync = ({
  request,
  timerId,
  timer,
}) => ({
  when: actions([
    Requesting.request,
    { path: "/FocusTimer/_getTimer", timerId },
    { request },
  ]),
  where: async (frames) => {
    // Query returns single object or null, so we wrap it manually
    const newFrames = new Frames();
    for (const frame of frames) {
      const timerIdValue = frame[timerId] as ID;
      const result = await FocusTimer._getTimer({ timerId: timerIdValue });
      // Push result (TimerDoc or null) directly into frame
      newFrames.push({ ...frame, [timer]: result });
    }
    return newFrames;
  },
  // RequestingConcept will auto-detect single-value responses and return
  // the value directly (timer or null) to match passthrough behavior
  then: actions([Requesting.respond, { request, timer }]),
});

/**
 * Sync: Handle _getActiveTimers query (returns TimerDoc[])
 * Note: Returns array directly to match passthrough behavior
 */
export const GetActiveTimersRequest: Sync = ({
  request,
  timers,
}) => ({
  when: actions([
    Requesting.request,
    { path: "/FocusTimer/_getActiveTimers" },
    { request },
  ]),
  where: async (frames) => {
    const newFrames = new Frames();
    for (const frame of frames) {
      const allTimers = await FocusTimer._getActiveTimers();
      // Store timers array for response - RequestingConcept will return it directly
      newFrames.push({ ...frame, [timers]: allTimers });
    }
    return newFrames;
  },
  // RequestingConcept will auto-detect single array responses and return
  // the array directly to match passthrough behavior
  then: actions([Requesting.respond, { request, timers }]),
});

/**
 * Sync: Handle _getTimersByPhase query (returns TimerDoc[])
 * Note: Returns array directly to match passthrough behavior
 */
export const GetTimersByPhaseRequest: Sync = ({
  request,
  phase,
  timers,
}) => ({
  when: actions([
    Requesting.request,
    { path: "/FocusTimer/_getTimersByPhase", phase },
    { request },
  ]),
  where: async (frames) => {
    const newFrames = new Frames();
    for (const frame of frames) {
      const phaseValue = frame[phase] as string;
      const allTimers = await FocusTimer._getTimersByPhase({
        phase: phaseValue,
      });
      // Store timers array for response - RequestingConcept will return it directly
      newFrames.push({ ...frame, [timers]: allTimers });
    }
    return newFrames;
  },
  // RequestingConcept will auto-detect single array responses and return
  // the array directly to match passthrough behavior
  then: actions([Requesting.respond, { request, timers }]),
});
