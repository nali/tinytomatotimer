import React from "react";
import "./ProgressBar.css";

interface Props {
  completedIntervals: number;
}

function ProgressBar(props: Props) {
  const progressPoints = Array.from(Array(8).keys()).map(idx => (
    <div key={idx} className="timer__progressbar__dot" />
  ));

  return <div className="timer__progressbar">{progressPoints}</div>;
}

export default ProgressBar;
