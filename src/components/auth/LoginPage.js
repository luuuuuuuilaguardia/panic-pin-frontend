import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import API_URL from '../../config/api';
import BrandMark from '../BrandMark';
import './LoginPage.css';

const ROLES = {
  user: {
    label: 'Individual',
    title: 'Sign in to your account',
    subtitle: 'Use the contact number you registered with.',
    endpoint: '/user/login',
    registerPath: '/user/register',
    dashboardPath: '/user/dashboard',
    userType: 'user',
    userKey: 'user',
    fields: [
      {
        id: 'contact',
        name: 'contact',
        label: 'Contact number',
        type: 'text',
        placeholder: '09xxxxxxxxx',
        autoComplete: 'tel',
      },
    ],
    errorFallback: 'Invalid contact or password',
  },
  authority: {
    label: 'Authority',
    title: 'Authority sign in',
    subtitle: 'Access the emergency monitoring dashboard.',
    endpoint: '/authority/login',
    registerPath: '/authority/register',
    dashboardPath: '/authority/dashboard',
    userType: 'authority',
    userKey: 'authority',
    fields: [
      {
        id: 'employeeId',
        name: 'employeeId',
        label: 'Employee ID',
        type: 'text',
        placeholder: 'Your employee ID',
        autoComplete: 'username',
      },
    ],
    errorFallback: 'Invalid employee ID or password',
  },
};

const LoginPage = ({ initialRole = 'user' }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { login } = useAuth();

  const roleFromPath = location.pathname.startsWith('/authority') ? 'authority' : 'user';
  const [role, setRole] = useState(initialRole || roleFromPath);
  const [formData, setFormData] = useState({ password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const config = ROLES[role];

  useEffect(() => {
    setRole(roleFromPath);
  }, [roleFromPath]);

  useEffect(() => {
    setFormData({ password: '' });
    setError('');
    setShowPassword(false);
  }, [role]);

  const handleRoleChange = (nextRole) => {
    setRole(nextRole);
    const path = nextRole === 'authority' ? '/authority/login' : '/user/login';
    navigate(path, { replace: true });
  };

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch(`${API_URL}${config.endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        login(data[config.userKey], config.userType);
        navigate(config.dashboardPath);
      } else {
        setError(data.error || config.errorFallback);
      }
    } catch (err) {
      console.error('Login error:', err);
      setError('Unable to connect to server. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <aside className="login-page__aside">
        <BrandMark size="lg" tone="light" showTagline />
        <div className="login-page__aside-body">
          <div className="login-page__aside-decoration" aria-hidden="true">
            <div className="login-page__aside-circle login-page__aside-circle--1" />
            <div className="login-page__aside-circle login-page__aside-circle--2" />
          </div>
          <h1>Emergency response starts here.</h1>
          <p>
            Sign in to send or receive SOS alerts. Your session stays on this
            device until you log out.
          </p>
        </div>
        <Link to="/" className="login-page__back">
          ← Back to home
        </Link>
      </aside>

      <div className="login-page__main">
        <div className="login-page__form-wrap">
          <div className="login-page__role-switch" role="tablist" aria-label="Account type">
            {Object.entries(ROLES).map(([key, value]) => (
              <button
                key={key}
                type="button"
                role="tab"
                aria-selected={role === key}
                className={`login-page__role-btn${role === key ? ' login-page__role-btn--active' : ''}${key === 'authority' ? ' login-page__role-btn--authority' : ''}`}
                onClick={() => handleRoleChange(key)}
              >
                {value.label}
              </button>
            ))}
          </div>

          <div className="login-page__header">
            <h2>{config.title}</h2>
            <p>{config.subtitle}</p>
          </div>

          {error && (
            <div className="login-page__error" role="alert">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"/>
                <line x1="15" y1="9" x2="9" y2="15"/>
                <line x1="9" y1="9" x2="15" y2="15"/>
              </svg>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="login-page__form">
            {config.fields.map((field) => (
              <div key={field.name} className="login-page__field">
                <label htmlFor={field.id}>{field.label}</label>
                <input
                  type={field.type}
                  id={field.id}
                  name={field.name}
                  value={formData[field.name] || ''}
                  onChange={handleChange}
                  placeholder={field.placeholder}
                  autoComplete={field.autoComplete}
                  required
                  disabled={loading}
                />
              </div>
            ))}

            <div className="login-page__field">
              <label htmlFor="password">Password</label>
              <div className="login-page__password-wrap">
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Your password"
                  autoComplete="current-password"
                  required
                  disabled={loading}
                />
                <button
                  type="button"
                  className="login-page__eye"
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

            <button
              type="submit"
              className={`login-page__submit${role === 'authority' ? ' login-page__submit--authority' : ''}`}
              disabled={loading}
            >
              {loading ? (
                <span className="login-page__spinner" />
              ) : (
                'Sign in'
              )}
            </button>
          </form>

          <p className="login-page__register">
            No account yet?{' '}
            <Link to={config.registerPath}>Create one</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
