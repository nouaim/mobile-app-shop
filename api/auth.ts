import React, { useEffect, useRef, useState } from "react";

// User roles
export type UserRole = "admin" | "user" | "guest";

// User interface
export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
}

// Mock users for demo purposes
const USERS: User[] = [
  {
    id: "1",
    email: "admin@example.com",
    name: "Admin User",
    role: "admin",
  },
  {
    id: "2",
    email: "user@example.com",
    name: "Regular User",
    role: "user",
  },
];

// Current user state
let currentUser: User | null = null;

// Login function
export const login = (
  email: string,
  password: string,
): Promise<User | null> => {
  return new Promise((resolve) => {

    const user = USERS.find((u) => u.email === email);
    console.warn(user);

    setTimeout(() => {
      if (user) {
        // In a real app, you'd validate the password here
        localStorage.setItem("user", JSON.stringify(user));
        console.warn('local storage', localStorage.getItem("user"));
        currentUser = user;
        resolve(user);
      } else {
        resolve(null);
      }
    }, 500); // Simulate network delay
  });
};

// Logout function
export const logout = (): void => {
  localStorage.removeItem("user");
  currentUser = null;
};

// Get current user
export const getCurrentUser = (): User | null => {
  if (currentUser) return currentUser;

  const storedUser: any = localStorage.getItem("user");
  if (storedUser) {
    currentUser = JSON.parse(storedUser);
    return currentUser;
  }
  return null;
};

// Check if user has specific role
export const hasRole = (role: UserRole): boolean => {
  const user = getCurrentUser();
  if (!user) return false;

  // Admin has all privileges
  if (user.role === "admin") return true;

  // Otherwise check for exact role match
  return user.role === role;
};

// Check if user is authenticated
export const isAuthenticated = (): boolean => {
  return getCurrentUser() !== null;
};

// Permission check for specific actions
export const canPerformAction = (
  action: "create" | "update" | "delete"
): boolean => {
  const user = getCurrentUser();
  if (!user) return false;

  // Admins can do everything
  if (user.role === "admin") return true;

  // Regular users can only update
  if (user.role === "user") return action === "update";

  // Guests can't perform any actions
  return false;
};
