import { Collection, Db } from "mongodb";
import { Empty, ID } from "@utils/types.ts";
import { freshID } from "@utils/database.ts";
import { nowMs } from "../../util/time.ts";

// Collection prefix to ensure namespace separation
const PREFIX = "FocusTimer" + ".";

// Internal entity types, represented as IDs
type Timer = ID;

/**
 * State: A set of Timers with phase, timing, and active status.
 */
interface TimerDoc {
  _id: Timer;
  phase: string; // "reading" | "break"
  startedAtMs: number;
  durationMs: number;
  isActive: boolean;
}

/**
 * @concept FocusTimer
 * @purpose Generic countdown timer with phases
 */
export default class FocusTimerConcept {
  timers: Collection<TimerDoc>;

  constructor(private readonly db: Db) {
    this.timers = this.db.collection(PREFIX + "timers");
  }

  /**
   * Action: Starts a new timer with specified duration and phase.
   * @requires durationMs > 0
   * @requires phase must be "reading" or "break"
   * @effects A new active timer is created and its ID is returned
   */
  async start(
    { durationMs, phase }: { durationMs: number; phase: string },
  ): Promise<{ timerId: Timer } | { error: string }> {
    if (durationMs <= 0) {
      return { error: "durationMs must be greater than 0" };
    }

    if (!["reading", "break"].includes(phase)) {
      return { error: "phase must be 'reading' or 'break'" };
    }

    const timerId = freshID() as Timer;
    await this.timers.insertOne({
      _id: timerId,
      phase,
      startedAtMs: nowMs(),
      durationMs,
      isActive: true,
    });

    return { timerId };
  }

  /**
   * Action: Pauses an active timer.
   * @requires Timer must exist and be active
   * @effects Sets isActive to false
   */
  async pause(
    { timerId }: { timerId: Timer },
  ): Promise<Empty | { error: string }> {
    const timer = await this.timers.findOne({ _id: timerId });
    if (!timer) {
      return { error: "Timer not found" };
    }

    if (!timer.isActive) {
      return { error: "Timer is not active" };
    }

    await this.timers.updateOne(
      { _id: timerId },
      { $set: { isActive: false } },
    );

    return {};
  }

  /**
   * Action: Resumes a paused timer.
   * @requires Timer must exist and be inactive
   * @effects Sets isActive to true and updates startedAtMs to now
   */
  async resume(
    { timerId }: { timerId: Timer },
  ): Promise<Empty | { error: string }> {
    const timer = await this.timers.findOne({ _id: timerId });
    if (!timer) {
      return { error: "Timer not found" };
    }

    if (timer.isActive) {
      return { error: "Timer is already active" };
    }

    await this.timers.updateOne(
      { _id: timerId },
      {
        $set: {
          isActive: true,
          startedAtMs: nowMs(),
        },
      },
    );

    return {};
  }

  /**
   * Action: Expires an active timer that has reached its duration.
   * @requires Timer must exist, be active, and have reached its duration
   * @effects Flips phase (reading↔break) and resets startedAtMs to now
   */
  async expire(
    { timerId }: { timerId: Timer },
  ): Promise<Empty | { error: string }> {
    const timer = await this.timers.findOne({ _id: timerId });
    if (!timer) {
      return { error: "Timer not found" };
    }

    if (!timer.isActive) {
      return { error: "Timer is not active" };
    }

    const currentTime = nowMs();
    if ((currentTime - timer.startedAtMs) < timer.durationMs) {
      return { error: "Timer has not expired yet" };
    }

    const newPhase = timer.phase === "reading" ? "break" : "reading";

    await this.timers.updateOne(
      { _id: timerId },
      {
        $set: {
          phase: newPhase,
          startedAtMs: currentTime,
        },
      },
    );

    return {};
  }

  /**
   * Query: Retrieves a timer by its ID.
   */
  async _getTimer(
    { timerId }: { timerId: Timer },
  ): Promise<TimerDoc | null> {
    return await this.timers.findOne({ _id: timerId });
  }

  /**
   * Query: Retrieves all active timers.
   */
  async _getActiveTimers(): Promise<TimerDoc[]> {
    return await this.timers.find({ isActive: true }).toArray();
  }

  /**
   * Query: Retrieves all timers with a specific phase.
   */
  async _getTimersByPhase(
    { phase }: { phase: string },
  ): Promise<TimerDoc[]> {
    return await this.timers.find({ phase }).toArray();
  }
}
