import React from 'react';
import { useLocation, useNavigate, Navigate } from 'react-router-dom';
import SkillMatchProgress from '../components/SkillMatchProgress';
import { FiCheckCircle, FiXCircle, FiArrowLeft } from 'react-icons/fi';

const ResultsDashboard = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const matchResult = location.state?.matchResult;

  if (!matchResult) {
    return <Navigate to="/" replace />;
  }

  const { matchScore, matchedSkills, missingSkills, strengths = [], weaknesses = [], recommendations = [] } = matchResult;

  return (
    <div className="dashboard-container transform-enter">
      <div className="dashboard-header">
        <button className="back-btn" onClick={() => navigate('/')}>
          <FiArrowLeft /> Back to setup
        </button>
        <h2>AI Analysis Results</h2>
        <p className="subtitle">Detailed semantic analysis by Gemini</p>
      </div>

      <div className="dashboard-grid">
        <div className="dashboard-card score-card">
          <SkillMatchProgress score={matchScore} />
          <div className="score-tips">
            {matchScore >= 80 ? (
              <p className="tip success">Excellent match! You are highly qualified for this role.</p>
            ) : matchScore >= 50 ? (
              <p className="tip warning">Good match, but consider the AI feedback below.</p>
            ) : (
              <p className="tip danger">Low match score. Tailor your resume based on the recommendations.</p>
            )}
          </div>
        </div>

        <div className="dashboard-card details-card">
          <div className="skills-section matched">
            <h3 className="section-heading">
              <FiCheckCircle className="icon green" /> 
              Matched Skills & Concepts ({matchedSkills.length})
            </h3>
            <div className="skills-tags">
              {matchedSkills.length > 0 ? (
                matchedSkills.map(skill => <span key={skill} className="tag green">{skill}</span>)
              ) : (
                <p className="empty-text">No matching skills found.</p>
              )}
            </div>
          </div>

          <div className="skills-section missing">
            <h3 className="section-heading">
              <FiXCircle className="icon red" /> 
              Missing Requirements ({missingSkills.length})
            </h3>
            <div className="skills-tags">
              {missingSkills.length > 0 ? (
                missingSkills.map(skill => <span key={skill} className="tag red">{skill}</span>)
              ) : (
                <p className="empty-text clear">You have all the required skills!</p>
              )}
            </div>
          </div>
          
          {strengths.length > 0 && (
            <div className="improvement-tips" style={{ marginTop: '20px', borderLeft: '4px solid #28a745', paddingLeft: '15px' }}>
              <h4 style={{ color: '#28a745' }}>🌟 Candidate Strengths:</h4>
              <ul style={{ listStyleType: 'disc', paddingLeft: '20px' }}>
                {strengths.map((str, i) => <li key={i}>{str}</li>)}
              </ul>
            </div>
          )}

          {weaknesses.length > 0 && (
            <div className="improvement-tips" style={{ marginTop: '20px', borderLeft: '4px solid #dc3545', paddingLeft: '15px' }}>
              <h4 style={{ color: '#dc3545' }}>⚠️ Areas of Concern:</h4>
              <ul style={{ listStyleType: 'disc', paddingLeft: '20px' }}>
                {weaknesses.map((weak, i) => <li key={i}>{weak}</li>)}
              </ul>
            </div>
          )}

          {recommendations.length > 0 && (
            <div className="improvement-tips" style={{ marginTop: '20px', borderLeft: '4px solid #007bff', paddingLeft: '15px' }}>
              <h4 style={{ color: '#007bff' }}>💡 AI Recommendations:</h4>
              <ul style={{ listStyleType: 'disc', paddingLeft: '20px' }}>
                {recommendations.map((rec, i) => <li key={i}>{rec}</li>)}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ResultsDashboard;
