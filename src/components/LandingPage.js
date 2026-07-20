import React from 'react';
import { Link } from 'react-router-dom';
import BrandMark from './BrandMark';
import './LandingPage.css';

const steps = [
  {
    num: '01',
    title: 'Tap SOS',
    text: 'One button on your phone when something feels wrong.',
  },
  {
    num: '02',
    title: 'Share location',
    text: 'Your coordinates go out immediately — no typing required.',
  },
  {
    num: '03',
    title: 'Get a response',
    text: 'Nearby authorities see the alert and can act on it.',
  },
];

const LandingPage = () => {
  return (
    <div className="landing">
      <header className="landing__header">
        <BrandMark />
        <Link to="/login" className="landing__sign-in">
          Sign in
        </Link>
      </header>

      <main>
        <section className="landing__hero">
          <div className="landing__hero-copy">
            <p className="landing__eyebrow">Emergency alerts, simplified</p>
            <h1 className="landing__headline">
              Help should be one tap away.
            </h1>
            <p className="landing__lede">
              Panic Pin connects people in distress with local authorities
              through a single SOS button and real-time location sharing.
            </p>
            <div className="landing__hero-actions">
              <Link to="/user/register" className="landing__btn landing__btn--primary">
                Create account
              </Link>
              <Link to="/login" className="landing__btn landing__btn--ghost">
                Sign in
              </Link>
            </div>
          </div>

          <div className="landing__hero-visual" aria-hidden="true">
            <div className="landing__device">
              <div className="landing__device-screen">
                <span className="landing__device-label">Ready</span>
                <button type="button" className="landing__sos-demo" tabIndex={-1}>
                  SOS
                </button>
                <span className="landing__device-hint">Hold to send alert</span>
              </div>
            </div>
          </div>
        </section>

        <section className="landing__steps">
          <h2 className="landing__section-title">How it works</h2>
          <ol className="landing__step-list">
            {steps.map((step) => (
              <li key={step.num} className="landing__step">
                <span className="landing__step-num">{step.num}</span>
                <div>
                  <h3>{step.title}</h3>
                  <p>{step.text}</p>
                </div>
              </li>
            ))}
          </ol>
        </section>

        <section className="landing__paths">
          <article className="landing__path">
            <h3>For individuals</h3>
            <p>
              Register with your contact number, keep the app ready, and send
              an alert when you need assistance.
            </p>
            <Link to="/user/register" className="landing__path-link">
              Get started
              <span aria-hidden="true">→</span>
            </Link>
          </article>

          <article className="landing__path landing__path--authority">
            <h3>For authorities</h3>
            <p>
              Monitor incoming SOS alerts on a live map and coordinate
              responses across your team.
            </p>
            <Link to="/authority/register" className="landing__path-link">
              Authority registration
              <span aria-hidden="true">→</span>
            </Link>
          </article>
        </section>
      </main>

      <footer className="landing__footer">
        <BrandMark linked={false} />
        <p>Built for fast response when seconds matter.</p>
      </footer>
    </div>
  );
};

export default LandingPage;
