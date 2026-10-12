import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../api';

const AuthContext = createContext();

export const DEMO_USERS = {
  leader: {
    id: 1,
    fullName: "Arsh Mittal",
    email: "arsh@homesetu.com",
    role: "STUDENT",
    phone: "+91 87553 59505",
    college: "Symbiosis International University",
    city: "Pune",
    isLeader: true
  },
  student: {
    id: 2,
    fullName: "Aryan Gupta",
    email: "aryan@homesetu.com",
    role: "STUDENT",
    phone: "+91 95558 99137",
    college: "College of Engineering Pune (COEP)",
    city: "Pune"
  },
  student3: {
    id: 3,
    fullName: "Divyanshi Mittal",
    email: "divyanshi@homesetu.com",
    role: "STUDENT",
    phone: "+91 93898 73080",
    college: "MIT World Peace University",
    city: "Pune"
  },
  student4: {
    id: 4,
    fullName: "Manasvi Sharma",
    email: "manasvi@homesetu.com",
    role: "STUDENT",
    phone: "+91 72480 27977",
    college: "Savitribai Phule Pune University",
    city: "Pune"
  },
  owner: {
    id: 10,
    fullName: "Ramesh Kothrud",
    email: "ramesh@pgowner.com",
    role: "OWNER",
    phone: "+91 91234 56789",
    city: "Pune"
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
  // Default to Arsh Mittal (Team Leader) demo user
  const [currentUser, setCurrentUser] = useState(() => {
    const saved = localStorage.getItem('homesetu_user');
    return saved ? JSON.parse(saved) : DEMO_USERS.leader;
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
