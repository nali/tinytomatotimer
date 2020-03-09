import React from "react";
import "./ProgressBar.css";
import { MAX_INTERVALS } from "./../models/Pomodoro";

interface Props {
  completedIntervals: number;
}

function ProgressBar(props: Props) {
  const progressPoints = Array.from(Array(MAX_INTERVALS).keys()).map(idx => {
    let className = "timer__progressbar__dot";
    if (idx < props.completedIntervals) {
      className += " timer__progressbar__dot--filled";
    }
    return <div key={idx} className={className} />;
  });

  return <div className="timer__progressbar">{progressPoints}</div>;
}

export default ProgressBar;
