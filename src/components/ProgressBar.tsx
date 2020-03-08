import React from "react";
import "./ProgressBar.css";
import { Intervals } from "./../config";

interface Props {
  completedIntervals: number;
}

function ProgressBar(props: Props) {
  const progressPoints = Array.from(Array(Intervals.quantity).keys()).map(
    idx => {
      let className = "timer__progressbar__dot";
      if (idx < props.completedIntervals) {
        className += " timer__progressbar__dot--filled";
      }
      return <div key={idx} className={className} />;
    }
  );

  return <div className="timer__progressbar">{progressPoints}</div>;
}

export default ProgressBar;
