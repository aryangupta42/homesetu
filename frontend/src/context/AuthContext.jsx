import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../api';

const AuthContext = createContext();

export const DEMO_USERS = {
  students: [
    {
      id: 6,
      fullName: "Aarav Sharma",
      email: "student1@homesetu.demo",
      password: "Student@123",
      role: "STUDENT",
      phone: "+91 98111 20001",
      college: "ABES Engineering College, Ghaziabad",
      studentId: "ABES-2023-CS-042",
      city: "Ghaziabad"
    },
    {
      id: 7,
      fullName: "Riya Verma",
      email: "student2@homesetu.demo",
      password: "Student@123",
      role: "STUDENT",
      phone: "+91 98111 20002",
      college: "AKGEC Ghaziabad",
      studentId: "AKG-2023-IT-089",
      city: "Ghaziabad"
    },
    {
      id: 8,
      fullName: "Kabir Mehta",
      email: "student3@homesetu.demo",
      password: "Student@123",
      role: "STUDENT",
      phone: "+91 98111 20003",
      college: "KIET Group of Institutions, Ghaziabad",
      studentId: "KIET-2024-ECE-115",
      city: "Ghaziabad"
    },
    {
      id: 9,
      fullName: "Ananya Gupta",
      email: "student4@homesetu.demo",
      password: "Student@123",
      role: "STUDENT",
      phone: "+91 98111 20004",
      college: "Galgotias University, Greater Noida",
      studentId: "GU-2023-BBA-204",
      city: "Greater Noida"
    },
    {
      id: 10,
      fullName: "Rohan Malhotra",
      email: "student5@homesetu.demo",
      password: "Student@123",
      role: "STUDENT",
      phone: "+91 98111 20005",
      college: "IMS Ghaziabad (UC Campus)",
      studentId: "IMS-2024-BCA-067",
      city: "Ghaziabad"
    }
  ],
  owners: [
    {
      id: 11,
      fullName: "Vikram Chauhan",
      email: "owner1@homesetu.demo",
      password: "Owner@123",
      role: "OWNER",
      phone: "+91 98222 30001",
      propertyName: "Chauhan Residency (5 PGs)",
      city: "Crossings Republik, Ghaziabad"
    },
    {
      id: 12,
      fullName: "Sunil Aggarwal",
      email: "owner2@homesetu.demo",
      password: "Owner@123",
      role: "OWNER",
      phone: "+91 98222 30002",
      propertyName: "Aggarwal PG Homes (5 PGs)",
      city: "Indirapuram, Ghaziabad"
    },
    {
      id: 13,
      fullName: "Rajesh Tyagi",
      email: "owner3@homesetu.demo",
      password: "Owner@123",
      role: "OWNER",
      phone: "+91 98222 30003",
      propertyName: "Tyagi Student Stays (5 PGs)",
      city: "Opp. ABES Gate, Ghaziabad"
    },
    {
      id: 14,
      fullName: "Deepak Singhal",
      email: "owner4@homesetu.demo",
      password: "Owner@123",
      role: "OWNER",
      phone: "+91 98222 30004",
      propertyName: "Singhal Comfort Living (5 PGs)",
      city: "Raj Nagar Ext & KIET"
    },
    {
      id: 15,
      fullName: "Pooja Sharma",
      email: "owner5@homesetu.demo",
      password: "Owner@123",
      role: "OWNER",
      phone: "+91 98222 30005",
      propertyName: "Sharma Executive Living (5 PGs)",
      city: "Noida Sector 62 & Gr. Noida"
    }
  ],
  admin: {
    id: 1,
    fullName: "Arsh Mittal",
    email: "arshm2772@gmail.com",
    password: "123456",
    role: "ADMIN",
    phone: "+91 98765 43210",
    city: "HomeSetu Central Administration"
  }
};

export function AuthProvider({ children }) {
  // Start logged out by default unless an active session is saved in localStorage
  const [currentUser, setCurrentUser] = useState(() => {
    const saved = localStorage.getItem('homesetu_user');
    return saved ? JSON.parse(saved) : null;
  });

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('homesetu_user', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('homesetu_user');
    }
  }, [currentUser]);

  const login = async (email, password, expectedRole = null) => {
    const res = await api.login(email, password, expectedRole);
    if (res.success && res.user) {
      setCurrentUser(res.user);
      return { success: true, user: res.user };
    }
    return { success: false, message: res.message || "Login failed. Invalid credentials." };
  };

  const register = async (userData) => {
    const res = await api.register(userData);
    if (res.success && res.user) {
      setCurrentUser(res.user);
      localStorage.setItem('homesetu_user', JSON.stringify(res.user));
      return { success: true, user: res.user };
    }
    return { success: false, message: res.message || "Registration failed" };
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem('homesetu_user');
  };

  return (
    <AuthContext.Provider value={{ currentUser, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
