import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import API_URL from '../../config/api';
import BrandMark from '../BrandMark';
import './Auth.css';

const UserRegister = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    contact: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/user/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName: formData.fullName,
          contact: formData.contact,
          password: formData.password
        })
      });

      const data = await response.json();

      if (response.ok) {
        login(data.user, 'user');
        navigate('/user/dashboard');
      } else {
        setError(data.error || 'Registration failed');
      }
    } catch (error) {
      console.error('Registration error:', error);
      setError('Unable to connect to server. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <aside className="auth-page__aside">
        <BrandMark size="lg" tone="light" showTagline />
        <div className="auth-page__aside-body">
          <div className="auth-page__aside-decoration" aria-hidden="true">
            <div className="auth-page__aside-circle auth-page__aside-circle--1" />
            <div className="auth-page__aside-circle auth-page__aside-circle--2" />
          </div>
          <h1>Your safety, in your hands.</h1>
          <p>
            Create an individual account to access emergency assistance with a single tap. 
            Connects you directly to authorities in your area.
          </p>
        </div>
        <Link to="/" className="auth-page__back">
          ← Back to home
        </Link>
      </aside>

      <div className="auth-page__main">
        <div className="auth-page__form-wrap">
          <div className="auth-page__header">
            <h2>Create account</h2>
            <p>Sign up for personal emergency services</p>
          </div>

          {error && (
            <div className="auth-page__error" role="alert">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"/>
                <line x1="15" y1="9" x2="9" y2="15"/>
                <line x1="9" y1="9" x2="15" y2="15"/>
              </svg>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="auth-page__form">
            <div className="auth-page__field">
              <label htmlFor="fullName">Full name</label>
              <input
                type="text"
                id="fullName"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                placeholder="Juan Dela Cruz"
                required
                disabled={loading}
              />
            </div>

            <div className="auth-page__field">
              <label htmlFor="contact">Contact number</label>
              <input
                type="text"
                id="contact"
                name="contact"
                value={formData.contact}
                onChange={handleChange}
                placeholder="09xxxxxxxxx"
                autoComplete="tel"
                required
                disabled={loading}
              />
            </div>

            <div className="auth-page__field-group">
              <div className="auth-page__field">
                <label htmlFor="password">Password</label>
                <div className="auth-page__password-wrap">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="At least 6 chars"
                    required
                    disabled={loading}
                  />
                  <button
                    type="button"
                    className="auth-page__eye"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                    tabIndex={-1}
                  >
                    {showPassword ? (
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/>
                        <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/>
                        <line x1="1" y1="1" x2="23" y2="23"/>
                      </svg>
                    ) : (
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                        <circle cx="12" cy="12" r="3"/>
                      </svg>
                    )}
                  </button>
                </div>
              </div>

              <div className="auth-page__field">
                <label htmlFor="confirmPassword">Confirm password</label>
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Re-enter password"
                  required
                  disabled={loading}
                />
              </div>
            </div>

            <button type="submit" className="auth-page__submit" disabled={loading}>
              {loading ? <span className="auth-page__spinner" /> : 'Create account'}
            </button>
          </form>

          <p className="auth-page__register">
            Already have an account? <Link to="/user/login">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default UserRegister;
