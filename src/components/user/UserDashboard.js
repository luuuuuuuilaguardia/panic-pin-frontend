import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import BrandMark from '../BrandMark';
import API_URL from '../../config/api';
import './UserDashboard.css';

const UserDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [location, setLocation] = useState({ lat: null, lon: null });
  const [locationLabel, setLocationLabel] = useState('Fetching location...');
  const [locationAccuracy, setLocationAccuracy] = useState(null);
  const [sending, setSending] = useState(false);
  const [latestAlert, setLatestAlert] = useState(null);
  const [sosMessage, setSosMessage] = useState('');
  const [activeSection, setActiveSection] = useState('overview');
  
  const overviewRef = useRef(null);
  const mapRef = useRef(null);
  const profileRef = useRef(null);

  useEffect(() => {
    getLocation();
  }, []);

  const getLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const newLocation = {
            lat: position.coords.latitude,
            lon: position.coords.longitude
          };
          const accuracy = position.coords.accuracy ? Math.round(position.coords.accuracy) : null;
          setLocation(newLocation);
          setLocationAccuracy(accuracy);
          setLocationLabel(`${newLocation.lat.toFixed(6)}, ${newLocation.lon.toFixed(6)}`);
        },
        () => {
          setLocationLabel('Unable to get location.');
        }
      , { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 });
    }
  };

  const sendSOS = async () => {
    if (location.lat && location.lon) {
      setSending(true);
      setSosMessage('');
      const sosData = {
        user_id: user.fullName,
        lat: location.lat,
        lon: location.lon,
        accuracy: locationAccuracy
      };

      try {
        const response = await fetch(`${API_URL}/sos`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(sosData)
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || 'Failed to send SOS');
        }

        setLatestAlert(data.data);
        setSosMessage('Help is on the way. Your SOS has been sent and logged with a location snapshot.');
        setTimeout(() => setSosMessage(''), 5000); // Clear message after 5 seconds
      } catch (error) {
        console.error('Error sending SOS:', error);
        setSosMessage('Failed to send SOS. Please try again.');
      } finally {
        setSending(false);
      }
    } else {
      setSosMessage('Unable to get location. Try again.');
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const navigateToSection = (section) => {
    setActiveSection(section);
    const targetMap = {
      overview: overviewRef,
      map: mapRef,
      profile: profileRef,
    };
    targetMap[section]?.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  // Helper to get initials
  const getInitials = (name) => {
    return name ? name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() : 'U';
  };

  return (
    <div className="dashboard-layout">
      {/* Top Header */}
      <header className="dashboard-header">
        <BrandMark size="md" tone="dark" />
        
        <div className="dashboard-header__right">
          <span className={`dashboard-status ${location.lat ? 'dashboard-status--ready' : ''}`}>
            {location.lat ? (
              <><span className="dashboard-status__dot"></span>GPS ready</>
            ) : 'Waiting for GPS'}
          </span>
          <button onClick={handleLogout} className="dashboard-logout" aria-label="Logout">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
              <polyline points="16 17 21 12 16 7"/>
              <line x1="21" y1="12" x2="9" y2="12"/>
            </svg>
            <span className="dashboard-logout__text">Logout</span>
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="dashboard-main">
        {/* Mobile Navigation (Bottom Bar) */}
        <nav className="dashboard-mobile-nav">
          <button 
            className={`dashboard-mobile-nav__btn ${activeSection === 'overview' ? 'is-active' : ''}`}
            onClick={() => navigateToSection('overview')}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
            <span>Home</span>
          </button>
          <button 
            className={`dashboard-mobile-nav__btn ${activeSection === 'map' ? 'is-active' : ''}`}
            onClick={() => navigateToSection('map')}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
            <span>Map</span>
          </button>
          <button 
            className={`dashboard-mobile-nav__btn ${activeSection === 'profile' ? 'is-active' : ''}`}
            onClick={() => navigateToSection('profile')}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
            <span>Profile</span>
          </button>
        </nav>

        {/* Desktop Navigation */}
        <nav className="dashboard-desktop-nav" aria-label="Dashboard navigation">
          {['overview', 'map', 'profile'].map((section) => (
            <button
              key={section}
              type="button"
              className={`dashboard-desktop-nav__link ${activeSection === section ? 'is-active' : ''}`}
              onClick={() => navigateToSection(section)}
            >
              {section}
            </button>
          ))}
        </nav>

        {/* Sections */}
        <div className="dashboard-content-grid">
          
          {/* Overview Section */}
          <section className="dashboard-section dashboard-hero" ref={overviewRef} id="overview">
            <div className="dashboard-hero__copy">
              <p className="dashboard-hero__eyebrow">Personal safety console</p>
              <h1>One tap sends your live location.</h1>
              <p>
                SOS ko po stores a structured location snapshot so authorities can respond faster and see the nearest mapped area.
              </p>
              
              <div className="dashboard-hero__actions">
                <div className="sos-button-wrapper">
                  <button
                    onClick={sendSOS}
                    className="sos-btn"
                    disabled={sending || !location.lat || !location.lon}
                    aria-label="Send SOS Alert"
                  >
                    {sending ? 'Sending…' : 'SOS'}
                  </button>
                  <div className="sos-btn__pulse" />
                </div>
                
                <div className="dashboard-hero__location-pill">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                  {locationLabel}
                </div>
              </div>

              {/* Toast-style inline message */}
              {sosMessage && (
                <div className={`dashboard-toast ${sosMessage.includes('Failed') || sosMessage.includes('Unable') ? 'dashboard-toast--error' : 'dashboard-toast--success'}`} role="alert">
                  {sosMessage}
                </div>
              )}
            </div>

            <div className="dashboard-hero__stats">
              <article className="dashboard-stat-card">
                <div className="dashboard-stat-card__icon">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>
                </div>
                <div>
                  <span>Current coordinates</span>
                  <strong>{locationLabel}</strong>
                  <p>{locationAccuracy ? `Accuracy approx. ±${locationAccuracy}m` : 'Accuracy is being captured now.'}</p>
                </div>
              </article>
              <article className="dashboard-stat-card">
                <div className="dashboard-stat-card__icon">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                </div>
                <div>
                  <span>Account</span>
                  <strong>{user.fullName}</strong>
                  <p>{user.contact}</p>
                </div>
              </article>
              <article className="dashboard-stat-card">
                <div className="dashboard-stat-card__icon">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
                </div>
                <div>
                  <span>Member since</span>
                  <strong>{user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'Today'}</strong>
                  <p>Ready for immediate response.</p>
                </div>
              </article>
            </div>
          </section>

          {/* Map and Profile Grid */}
          <div className="dashboard-split-grid">
            
            {/* Map Section */}
            <article className="dashboard-panel" ref={mapRef} id="map">
              <div className="dashboard-panel__head">
                <h2>Live map preview</h2>
                <span className="dashboard-badge">Auto-updated</span>
              </div>
              {location.lat && location.lon ? (
                <div className="dashboard-panel__map-wrap">
                  <iframe
                    className="map-frame"
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    src={`https://maps.google.com/maps?q=${location.lat},${location.lon}&z=15&output=embed`}
                    title="Location Map"
                  ></iframe>
                </div>
              ) : (
                <div className="dashboard-panel__empty">
                  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"><polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6"/><line x1="8" y1="2" x2="8" y2="18"/><line x1="16" y1="6" x2="16" y2="22"/></svg>
                  <p>Waiting for location permission.</p>
                </div>
              )}
            </article>

            {/* Profile Section */}
            <article className="dashboard-panel dashboard-panel--profile" ref={profileRef} id="profile">
              <div className="dashboard-panel__head">
                <h2>Profile</h2>
                <span className="dashboard-badge dashboard-badge--verified">Verified</span>
              </div>
              
              <div className="profile-header">
                <div className="profile-avatar">{getInitials(user.fullName)}</div>
                <div className="profile-name">
                  <h3>{user.fullName}</h3>
                  <p>{user.contact}</p>
                </div>
              </div>

              <div className="profile-details">
                <div className="profile-detail-item">
                  <span>Latest SOS</span>
                  <strong>{latestAlert ? latestAlert.location : 'None yet'}</strong>
                </div>
                {latestAlert && (
                  <div className="profile-detail-item profile-detail-item--highlight">
                    <span>Stored location snapshot</span>
                    <strong>{latestAlert.locationSnapshot?.label || latestAlert.location}</strong>
                    <p>{latestAlert.locationSnapshot?.referencePoint || 'Resolved by GPS and location catalog.'}</p>
                  </div>
                )}
              </div>
            </article>
            
          </div>
        </div>
      </main>
    </div>
  );
};

export default UserDashboard;
