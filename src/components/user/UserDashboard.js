import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import API_URL from '../../config/api';
import './UserDashboard.css';

const UserDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState('home');
  const [location, setLocation] = useState({ lat: null, lon: null });
  const [address, setAddress] = useState('Fetching location...');
  const [sosMessage, setSosMessage] = useState('');

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
          setLocation(newLocation);
          setAddress(`${newLocation.lat.toFixed(6)}, ${newLocation.lon.toFixed(6)}`);
        },
        () => {
          setAddress('Unable to get location.');
        }
      );
    }
  };

  const sendSOS = () => {
    if (location.lat && location.lon) {
      const sosData = {
        user_id: user.fullName,
        lat: location.lat,
        lon: location.lon
      };

      fetch(`${API_URL}/sos`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(sosData)
      })
        .then(response => response.json())
        .then(data => {
          console.log('SOS sent successfully:', data);
          setSosMessage('Help is on the way! Your emergency location has been sent.');
          setCurrentPage('map');
        })
        .catch(error => {
          console.error('Error sending SOS:', error);
          alert('Failed to send SOS. Please try again.');
        });
    } else {
      alert('Unable to get location. Try again.');
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="user-dashboard">
      <div className="header">
        <img src="/team-logo.png" alt="Team Logo" />
        <div className="header-text">Panic Pin Emergency System</div>
      </div>

      {currentPage === 'home' && (
        <div className="container">
          <div className="sos-section">
            <h2><strong>Are you in emergency?</strong></h2>
            <p>Press the button below, help will reach you soon.</p>
            <div className="sos-btn" onClick={sendSOS}>SOS</div>
          </div>
          <div className="address">
            <p><strong>Your current address</strong></p>
            <p>{address}</p>
          </div>
        </div>
      )}

      {currentPage === 'map' && (
        <div className="container">
          {sosMessage && <p className="sos-message">{sosMessage}</p>}
          <iframe
            className="map-frame"
            width="100%"
            height="450px"
            style={{ border: 0 }}
            src={`https://maps.google.com/maps?q=${location.lat},${location.lon}&z=15&output=embed`}
            title="Location Map"
          ></iframe>
        </div>
      )}

      {currentPage === 'profile' && (
        <div className="container">
          <div className="profile-header">
            <h2>User Profile</h2>
          </div>

          <div className="profile-img-section">
            <div className="profile-avatar">
              <i className="fa fa-user"></i>
            </div>
          </div>

          <div className="personal-info">
            <h3>Personal Information</h3>
            <p><strong>Name:</strong> {user.fullName}</p>
            <p><strong>Contact:</strong> {user.contact}</p>
            <p><strong>Member Since:</strong> {new Date(user.createdAt).toLocaleDateString()}</p>
          </div>

          <button onClick={handleLogout} className="logout-btn">
            <i className="fa fa-sign-out-alt"></i> Logout
          </button>
        </div>
      )}

      <div className="navbar">
        <a href="#home" onClick={() => setCurrentPage('home')} className={currentPage === 'home' ? 'active' : ''}>
          <i className="fa fa-home"></i> Home
        </a>
        <a href="#map" onClick={() => setCurrentPage('map')} className={currentPage === 'map' ? 'active' : ''}>
          <i className="fa fa-map"></i> Map
        </a>
        <a href="#profile" onClick={() => setCurrentPage('profile')} className={currentPage === 'profile' ? 'active' : ''}>
          <i className="fa fa-user"></i> Profile
        </a>
      </div>
    </div>
  );
};

export default UserDashboard;
