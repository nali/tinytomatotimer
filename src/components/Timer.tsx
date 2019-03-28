import React, { Component } from "react";
import "./Timer.css";
import tinyTomatoTimerLogo from "./../img/tinyTomatoTimerLogo.svg";
import TimerButton from "./TimerButton";
import ProgressBar from "./ProgressBar";
import IntervalLabel from "./IntervalLabel";

interface State {
  completedIntervals: number;
  timeLeftInCurrentInterval: number;
  intervalPaused: boolean;
  currentIntervalType: "workSession" | "shortBreak" | "longBreak";
  currentInterval?: number;
}

const INTERVAL_INCREMENTS = 100;
const WORK_SESSION = 25 * 60 * 1000;
const SHORT_BREAK = 5 * 60 * 1000;
const LONG_BREAK = 30 * 60 * 1000;

class Timer extends Component<any, State> {
  constructor(props: any) {
    super(props);
    this.state = {
      completedIntervals: 0,
      timeLeftInCurrentInterval: WORK_SESSION,
      currentIntervalType: "workSession",
      intervalPaused: false
    };

    this.onIntervalToggle = this.onIntervalToggle.bind(this);
  }

  render() {
    return (
      <div className="timer">
        <div>
          <img
            className="timer__logo"
            src={tinyTomatoTimerLogo}
            alt="Tiny Tomato Timer"
          />
        </div>

        {/* <div>CANCEL INTERVAL</div> */}
        <TimerButton
          isRunning={!!this.state.currentInterval}
          onClick={this.onIntervalToggle.bind(this)}
        />
        <div>
          <p className="timer__clock">
            {this.convertMillisecondsToReadableTime(
              this.state.timeLeftInCurrentInterval
            )}
          </p>
          <IntervalLabel intervalType={this.state.currentIntervalType} />
        </div>
        <ProgressBar completedIntervals={this.state.completedIntervals} />
      </div>
    );
  }

  private onIntervalToggle() {
    if (this.state.currentInterval) {
      this.clearCurrentInterval();
    } else {
      this.setState({
        currentInterval: window.setInterval(
          this.onIntervalIncrement.bind(this, INTERVAL_INCREMENTS),
          INTERVAL_INCREMENTS
        )
      });
    }
  }

  private onIntervalIncrement(s: number) {
    const timeLeft = this.state.timeLeftInCurrentInterval - s;
    if (timeLeft < 0) {
      // We've just finished the interval
      this.clearCurrentInterval();
      this.updateStats();
      this.setNextInterval();
    } else {
      this.setState({
        timeLeftInCurrentInterval: timeLeft
      });
    }
  }

  private updateStats() {
    if (this.state.currentIntervalType == "workSession") {
      this.setState({ completedIntervals: this.state.completedIntervals + 1 });
    }
  }

  private clearCurrentInterval() {
    window.clearInterval(this.state.currentInterval);
    this.setState({
      currentInterval: undefined
    });
  }

  private setNextInterval() {
    switch (this.state.currentIntervalType) {
      case "workSession":
        if (this.state.completedIntervals % 4 === 0) {
          this.setState({
            currentIntervalType: "longBreak",
            timeLeftInCurrentInterval: LONG_BREAK
          });
        } else {
          this.setState({
            currentIntervalType: "shortBreak",
            timeLeftInCurrentInterval: SHORT_BREAK
          });
        }
        break;
      default:
        this.setState({
          currentIntervalType: "workSession",
          timeLeftInCurrentInterval: WORK_SESSION
        });
    }
  }

  private convertMillisecondsToReadableTime(s: number) {
    var ms = s % 1000;
    s = (s - ms) / 1000;
    var secs = s % 60;
    s = (s - secs) / 60;
    var mins = s % 60;

    return this.padNumber(mins) + ":" + this.padNumber(secs);
  }

  private padNumber(num: number) {
    return num < 10 ? "0" + num : "" + num;
  }
}

export default Timer;
