import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { UserProvider } from './contexts/UserContext'; // Import UserProvider
import Login from './pages/Login';
import Register from './pages/Register';
import Settings from './pages/Setting';
import Profile from './pages/Profile';
import VerifyPage from './pages/VerifyPage';
import Home from './pages/Home';

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const handleLogin = () => {
    setIsAuthenticated(true);
  };

  return (
    <UserProvider> {/* Bọc toàn bộ ứng dụng bằng UserProvider */}
      <Router>
        <Routes>
          <Route path="/login" element={<Login onLogin={handleLogin} />} />
          <Route path="/register" element={<Register />} />
          <Route path="/home" element={<Home />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/VerifyPage" element={<VerifyPage />} />
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

