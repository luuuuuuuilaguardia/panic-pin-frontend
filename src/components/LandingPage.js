import React from 'react';
import { Link } from 'react-router-dom';
import './LandingPage.css';

const LandingPage = () => {
  return (
    <div className="landing">
      <nav className="landing-nav">
        <div className="landing-brand">
          <div className="brand-icon">!</div>
          <span className="brand-name">Panic Pin</span>
        </div>
      </nav>

      <main className="landing-main">
        <h1 className="landing-title">
          Your emergency alert system.
        </h1>
        <p className="landing-sub">
          Send an SOS when you need help. Authorities receive it instantly.
        </p>

        <div className="landing-cards">
          <div className="portal-card">
            <div className="portal-top">
              <h3>I need help</h3>
              <p>Send SOS alerts and reach emergency services quickly.</p>
            </div>
            <div className="portal-actions">
              <Link to="/user/login" className="btn-primary">Log in</Link>
              <Link to="/user/register" className="btn-link">Create account</Link>
            </div>
          </div>

          <div className="portal-card portal-card--alt">
            <div className="portal-top">
              <h3>I'm an authority</h3>
              <p>Monitor alerts and respond to emergencies in real time.</p>
            </div>
            <div className="portal-actions">
              <Link to="/authority/login" className="btn-primary btn-primary--red">Log in</Link>
              <Link to="/authority/register" className="btn-link">Create account</Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default LandingPage;
