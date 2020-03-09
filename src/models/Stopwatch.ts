type IntervalId = number;

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
    this.time -= this.increment;
    if (this.time < 0) {
      this.stop();
      this.onFinish();
    } else {
      this.onTick(this.time);
    }
  }

  stop() {
    window.clearInterval(this.intervalId);
    this.time = 0;
  }
}

export default Stopwatch;
