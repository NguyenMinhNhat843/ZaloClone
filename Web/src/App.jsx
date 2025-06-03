import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate, useNavigate } from 'react-router-dom';
import { UserProvider } from './contexts/UserContext'; // Import UserProvider
import Login from './pages/Login';
import Register from './pages/Register';
import Settings from './pages/Setting';
import Profile from './pages/Profile';
import Home from './pages/Home';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import VerifyPageRegister from './pages/VerifyPageRegister';
import useLoginConflictChecker from './hooks/useLoginConflictChecker';

function AuthChecker() {
  const navigate = useNavigate();

  useEffect(() => {
    const interval = setInterval(() => {
      const expiry = localStorage.getItem('tokenExpiry');
      if (expiry && new Date().getTime() > Number(expiry)) {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('tokenExpiry');
        localStorage.removeItem('userPhone');
        navigate('/login');
      }
    }, 1000 * 60); // mỗi phút kiểm tra 1 lần

    return () => clearInterval(interval);
  }, [navigate]);

  return null;
}


export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
    //useLoginConflictChecker(); 

  const handleAuthenticated = () => {
    setIsAuthenticated(true);
  };

  return (
    <UserProvider>
      <Router>
        <AuthChecker />
        <Routes>
          <Route path="/login" element={<Login onLogin={handleAuthenticated} />} />
          <Route path="/register" element={<Register />} />
          <Route path="/home" element={<Home />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/verifyRegister" element={<VerifyPageRegister />} />
          <Route path="/forgotpassword" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route 
            path="/" 
            element={
              isAuthenticated ? (
                <Home />
              ) : (
                <Navigate to="/login" replace />
              )
            } 
          />
        </Routes>
      </Router>
    </UserProvider>
  );
}