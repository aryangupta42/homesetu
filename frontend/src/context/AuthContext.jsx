import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../api';

const AuthContext = createContext();

export const DEMO_USERS = {
  student: {
    id: 1,
    fullName: "Rahul Verma",
    email: "student@homesetu.com",
    role: "STUDENT",
    phone: "+91 98765 00001",
    college: "Pune Engineering College (COEP)",
    city: "Pune"
  },
  owner: {
    id: 10,
    fullName: "Ramesh Sharma",
    email: "owner@homesetu.com",
    role: "OWNER",
    phone: "+91 91234 56789",
    city: "Pune",
    isVerified: true
  },
  admin: {
    id: 99,
    fullName: "HomeSetu Admin",
    email: "admin@homesetu.com",
    role: "ADMIN",
    phone: "+91 99999 88888",
    city: "Pune"
  }
};

export function AuthProvider({ children }) {
  // Default to student demo user
  const [currentUser, setCurrentUser] = useState(() => {
    const saved = localStorage.getItem('homesetu_user');
    return saved ? JSON.parse(saved) : DEMO_USERS.student;
  });

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('homesetu_user', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('homesetu_user');
    }
  }, [currentUser]);

  const login = async (email, password) => {
    const res = await api.login(email, password);
    if (res.success && res.user) {
      setCurrentUser(res.user);
      return { success: true };
    }
    return { success: false, message: res.message || "Login failed" };
  };

  const register = async (userData) => {
    const res = await api.register(userData);
    if (res.success && res.user) {
      setCurrentUser(res.user);
      return { success: true };
    }
    return { success: false, message: res.message || "Registration failed" };
  };

  const logout = () => {
    setCurrentUser(null);
  };

  const switchUserRole = (roleKey) => {
    if (DEMO_USERS[roleKey]) {
      setCurrentUser(DEMO_USERS[roleKey]);
    }
  };

  return (
    <AuthContext.Provider value={{ currentUser, login, register, logout, switchUserRole }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
