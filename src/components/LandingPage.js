import React from 'react';
import { Link } from 'react-router-dom';
import './LandingPage.css';

const LandingPage = () => {
  return (
    <div className="landing-page">
      <div className="landing-header">
        <img src="/team-logo.png" alt="Team Logo" className="logo" />
        <h1>Panic Pin</h1>
        <p className="tagline">Emergency SOS System</p>
      </div>

      <div className="landing-content">
        <div className="card-container">
          <div className="auth-card">
            <div className="card-icon user-icon">
              <i className="fa fa-user"></i>
            </div>
            <h2>User Portal</h2>
            <p>Access emergency services and send SOS alerts</p>
            <div className="button-group">
              <Link to="/user/login" className="btn btn-primary">Login</Link>
              <Link to="/user/register" className="btn btn-secondary">Register</Link>
            </div>
          </div>

          <div className="auth-card">
            <div className="card-icon authority-icon">
              <i className="fa fa-shield-alt"></i>
            </div>
            <h2>Authority Portal</h2>
            <p>Monitor and respond to emergency alerts</p>
            <div className="button-group">
              <Link to="/authority/login" className="btn btn-primary">Login</Link>
              <Link to="/authority/register" className="btn btn-secondary">Register</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
