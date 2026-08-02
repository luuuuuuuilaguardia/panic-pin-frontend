import React, { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import BrandMark from '../BrandMark';
import API_URL from '../../config/api';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import './AuthorityDashboard.css';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const MapUpdater = ({ sosList }) => {
  const map = useMap();
  
  useEffect(() => {
    if (sosList.length > 0) {
      if (sosList.length === 1) {
        map.setView([sosList[0].lat, sosList[0].lon], 16);
      } else {
        const bounds = sosList.map(sos => [sos.lat, sos.lon]);
        map.fitBounds(bounds, { padding: [50, 50] });
      }
    }
  }, [sosList, map]);

  return null;
};

const AuthorityDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [sosList, setSosList] = useState([]);
  const [analytics, setAnalytics] = useState({
    responsesThisMonth: 0,
    averageResponseTime: 0,
    falseAlertsToday: 0,
    resolvedAlertsToday: 0,
    mostReportedLocations: []
  });
  const [activeSection, setActiveSection] = useState('overview');
  
  const overviewRef = useRef(null);
  const alertsRef = useRef(null);
  const mapRef = useRef(null);
  const locationsRef = useRef(null);

  useEffect(() => {
    fetchDashboard();
    const dashboardInterval = setInterval(fetchDashboard, 10000);
    return () => clearInterval(dashboardInterval);
  }, []);

  const fetchDashboard = () => {
    fetch(`${API_URL}/authority/dashboard`)
      .then(response => response.json())
      .then(data => {
        setSosList(data.alerts || []);
        setAnalytics(data.analytics || {
          responsesThisMonth: 0,
          averageResponseTime: 0,
          falseAlertsToday: 0,
          resolvedAlertsToday: 0,
          mostReportedLocations: []
        });
      })
      .catch(error => console.log('Error fetching dashboard data.', error));
  };

  const updateAlertStatus = (alertId, status, isFalseAlert = false) => {
    fetch(`${API_URL}/sos/${alertId}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status, isFalseAlert })
    })
      .then(response => response.json())
      .then(() => fetchDashboard())
      .catch(error => console.error('Error updating alert status:', error));
  };

  const formatTime = (timestamp) => {
    const now = new Date();
    const alertTime = new Date(timestamp);
    const diffMs = now - alertTime;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    
    if (diffHours > 0) return `${diffHours}h ${diffMins % 60}m ago`;
    return `${diffMins}m ago`;
  };

  const formatResponseTime = (seconds) => {
    if (!seconds) return '00:00:00';
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);
    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const navigateToSection = (section) => {
    setActiveSection(section);
    const targetMap = {
      overview: overviewRef,
      alerts: alertsRef,
      map: mapRef,
      locations: locationsRef,
    };
    targetMap[section]?.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const activeAlertsCount = sosList.filter(a => a.status !== 'resolved').length;

  return (
    <div className="dashboard-layout">
      {/* Top Header */}
      <header className="dashboard-header">
        <BrandMark size="md" tone="dark" />
        <div className="dashboard-header__right">
          <span className="dashboard-status dashboard-status--authority">
            Authority Console
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
      <main className="dashboard-main dashboard-main--authority">
        {/* Mobile Navigation (Bottom Bar) */}
        <nav className="dashboard-mobile-nav">
          <button 
            className={`dashboard-mobile-nav__btn ${activeSection === 'overview' ? 'is-active' : ''}`}
            onClick={() => navigateToSection('overview')}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>
            <span>Overview</span>
          </button>
          <button 
            className={`dashboard-mobile-nav__btn ${activeSection === 'alerts' ? 'is-active' : ''}`}
            onClick={() => navigateToSection('alerts')}
          >
            <div className="icon-with-badge">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>
              {activeAlertsCount > 0 && <span className="nav-badge">{activeAlertsCount}</span>}
            </div>
            <span>Alerts</span>
          </button>
          <button 
            className={`dashboard-mobile-nav__btn ${activeSection === 'map' ? 'is-active' : ''}`}
            onClick={() => navigateToSection('map')}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="3 6 9 3 15 6 21 3 21 18 15 21 9 18 3 21"/><line x1="9" y1="3" x2="9" y2="21"/><line x1="15" y1="3" x2="15" y2="21"/></svg>
            <span>Map</span>
          </button>
        </nav>

        {/* Desktop Navigation */}
        <nav className="dashboard-desktop-nav" aria-label="Dashboard navigation">
          {['overview', 'alerts', 'map', 'locations'].map((section) => (
            <button
              key={section}
              type="button"
              className={`dashboard-desktop-nav__link ${activeSection === section ? 'is-active' : ''}`}
              onClick={() => navigateToSection(section)}
            >
              {section}
              {section === 'alerts' && activeAlertsCount > 0 && (
                <span className="nav-badge nav-badge--desktop">{activeAlertsCount}</span>
              )}
            </button>
          ))}
        </nav>

        <div className="dashboard-content-grid">
          
          {/* Welcome / Officer Info */}
          <section className="authority-welcome" ref={overviewRef} id="overview">
            <div className="authority-welcome__content">
              <h2>Operations console</h2>
              <p>Officer {user.fullName} &middot; Tracking live emergencies</p>
            </div>
            <div className="authority-date">
              {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            </div>
          </section>

          {/* Analytics Cards */}
          <section className="authority-analytics-grid">
            <article className="dashboard-stat-card dashboard-stat-card--vertical">
              <span>Responses this month</span>
              <strong>{analytics.responsesThisMonth}</strong>
              <div className="stat-badge stat-badge--positive">Tracked live</div>
            </article>
            <article className="dashboard-stat-card dashboard-stat-card--vertical">
              <span>Avg response time</span>
              <strong>{formatResponseTime(analytics.averageResponseTime)}</strong>
              <div className="stat-badge stat-badge--neutral">Auto computed</div>
            </article>
            <article className="dashboard-stat-card dashboard-stat-card--vertical">
              <span>False alerts today</span>
              <strong>{analytics.falseAlertsToday}</strong>
            </article>
            <article className="dashboard-stat-card dashboard-stat-card--vertical">
              <span>Resolved today</span>
              <strong>{analytics.resolvedAlertsToday}</strong>
            </article>
          </section>

          {/* Main Two-Column Layout */}
          <div className="authority-main-split">
            
            {/* Left Column: Alerts Feed & Map */}
            <div className="authority-col-main">
              
              {/* Alerts Feed */}
              <section className="dashboard-panel" ref={alertsRef} id="alerts">
                <div className="dashboard-panel__head">
                  <h2>Live Alerts Feed</h2>
                  <span className="dashboard-badge dashboard-badge--alert">{activeAlertsCount} active</span>
                </div>
                
                {sosList.length > 0 ? (
                  <div className="alerts-list">
                    {sosList.map((alert, index) => {
                      const status = alert.status || 'pending';
                      const isPending = status === 'pending';
                      const isOngoing = status === 'ongoing';
                      const locationStr = alert.locationSnapshot?.label || alert.location || 'Unknown location';
                      
                      return (
                        <div key={alert.id || index} className={`alert-card alert-card--${status}`}>
                          <div className="alert-card__header">
                            <div className="alert-card__meta">
                              <span className="alert-card__num">#{String(index + 1).padStart(3, '0')}</span>
                              <span className="alert-card__time">{formatTime(alert.timestamp)}</span>
                            </div>
                            <span className={`alert-status-badge alert-status-badge--${status}`}>
                              {status.charAt(0).toUpperCase() + status.slice(1)}
                            </span>
                          </div>
                          
                          <div className="alert-card__body">
                            <div className="alert-card__info">
                              <strong>{locationStr}</strong>
                              <p>{alert.distance ? `${alert.distance.toFixed(1)} km away` : 'Distance unknown'}</p>
                            </div>
                            
                            <div className="alert-card__actions">
                              {isPending && alert.id && (
                                <button className="btn-dispatch" onClick={() => updateAlertStatus(alert.id, 'ongoing')}>
                                  Dispatch
                                </button>
                              )}
                              {isOngoing && alert.id && (
                                <button className="btn-resolve" onClick={() => updateAlertStatus(alert.id, 'resolved')}>
                                  Resolve
                                </button>
                              )}
                              {status === 'resolved' && (
                                <span className="text-resolved">Completed</span>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="dashboard-panel__empty">
                    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
                    <p>No active alerts at this time.</p>
                  </div>
                )}
              </section>

              {/* Map */}
              <section className="dashboard-panel" ref={mapRef} id="map">
                <div className="dashboard-panel__head">
                  <h2>Live Map</h2>
                  <span className="dashboard-badge">Tracking units</span>
                </div>
                <div className="dashboard-panel__map-wrap dashboard-panel__map-wrap--large">
                  <MapContainer center={[14.52, 121.05]} zoom={12} style={{ height: '100%', width: '100%' }}>
                    <TileLayer
                      attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    {sosList.map((sos, index) => (
                      <Marker key={index} position={[sos.lat, sos.lon]}>
                        <Popup>
                          <div className="map-popup">
                            <strong>{sos.user_id}</strong>
                            <span>{sos.locationSnapshot?.label || sos.location || 'Unknown'}</span>
                            <span>{sos.status || 'Pending'} &middot; {sos.distance ? `${sos.distance.toFixed(1)} km` : ''}</span>
                          </div>
                        </Popup>
                      </Marker>
                    ))}
                    <MapUpdater sosList={sosList} />
                  </MapContainer>
                </div>
              </section>
            </div>

            {/* Right Column: Locations */}
            <div className="authority-col-side">
              <section className="dashboard-panel" ref={locationsRef} id="locations">
                <div className="dashboard-panel__head">
                  <h2>Most reported</h2>
                  <span className="dashboard-badge">Monthly</span>
                </div>
                
                {analytics.mostReportedLocations.length > 0 ? (
                  <ul className="locations-list">
                    {analytics.mostReportedLocations.map((loc, index) => (
                      <li key={index} className="locations-list__item">
                        <span className="locations-list__name">{loc.location}</span>
                        <span className="locations-list__count">{loc.count}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div className="dashboard-panel__empty dashboard-panel__empty--small">
                    <p>No location data available</p>
                  </div>
                )}
              </section>
            </div>
            
          </div>
        </div>
      </main>
    </div>
  );
};

export default AuthorityDashboard;
