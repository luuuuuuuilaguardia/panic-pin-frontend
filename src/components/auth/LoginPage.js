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

  const config = ROLES[role];

  useEffect(() => {
    setRole(roleFromPath);
  }, [roleFromPath]);

  useEffect(() => {
    setFormData({ password: '' });
    setError('');
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
        <BrandMark size="lg" />
        <div className="login-page__aside-body">
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
                />
              </div>
            ))}

            <div className="login-page__field">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Your password"
                autoComplete="current-password"
                required
              />
            </div>

            <button
              type="submit"
              className={`login-page__submit${role === 'authority' ? ' login-page__submit--authority' : ''}`}
              disabled={loading}
            >
              {loading ? 'Signing in…' : 'Sign in'}
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
