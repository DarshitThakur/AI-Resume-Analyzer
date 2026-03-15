import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import ResultsDashboard from './pages/ResultsDashboard';
import './index.css';

function App() {
  return (
    <Router>
      <div className="app-container">
        <header className="app-header">
          <div className="logo-container">
            <h1 className="logo-text">Smart<span className="accent">Hire</span></h1>
            <p className="tagline">AI Resume Analyzer & Job Matcher</p>
          </div>
        </header>

        <main className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/results" element={<ResultsDashboard />} />
          </Routes>
        </main>
        
        <footer className="app-footer">
          <p>© {new Date().getFullYear()} SmartHire. Built for seamless recruiting.</p>
        </footer>
      </div>
    </Router>
  );
}

export default App;
