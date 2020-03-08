import { set, get } from "idb-keyval";
import { getFormattedCurrentDate } from "./utils/time";

const MAX_INTERVALS: number = 8; // After which your workday is done
const WORK_SESSION_LENGTH: number = 0.1 * 60 * 1000; // 25 minutes
const LONG_BREAK_LENGTH: number = 30 * 60 * 1000; // 30 minutes
const SHORT_BREAK_LENGTH: number = 5 * 60 * 1000; // 5 minutes
const LONG_BREAK_AFTER: [number] = [4]; // How many work sessions the longer breaks should be after

type IntervalType =
  | "start"
  | "workSession"
  | "shortBreak"
  | "longBreak"
  | "end";

type IntervalId = number;

interface Interval {
  time: number;
  next: (intervalCount: number) => IntervalType;
}

interface CurrentInterval {
  interval: Interval;
  timeLeft: number;
  intervalCount: number;
}

class Stopwatch {
  private intervalId?: IntervalId;
  private time: number;
  private increment: number = 100;
  onFinish: () => void;
  onTick: (timeLeft: number) => void;

  constructor(
    time: number,
    onTick: (timeLeft: number) => void,
    onFinish: () => void
  ) {
    this.time = time;
    this.onTick = onTick;
    this.onFinish = onFinish;
  }

  start() {
    this.intervalId = window.setInterval(this.check.bind(this), this.increment);
  }

  check() {
    const timeLeft = this.time - this.increment;
    if (timeLeft < 0) {
      this.onFinish();
    } else {
      this.onTick(timeLeft);
    }
  }

  stop() {
    window.clearInterval(this.intervalId);
  }
}

class Pomodoro {
  states: { [key in IntervalType]: Interval } = {
    start: { time: 0, next: () => "workSession" },
    workSession: {
      time: WORK_SESSION_LENGTH,
      next: intervalCount => {
        if (intervalCount >= MAX_INTERVALS) {
          return "end";
        } else if (LONG_BREAK_AFTER.includes(intervalCount)) {
          return "longBreak";
        } else {
          return "shortBreak";
        }
      }
    },
    shortBreak: { time: SHORT_BREAK_LENGTH, next: () => "workSession" },
    longBreak: { time: LONG_BREAK_LENGTH, next: () => "workSession" },
    end: { time: 0, next: () => "start" }
  };
  currentState: IntervalType;
  intervalCount: number;
  onUpdate: (currentInterval: CurrentInterval) => void;

  constructor(onUpdate: (currentInterval: CurrentInterval) => void) {
    this.currentState = "start";
    this.intervalCount = 0;
    this.onUpdate = onUpdate;

    get(getFormattedCurrentDate()).then(val => {
      if (val && typeof val == "number") {
        this.intervalCount = val;
      }
    });
  }

  pause() {}

  resume() {}

  reset() {}

  finish() {
    if (this.currentState === "workSession") {
      this.intervalCount++;
      set(getFormattedCurrentDate(), this.intervalCount);
    }

    this.next();
  }

  next() {
    this.currentState = this.states[this.currentState].next(this.intervalCount);
  }
}

export default Pomodoro;
