import React, { Component } from "react";
import "./Timer.css";
import tinyTomatoTimerLogo from "./../img/tinyTomatoTimerLogo.svg";
import TimerButton from "./TimerButton";
import ProgressBar from "./ProgressBar";
import IntervalLabel from "./IntervalLabel";
import { set, get } from "idb-keyval";

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

  componentWillMount() {
    get(this.getFormattedCurrentDate()).then(val => {
      if (val && typeof val == "number") {
        this.setState({
          completedIntervals: val
        });
      }
    });
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
    this.requestNotifications();

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
      this.notifyUser(this.state.currentIntervalType === "workSession");
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
      const completedIntervals = this.state.completedIntervals + 1;
      this.setState({ completedIntervals });
      set(this.getFormattedCurrentDate(), completedIntervals);
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

  private getFormattedCurrentDate() {
    const date = new Date();
    return [date.getDate(), date.getMonth() + 1, date.getFullYear()].join("-");
  }

  private notifyUser(isWorkSession: boolean) {
    if (Notification.permission === "granted") {
      const message = isWorkSession
        ? "Take a break! You just finished a Pomodoro interval."
        : "Time for your next work interval, your break is over.";
      new Notification("Tiny Tomato Timer", { body: message });
    }
  }

  private requestNotifications() {
    if (!("Notification" in window)) {
      console.log("This browser does not support system notifications");
    }
    if (Notification.permission !== "denied") {
      Notification.requestPermission(function(permission) {
        if (permission === "granted") {
          console.log("Notification permissions have been granted");
        }
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
