import React, { createContext, useState, useContext } from 'react';

// Tạo context cho user
const UserContext = createContext();

// Tạo provider để quản lý và cung cấp state cho các component khác
export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null); // Lưu thông tin người dùng

  const setUserDetails = (userData) => {
    setUser(userData);
  };

  return (
    <UserContext.Provider value={{ user, setUserDetails }}>
      {children}
    </UserContext.Provider>
  );
};

// Hook để sử dụng context trong các component
export const useUser = () => useContext(UserContext);
