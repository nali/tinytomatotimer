import React, { Component } from "react";
import "./Timer.css";
import tinyTomatoTimerLogo from "./../img/tinyTomatoTimerLogo.svg";
import TimerButton from "./TimerButton";
import ProgressBar from "./ProgressBar";
import {
  convertMillisecondsToReadableTime,
  getFormattedCurrentDate
} from "./../utils/time";
import IntervalLabel, { IntervalType } from "./IntervalLabel";
import CancelImage from "./../img/cancel.svg";
import SkipImage from "./../img/skip.svg";
import { set, get } from "idb-keyval";
import { Intervals } from "./../Config";

interface State {
  completedIntervals: number;
  timeLeftInCurrentInterval: number;
  intervalPaused: boolean;
  currentIntervalType: IntervalType;
  currentInterval?: number;
}

interface Props {}

class Timer extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      completedIntervals: 0,
      timeLeftInCurrentInterval: Intervals.work_session,
      currentIntervalType: "workSession",
      intervalPaused: false
    };
  }

  componentWillMount() {
    get(getFormattedCurrentDate()).then(val => {
      if (val && typeof val == "number") {
        this.setState({
          completedIntervals: val
        });
      }
    });

    document.addEventListener("keydown", this.onKeyEvent.bind(this));
  }

  onKeyEvent(event: KeyboardEvent) {
    switch (event.keyCode) {
      case 27: // Escape
        this.resetInterval();
        break;
      case 39: // Right arrow
        this.wrapUpInterval();
        break;
      case 13: // Enter
        this.onTimerToggle();
        break;
    }
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
            className="timer__button--small"
            onClick={this.resetInterval.bind(this)}
            src={CancelImage}
            alt="Cancel Interval"
          />
          <TimerButton
            isRunning={!!this.state.currentInterval}
            onClick={this.onTimerToggle.bind(this)}
          />
          <img
            className="timer__button--small"
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

  private onTimerToggle() {
    this.requestNotifications();

    if (this.state.currentInterval) {
      this.clearCurrentInterval();
    } else {
      this.setState({
        currentInterval: window.setInterval(
          this.onIntervalIncrement.bind(this, Intervals.increments),
          Intervals.increments
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
          timeLeftInCurrentInterval: Intervals.work_session
        });
        break;
      case "longBreak":
        this.setState({
          timeLeftInCurrentInterval: Intervals.long_break
        });
        break;
      case "shortBreak":
        this.setState({
          timeLeftInCurrentInterval: Intervals.short_break
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
            timeLeftInCurrentInterval: Intervals.long_break
          });
        } else {
          this.setState({
            currentIntervalType: "shortBreak",
            timeLeftInCurrentInterval: Intervals.short_break
          });
        }
        break;
      default:
        this.setState({
          currentIntervalType: "workSession",
          timeLeftInCurrentInterval: Intervals.work_session
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
