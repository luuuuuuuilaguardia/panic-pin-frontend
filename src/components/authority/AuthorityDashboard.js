import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import API_URL from '../../config/api';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import './AuthorityDashboard.css';
import './AuthorityAnalytics.css';

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

  useEffect(() => {
    fetchSOS();
    fetchAnalytics();
    const sosInterval = setInterval(fetchSOS, 5000);
    const analyticsInterval = setInterval(fetchAnalytics, 30000);
    return () => {
      clearInterval(sosInterval);
      clearInterval(analyticsInterval);
    };
  }, []);

  const fetchSOS = () => {
    fetch(`${API_URL}/get_sos`)
      .then(response => response.json())
      .then(data => {
        setSosList(data);
      })
      .catch(error => {
        console.log('Error fetching SOS data.', error);
      });
  };

  const fetchAnalytics = () => {
    fetch(`${API_URL}/analytics/dashboard`)
      .then(response => response.json())
      .then(data => {
        setAnalytics(data);
      })
      .catch(error => {
        console.log('Error fetching analytics.', error);
      });
  };

  const updateAlertStatus = (alertId, status, isFalseAlert = false) => {
    fetch(`${API_URL}/sos/${alertId}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status, isFalseAlert })
    })
      .then(response => response.json())
      .then(() => {
        fetchSOS();
        fetchAnalytics();
      })
      .catch(error => {
        console.error('Error updating alert status:', error);
      });
  };

  const formatTime = (timestamp) => {
    const now = new Date();
    const alertTime = new Date(timestamp);
    const diffMs = now - alertTime;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    
    if (diffHours > 0) {
      return `${diffHours}h ${diffMins % 60}m ago`;
    }
    return `${diffMins}m ago`;
  };

  const formatResponseTime = (seconds) => {
    if (!seconds) return '00:00:00';
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);
    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  const getStatusColor = (status) => {
    if (!status) return '#ffc107';
    switch(status) {
      case 'pending': return '#ffc107';
      case 'ongoing': return '#2196f3';
      case 'resolved': return '#4caf50';
      default: return '#ffc107';
    }
  };

  const getStatusLabel = (status) => {
    if (!status) return 'Pending';
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const currentDate = new Date().toLocaleDateString('en-US', { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });

  return (
    <div className="authority-dashboard">
      <div className="authority-header">
        <div className="header-content">
          <div className="header-left">
            <img src="/authority.png" alt="Authority Logo" />
            <div>
              <h1>Welcome, Police!</h1>
              <p className="date-text">Today is {currentDate}</p>
            </div>
          </div>
          <div className="header-right">
            <span className="user-name"><i className="fa fa-user-shield"></i> {user.fullName}</span>
            <button onClick={handleLogout} className="logout-btn-small">
              <i className="fa fa-sign-out-alt"></i> Logout
            </button>
          </div>
        </div>
      </div>

      <div className="analytics-cards">
        <div className="stat-card">
          <h3>Responses for this month</h3>
          <div className="stat-value">{analytics.responsesThisMonth}</div>
          <div className="stat-badge positive">+15.54%</div>
        </div>
        <div className="stat-card">
          <h3>Average response time</h3>
          <div className="stat-value">{formatResponseTime(analytics.averageResponseTime)}</div>
          <div className="stat-badge positive">+15.54%</div>
        </div>
        <div className="stat-card">
          <h3>False Alerts Today</h3>
          <div className="stat-value">{analytics.falseAlertsToday}</div>
        </div>
        <div className="stat-card">
          <h3>Resolved Alerts Today</h3>
          <div className="stat-value">{analytics.resolvedAlertsToday}</div>
        </div>
      </div>

      <div className="dashboard-content">
        <div className="left-section">
          <div className="alerts-feed">
            <h2>Live Alerts Feed</h2>
            {sosList.length > 0 ? (
              <table className="alerts-table">
                <thead>
                  <tr>
                    <th>No.</th>
                    <th>Distance</th>
                    <th>Alert time</th>
                    <th>Status</th>
                    <th>Respond</th>
                  </tr>
                </thead>
                <tbody>
                  {sosList.map((alert, index) => {
                    const alertStatus = alert.status || 'pending';
                    return (
                    <tr key={alert.id || index}>
                      <td>{String(index + 1).padStart(3, '0')}</td>
                      <td>{alert.distance ? `${alert.distance.toFixed(1)} km` : 'N/A'}</td>
                      <td>{formatTime(alert.timestamp)}</td>
                      <td>
                        <span 
                          className="status-badge" 
                          style={{ backgroundColor: getStatusColor(alertStatus) }}
                        >
                          {getStatusLabel(alertStatus)}
                        </span>
                      </td>
                      <td>
                        <div className="action-buttons">
                          {alertStatus === 'pending' && alert.id && (
                            <button 
                              className="btn-dispatch"
                              onClick={() => updateAlertStatus(alert.id, 'ongoing')}
                            >
                              Dispatch
                            </button>
                          )}
                          {alertStatus === 'ongoing' && alert.id && (
                            <button 
                              className="btn-resolve"
                              onClick={() => updateAlertStatus(alert.id, 'resolved')}
                            >
                              Resolved
                            </button>
                          )}
                          {alertStatus === 'resolved' && (
                            <button className="btn-details" disabled>
                              See details
                            </button>
                          )}
                          <button className="btn-view">View details</button>
                        </div>
                      </td>
                    </tr>
                    );
                  })}
                </tbody>
              </table>
            ) : (
              <p className="no-alerts">No active alerts at this time.</p>
            )}
          </div>

          <div className="map-section">
            <h2>Live Map</h2>
            <div className="map-container">
              <MapContainer
                center={[14.52, 121.05]}
                zoom={12}
                style={{ height: '100%', width: '100%' }}
              >
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                {sosList.map((sos, index) => (
                  <Marker key={index} position={[sos.lat, sos.lon]}>
                    <Popup>
                      <strong>{sos.user_id}</strong><br />
                      Location: {sos.location || 'Unknown'}<br />
                      Status: {getStatusLabel(sos.status || 'pending')}<br />
                      Distance: {sos.distance ? `${sos.distance.toFixed(1)} km` : 'N/A'}
                    </Popup>
                  </Marker>
                ))}
                <MapUpdater sosList={sosList} />
              </MapContainer>
            </div>
          </div>
        </div>

        <div className="right-section">
          <div className="locations-widget">
            <h2>Most reported locations (Monthly)</h2>
            {analytics.mostReportedLocations.length > 0 ? (
              <table className="locations-table">
                <thead>
                  <tr>
                    <th>Location</th>
                    <th>No. Reports</th>
                  </tr>
                </thead>
                <tbody>
                  {analytics.mostReportedLocations.map((loc, index) => (
                    <tr key={index}>
                      <td>{loc.location}</td>
                      <td>{loc.count}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p className="no-data">No location data available</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthorityDashboard;
