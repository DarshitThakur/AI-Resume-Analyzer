import React from 'react';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';

const SkillMatchProgress = ({ score }) => {
  let pathColor = '#10b981'; // green for high
  if (score < 50) pathColor = '#ef4444'; // red for low
  else if (score < 75) pathColor = '#f59e0b'; // yellow for medium

  return (
    <div className="progress-container">
      <div className="progress-wrapper">
        <CircularProgressbar
          value={score}
          text={`${score}%`}
          styles={buildStyles({
            pathColor: pathColor,
            textColor: '#f8fafc',
            trailColor: 'rgba(255,255,255,0.1)',
            pathTransitionDuration: 1.5,
          })}
        />
      </div>
      <h3 className="score-label">Match Score</h3>
    </div>
  );
};

export default SkillMatchProgress;
