import React from 'react';
import { Link } from 'react-router-dom';
import './BrandMark.css';

const LogoSVG = () => (
  <svg viewBox="0 0 64 64" fill="none" className="brand-mark__svg" role="presentation" focusable="false">
    <defs>
      <linearGradient id="bmPinGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#ff7a59"/>
        <stop offset="100%" stopColor="#ef233c"/>
      </linearGradient>
      <linearGradient id="bmWaveGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#ff7a59" stopOpacity="0.6"/>
        <stop offset="100%" stopColor="#ef233c" stopOpacity="0.3"/>
      </linearGradient>
    </defs>
    <path d="M16.5 18.5a18 18 0 0 1 6.2-6.2" stroke="url(#bmWaveGrad)" strokeWidth="2" strokeLinecap="round" fill="none" opacity="0.5"/>
    <path d="M12 22a24 24 0 0 1 10-10" stroke="url(#bmWaveGrad)" strokeWidth="2" strokeLinecap="round" fill="none" opacity="0.35"/>
    <path d="M47.5 18.5a18 18 0 0 0-6.2-6.2" stroke="url(#bmWaveGrad)" strokeWidth="2" strokeLinecap="round" fill="none" opacity="0.5"/>
    <path d="M52 22a24 24 0 0 0-10-10" stroke="url(#bmWaveGrad)" strokeWidth="2" strokeLinecap="round" fill="none" opacity="0.35"/>
    <path d="M32 6C23.2 6 16 13.2 16 22c0 10.5 14.4 30.8 15.6 32.4a.5.5 0 0 0 .8 0C33.6 52.8 48 32.5 48 22 48 13.2 40.8 6 32 6Z" fill="url(#bmPinGrad)"/>
    <circle cx="32" cy="21" r="7" fill="#fff" opacity="0.95"/>
    <circle cx="32" cy="21" r="2.5" fill="url(#bmPinGrad)" opacity="0.9"/>
  </svg>
);

const BrandMark = ({ linked = true, size = 'md', tone = 'dark', showTagline = false }) => {
  const content = (
    <>
      <span className="brand-mark__icon" aria-hidden="true">
        <LogoSVG />
      </span>
      <span className="brand-mark__copy">
        <span className="brand-mark__text">SOS ko po</span>
        {showTagline && <span className="brand-mark__tagline">Emergency response system</span>}
      </span>
    </>
  );

  const className = `brand-mark brand-mark--${size} brand-mark--${tone}`;

  if (linked) {
    return <Link to="/" className={className}>{content}</Link>;
  }

  return <div className={className}>{content}</div>;
};

export default BrandMark;
