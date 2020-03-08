import React, { Component } from "react";
import "./Timer.css";
import tinyTomatoTimerLogo from "./../img/tinyTomatoTimerLogo.svg";
import TimerButton from "./TimerButton";
import ProgressBar from "./ProgressBar";
import {
  convertMillisecondsToReadableTime,
  getFormattedCurrentDate
} from "./../utils/time";
import IntervalLabel from "./IntervalLabel";
import CancelImage from "./../img/cancel.svg";
import SkipImage from "./../img/skip.svg";
import { set, get } from "idb-keyval";

interface State {
  completedIntervals: number;
  timeLeftInCurrentInterval: number;
  intervalPaused: boolean;
  currentIntervalType: "workSession" | "shortBreak" | "longBreak";
  currentInterval?: number;
}

const INTERVAL_INCREMENTS = 100;
const WORK_SESSION = 0.1 * 60 * 1000;
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
    get(getFormattedCurrentDate()).then(val => {
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
        <div className="timer__controls">
          <img
            className="timer__controls--small"
            onClick={this.resetInterval.bind(this)}
            src={CancelImage}
            alt="Cancel Interval"
          />
          <TimerButton
            isRunning={!!this.state.currentInterval}
            onClick={this.onIntervalToggle.bind(this)}
          />
          <img
            className="timer__controls--small"
            src={SkipImage}
            alt="Skip Interval"
            onClick={this.wrapUpInterval.bind(this)}
          />
        </div>
        <div>
          <p className="timer__clock">
            {convertMillisecondsToReadableTime(
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

  private wrapUpInterval() {
    this.clearCurrentInterval();
    this.updateStats();
  }

  private resetInterval() {
    this.clearCurrentInterval();

    switch (this.state.currentIntervalType) {
      case "workSession":
        this.setState({
          timeLeftInCurrentInterval: WORK_SESSION
        });
        break;
      case "longBreak":
        this.setState({
          timeLeftInCurrentInterval: LONG_BREAK
        });
        break;
      case "shortBreak":
        this.setState({
          timeLeftInCurrentInterval: SHORT_BREAK
        });
        break;
      default:
    }
  }

  private onIntervalIncrement(s: number) {
    const timeLeft = this.state.timeLeftInCurrentInterval - s;
    if (timeLeft < 0) {
      // We've just finished the interval
      this.wrapUpInterval();
      this.notifyUser(this.state.currentIntervalType !== "workSession");
    } else {
      this.setState({
        timeLeftInCurrentInterval: timeLeft
      });
    }
  }

  private updateStats() {
    let completedIntervals = this.state.completedIntervals;
    if (this.state.currentIntervalType == "workSession") {
      completedIntervals = this.state.completedIntervals + 1;
      this.setState({ completedIntervals });
      set(getFormattedCurrentDate(), completedIntervals);
    }

    switch (this.state.currentIntervalType) {
      case "workSession":
        if (completedIntervals % 4 === 0) {
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

  private clearCurrentInterval() {
    window.clearInterval(this.state.currentInterval);
    this.setState({
      currentInterval: undefined
    });
  }

  private notifyUser(isWorkSession: boolean) {
    if (Notification.permission === "granted") {
      const message = isWorkSession
        ? "Take a break! You just finished a work interval."
        : "Time for your next work interval, your break is over.";
      new Notification("Tiny Tomato Timer", { body: message });
    }
  }

  private requestNotifications() {
    if (!("Notification" in window)) {
      console.log("This browser does not support system notifications");
      return;
    }
    if (Notification.permission !== "denied") {
      Notification.requestPermission(function(permission) {
        if (permission === "granted") {
          console.log("Notification permissions have been granted");
        }
      });
    }
  }
}

export default Timer;
