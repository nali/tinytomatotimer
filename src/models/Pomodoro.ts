import { set, get } from "idb-keyval";
import { getFormattedCurrentDate } from "../utils/time";
import Stopwatch from "./Stopwatch";

export const MAX_INTERVALS: number = 8; // After which your workday is done
const WORK_SESSION_LENGTH: number = 0.1 * 60 * 1000; // 25 minutes
const LONG_BREAK_LENGTH: number = 30 * 60 * 1000; // 30 minutes
const SHORT_BREAK_LENGTH: number = 5 * 60 * 1000; // 5 minutes
const LONG_BREAK_AFTER: [number] = [4]; // How many work sessions the longer breaks should be after

export type IntervalType = "workSession" | "shortBreak" | "longBreak" | "end";

interface Interval {
  time: number;
  next: (intervalCount: number) => IntervalType;
}

export interface CurrentInterval {
  type: IntervalType;
  timeLeft: number;
  paused: boolean;
}

class Pomodoro {
  states: { [key in IntervalType]: Interval } = {
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
    end: { time: 0, next: () => "end" }
  };
  currentInterval: CurrentInterval;
  intervalCount: number;
  onUpdate: (currentInterval: CurrentInterval, intervalCount: number) => void;
  stopwatch?: Stopwatch;

  constructor(
    onUpdate: (currentInterval: CurrentInterval, intervalCount: number) => void
  ) {
    this.currentInterval = {
      paused: true,
      type: "workSession",
      timeLeft: this.states["workSession"].time
    };
    this.intervalCount = 0;
    this.onUpdate = onUpdate;

    get(getFormattedCurrentDate()).then(val => {
      if (val && typeof val == "number") {
        this.intervalCount = val;
        this.update();
      }
    });
  }

  pause() {
    this.currentInterval.paused = true;
    this.stopwatch && this.stopwatch.stop();
    this.update();
  }

  resume() {
    this.stopwatch = new Stopwatch(
      this.currentInterval.timeLeft,
      this.onStopwatchTick.bind(this),
      this.onStopwatchFinish.bind(this)
    );

    this.stopwatch.start();
    this.currentInterval.paused = false;
  }

  toggle() {
    if (this.currentInterval.paused) {
      this.resume();
    } else {
      this.pause();
    }
  }

  reset() {
    this.currentInterval.timeLeft = this.states[this.currentInterval.type].time;
    this.pause();
  }

  finish() {
    if (this.currentInterval.type === "workSession") {
      this.intervalCount++;
      set(getFormattedCurrentDate(), this.intervalCount);
    }

    this.next();
  }

  next() {
    const nextType: IntervalType = this.states[this.currentInterval.type].next(
      this.intervalCount
    );
    this.currentInterval = {
      paused: true,
      type: nextType,
      timeLeft: this.states[nextType].time
    };
    this.pause();
  }

  update() {
    this.onUpdate(this.state.currentInterval, this.state.intervalCount);
  }

  get state() {
    return {
      paused: this.currentInterval.paused,
      currentInterval: this.currentInterval,
      intervalCount: this.intervalCount
    };
  }

  private onStopwatchTick(timeLeft: number) {
    this.currentInterval.timeLeft = timeLeft;
    this.update();
  }

  private onStopwatchFinish() {
    this.finish();
    this.update();
  }
}

export default Pomodoro;
