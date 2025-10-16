concept FocusTimer []
purpose generic countdown timer with phases
principle when a running timer expires, it flips phase and resets

state
  a set of Timers with
    an _id Id
    a phase String  // "reading" | "break"
    a startedAtMs Number
    a durationMs Number
    an isActive Boolean

actions
  start (durationMs: Number, phase: String) : (timerId: Id)
    requires durationMs > 0; phase in {"reading","break"}
    effect creates active timer

  pause (timerId: Id)
    requires isActive=true
    effect sets isActive=false

  resume (timerId: Id)
    requires isActive=false
    effect sets isActive=true and startedAtMs=now

  system expire (timerId: Id)
    requires isActive=true and (now - startedAtMs) >= durationMs
    effect flips phase (reading↔break) and sets startedAtMs=now
