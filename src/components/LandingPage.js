import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import BrandMark from './BrandMark';
import './LandingPage.css';

const steps = [
  {
    num: '01',
    title: 'Tap SOS',
    text: 'One button on your phone when something feels wrong.',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
        <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
      </svg>
    ),
  },
  {
    num: '02',
    title: 'Share location',
    text: 'Your coordinates go out immediately — no typing required.',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
        <circle cx="12" cy="10" r="3"/>
      </svg>
    ),
  },
  {
    num: '03',
    title: 'Get a response',
    text: 'Nearby authorities see the alert and can act on it.',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
      </svg>
    ),
  },
];

const LandingPage = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [visibleSections, setVisibleSections] = useState(new Set());
  const sectionRefs = useRef([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisibleSections((prev) => new Set([...prev, entry.target.id]));
          }
        });
      },
      { threshold: 0.15, rootMargin: '0px 0px -60px 0px' }
    );

    sectionRefs.current.forEach((ref) => {
      if (ref) observer.observe(ref);
    });

    return () => observer.disconnect();
  }, []);

  const isVisible = (id) => visibleSections.has(id);

  return (
    <div className="landing">
      <header className="landing__header">
        <BrandMark showTagline />

        {/* Mobile hamburger */}
        <button
          className={`landing__hamburger ${menuOpen ? 'is-open' : ''}`}
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle navigation menu"
          aria-expanded={menuOpen}
        >
          <span />
          <span />
          <span />
        </button>

        {/* Desktop nav */}
        <nav className="landing__nav-desktop">
          <Link to="/login" className="landing__sign-in">Sign in</Link>
          <Link to="/user/register" className="landing__nav-cta">Get started</Link>
        </nav>

        {/* Mobile drawer */}
        <div className={`landing__drawer ${menuOpen ? 'is-open' : ''}`}>
          <nav className="landing__drawer-nav">
            <Link to="/login" onClick={() => setMenuOpen(false)}>Sign in</Link>
            <Link to="/user/register" onClick={() => setMenuOpen(false)}>Create account</Link>
            <Link to="/authority/register" onClick={() => setMenuOpen(false)}>Authority registration</Link>
          </nav>
        </div>
        {menuOpen && <div className="landing__overlay" onClick={() => setMenuOpen(false)} />}
      </header>

      <main>
        <section
          className={`landing__hero ${isVisible('hero') ? 'is-visible' : ''}`}
          id="hero"
          ref={(el) => (sectionRefs.current[0] = el)}
        >
          <div className="landing__hero-copy">
            <p className="landing__eyebrow">Emergency alerts, simplified</p>
            <h1 className="landing__headline">
              Help should be<br />one tap away.
            </h1>
            <p className="landing__lede">
              SOS ko po connects people in distress with local authorities
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
              <div className="landing__device-notch" />
              <div className="landing__device-screen">
                <span className="landing__device-status">
                  <span className="landing__device-dot" />
                  Ready
                </span>
                <button type="button" className="landing__sos-demo" tabIndex={-1}>
                  SOS
                </button>
                <span className="landing__device-hint">Hold to send alert</span>
              </div>
            </div>
          </div>
        </section>

        <section
          className={`landing__steps ${isVisible('steps') ? 'is-visible' : ''}`}
          id="steps"
          ref={(el) => (sectionRefs.current[1] = el)}
        >
          <h2 className="landing__section-title">How it works</h2>
          <ol className="landing__step-list">
            {steps.map((step, i) => (
              <li
                key={step.num}
                className="landing__step"
                style={{ transitionDelay: `${i * 0.1}s` }}
              >
                <div className="landing__step-icon">{step.icon}</div>
                <span className="landing__step-num">{step.num}</span>
                <div>
                  <h3>{step.title}</h3>
                  <p>{step.text}</p>
                </div>
              </li>
            ))}
          </ol>
        </section>

        <section
          className={`landing__paths ${isVisible('paths') ? 'is-visible' : ''}`}
          id="paths"
          ref={(el) => (sectionRefs.current[2] = el)}
        >
          <article className="landing__path">
            <div className="landing__path-icon">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                <circle cx="12" cy="7" r="4"/>
              </svg>
            </div>
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
            <div className="landing__path-icon">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
              </svg>
            </div>
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
