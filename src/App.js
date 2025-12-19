import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import UserLogin from './components/auth/UserLogin';
import UserRegister from './components/auth/UserRegister';
import AuthorityLogin from './components/auth/AuthorityLogin';
import AuthorityRegister from './components/auth/AuthorityRegister';
import UserDashboard from './components/user/UserDashboard';
import AuthorityDashboard from './components/authority/AuthorityDashboard';
import LandingPage from './components/LandingPage';
import ProtectedRoute from './components/ProtectedRoute';
import './App.css';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/user/login" element={<UserLogin />} />
            <Route path="/user/register" element={<UserRegister />} />
            <Route path="/authority/login" element={<AuthorityLogin />} />
            <Route path="/authority/register" element={<AuthorityRegister />} />
            <Route 
              path="/user/dashboard" 
              element={
                <ProtectedRoute userType="user">
                  <UserDashboard />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/authority/dashboard" 
              element={
                <ProtectedRoute userType="authority">
                  <AuthorityDashboard />
                </ProtectedRoute>
              } 
            />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
