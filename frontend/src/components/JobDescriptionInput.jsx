import React from 'react';

const JobDescriptionInput = ({ value, onChange }) => {
  return (
    <div className="component-card job-input-section">
      <h2 className="section-title">2. Job Description</h2>
      <p className="section-subtitle">Paste the requirements below</p>
      
      <div className="input-wrapper">
        <textarea
          className="glass-input"
          placeholder="e.g. We are looking for a Senior React Developer with experience in Node.js, MongoDB..."
          value={value}
          onChange={(e) => onChange(e.target.value)}
          rows={8}
        ></textarea>
      </div>
    </div>
  );
};

export default JobDescriptionInput;
