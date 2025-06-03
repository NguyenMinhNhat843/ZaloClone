// src/hooks/useLoginConflictChecker.js
import { useEffect } from 'react';

export default function useLoginConflictChecker() {
  useEffect(() => {
    const interval = setInterval(() => {
      const loginTime = localStorage.getItem('loginTime');
      const sessionLoginTime = sessionStorage.getItem('sessionLoginTime');
      const tokenExpiry = parseInt(localStorage.getItem('tokenExpiry') || 0);

      // Token hết hạn
      if (Date.now() > tokenExpiry) {
        alert('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.');
        handleLogout();
        return;
      }

      // Bị login nơi khác
      if (loginTime && sessionLoginTime && loginTime !== sessionLoginTime) {
        alert('Tài khoản đã đăng nhập ở nơi khác. Phiên này sẽ bị đăng xuất.');
        handleLogout();
      }
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    sessionStorage.clear();
    window.location.href = '/login';
  };
}
