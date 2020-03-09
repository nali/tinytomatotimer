import React, { Component } from "react";
import "./Timer.css";
import tinyTomatoTimerLogo from "./../img/tinyTomatoTimerLogo.svg";
import TimerButton from "./TimerButton";
import ProgressBar from "./ProgressBar";
import { convertMillisecondsToReadableTime } from "./../utils/time";
import IntervalLabel from "./IntervalLabel";
import CancelImage from "./../img/cancel.svg";
import SkipImage from "./../img/skip.svg";
import Pomodoro, { CurrentInterval } from "../models/Pomodoro";

interface State {
  currentInterval?: CurrentInterval;
  intervalCount: number;
  paused: boolean;
}

interface Props {}

class Timer extends Component<Props, State> {
  pomodoro: Pomodoro;

  constructor(props: Props) {
    super(props);
    this.pomodoro = new Pomodoro(this.onUpdate.bind(this));
    this.state = {
      paused: this.pomodoro.state.paused,
      intervalCount: this.pomodoro.state.intervalCount,
      currentInterval: this.pomodoro.state.currentInterval
    };
  }

  componentWillMount() {
    document.addEventListener("keydown", this.onKeyEvent.bind(this));
  }

  onKeyEvent(event: KeyboardEvent) {
    switch (event.keyCode) {
      case 27: // Escape
        this.onReset();
        break;
      case 39: // Right arrow
        this.onSkip();
        break;
      case 13: // Enter
        this.onToggle();
        break;
    }
  }

  onUpdate(currentInterval: CurrentInterval, intervalCount: number) {
    this.setState({
      currentInterval: currentInterval,
      intervalCount: intervalCount
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
            className="timer__button--small"
            onClick={this.onReset.bind(this)}
            src={CancelImage}
            alt="Reset Interval"
          />
          <TimerButton
            isRunning={
              (this.state.currentInterval &&
                !this.state.currentInterval.paused) ||
              false
            }
            onClick={this.onToggle.bind(this)}
          />
          <img
            className="timer__button--small"
            src={SkipImage}
            alt="Skip Interval"
            onClick={this.onSkip.bind(this)}
          />
        </div>
        <div>
          <p className="timer__clock">
            {convertMillisecondsToReadableTime(
              (this.state.currentInterval &&
                this.state.currentInterval.timeLeft) ||
                0
            )}
          </p>
          <IntervalLabel
            intervalType={
              this.state.currentInterval && this.state.currentInterval.type
            }
          />
        </div>
        <ProgressBar completedIntervals={this.state.intervalCount} />
      </div>
    );
  }

  private onToggle() {
    this.pomodoro.toggle();
  }

  private onReset() {
    this.pomodoro.reset();
  }

  private onSkip() {
    this.pomodoro.finish();
  }
}

export default Timer;
