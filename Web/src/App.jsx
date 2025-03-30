import React, { useState } from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Settings from "./pages/Setting";
import Profile from "./pages/Profile";
import Home from "./pages/Home";
import RegisterWithEmail from "./pages/RegisterWithEmail";
import LoginWithEmail from "./pages/LoginWithEmail";

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const handleAuthenticated = () => {
    setIsAuthenticated(true);
  };

  return (
    <Router>
      <Routes>
        {/* Nếu đã đăng nhập, chuyển hướng về trang Home */}
        <Route
          path="/login"
          element={isAuthenticated ? <Navigate to="/" /> : <Login onLogin={handleAuthenticated} />}
        />
        <Route
          path="/login-email"
          element={isAuthenticated ? <Navigate to="/" /> : <LoginWithEmail onLogin={handleAuthenticated} />}
        />
        <Route
          path="/register"
          element={isAuthenticated ? <Navigate to="/" /> : <Register />}
        />
        <Route
          path="/register-email"
          element={isAuthenticated ? <Navigate to="/" /> : <RegisterWithEmail />}
        />

        {/* Chỉ cho phép vào các trang này nếu đã đăng nhập */}
        <Route
          path="/home"
          element={isAuthenticated ? <Home /> : <Navigate to="/login" />}
        />
        <Route
          path="/profile"
          element={isAuthenticated ? <Profile /> : <Navigate to="/login" />}
        />
        <Route
          path="/settings"
          element={isAuthenticated ? <Settings /> : <Navigate to="/login" />}
        />

        {/* Trang chính mặc định */}
        <Route
          path="/"
          element={isAuthenticated ? <Home /> : <Navigate to="/login" />}
        />
      </Routes>
    </Router>
  );
}
