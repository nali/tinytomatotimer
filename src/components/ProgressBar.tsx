import React from "react";
import "./ProgressBar.css";

interface Props {
  completedIntervals: number;
}

function ProgressBar(props: Props) {
  const progressPoints = Array.from(Array(8).keys()).map(idx => {
    let className = "timer__progressbar__dot";
    if (idx < props.completedIntervals) {
      className += " timer__progressbar__dot--filled";
    }
    return <div key={idx} className={className} />;
  });

  return <div className="timer__progressbar">{progressPoints}</div>;
}

export default ProgressBar;
