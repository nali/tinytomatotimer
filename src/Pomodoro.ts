const MAX_INTERVALS: number = 8;
const WORK_SESSION_LENGTH: number = 0.1 * 60 * 1000; // 25 minutes
const LONG_BREAK_LENGTH: number = 30 * 60 * 1000; // 30 minutes
const SHORT_BREAK_LENGTH: number = 5 * 60 * 1000; // 5 minutes
const LONG_BREAK_AFTER: [number] = [4];

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

  constructor() {
    this.currentState = "start";
    this.intervalCount = 0; // Lookup from indexed db.
  }

  next() {
    if (this.currentState === "workSession") {
      this.intervalCount++;
    }
    this.currentState = this.states[this.currentState].next(this.intervalCount);

    console.log(this.intervalCount);
  }
}

export default Pomodoro;
