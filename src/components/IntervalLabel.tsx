import React from "react";
import ShortBreak from "./../img/shortBreak.svg";
import LongBreak from "./../img/longBreak.svg";
import WorkSession from "./../img/workSession.svg";
import "./IntervalLabel.css";
import { IntervalType } from "./../models/Pomodoro";

interface Props {
  intervalType?: IntervalType;
}

function IntervalLabel(props: Props) {
  switch (props.intervalType) {
    case "workSession":
      return (
        <img
          className="timer__intervalLabel"
          src={WorkSession}
          alt="Work Session"
        />
      );
    case "shortBreak":
      return (
        <img
          className="timer__intervalLabel"
          src={ShortBreak}
          alt="Short Break"
        />
      );
    case "longBreak":
      return (
        <img
          className="timer__intervalLabel"
          src={LongBreak}
          alt="Long Break"
        />
      );
    default:
      return <p>Fun Times!</p>;
  }
}

export default IntervalLabel;
