import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { UserProvider } from './contexts/UserContext'; // Import UserProvider
import Login from './pages/Login';
import Register from './pages/Register';
import Settings from './pages/Setting';
import Profile from './pages/Profile';
import VerifyPage from './pages/VerifyPage';
import Home from './pages/Home';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import VerifyPageRegister from './pages/VerifyPageRegister';
export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const handleAuthenticated = () => {
    setIsAuthenticated(true);
  };

  return (
    <UserProvider> {/* Bọc toàn bộ ứng dụng bằng UserProvider */}
      <Router>
        <Routes>
          <Route path="/login" element={<Login onLogin={handleAuthenticated} />} />
          <Route path="/register" element={<Register />} />
          <Route path="/home" element={<Home />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/VerifyPage" element={<VerifyPage />} />
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
