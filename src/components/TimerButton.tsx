import React from "react";
import startTimerImage from "./../img/startTimerFilled.svg";
import pauseTimerImage from "./../img/pauseTimerFilled.svg";
import "./TimerButton.css";

interface Props {
  isRunning: boolean;
  onClick: () => void;
}

function TimerButton(props: Props) {
  return props.isRunning ? (
    <img
      className="timer__button pause"
      onClick={props.onClick}
      src={pauseTimerImage}
      alt="Pause Timer"
    />
  ) : (
    <img
      className="timer__button start"
      onClick={props.onClick}
      src={startTimerImage}
      alt="Start Timer"
    />
  );
}

export default TimerButton;
