import AsyncStorage from '@react-native-async-storage/async-storage';

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
export const login = async (
  email: string,
  password: string,
): Promise<User | null> => {
  const user = USERS.find((u) => u.email === email);

  return new Promise((resolve) => {
    setTimeout(async () => {
      if (user) {
        // In a real app, you'd validate the password here
        try {
          await AsyncStorage.setItem("user", JSON.stringify(user));
          const storedUser = await AsyncStorage.getItem("user");
          console.warn('AsyncStorage user:', storedUser);
          currentUser = user;
          resolve(user);
        } catch (error) {
          console.error('Error saving user:', error);
          resolve(null);
        }
      } else {
        resolve(null);
      }
    }, 500); // Simulate network delay
  });
};

// Logout function
export const logout = async (): Promise<void> => {
  try {
    await AsyncStorage.removeItem("user");
    currentUser = null;
  } catch (error) {
    console.error('Error removing user:', error);
  }
};

// Get current user
export const getCurrentUser = async (): Promise<User | null> => {
  if (currentUser) return currentUser;

  try {
    const storedUser = await AsyncStorage.getItem("user");
    if (storedUser) {
      currentUser = JSON.parse(storedUser);
      return currentUser;
    }
    return null;
  } catch (error) {
    console.error('Error getting user:', error);
    return null;
  }
};

// Check if user has specific role
export const hasRole = async (role: UserRole): Promise<boolean> => {
  const user = await getCurrentUser();
  if (!user) return false;

  // Admin has all privileges
  if (user.role === "admin") return true;

  // Otherwise check for exact role match
  return user.role === role;
};

// Check if user is authenticated
export const isAuthenticated = async (): Promise<boolean> => {
  const user = await getCurrentUser();
  return user !== null;
};

// Permission check for specific actions
export const canPerformAction = async (
  action: "create" | "update" | "delete"
): Promise<boolean> => {
  const user = await getCurrentUser();
  if (!user) return false;

  // Admins can do everything
  if (user.role === "admin") return true;

  // Regular users can only update
  if (user.role === "user") return action === "update";

  // Guests can't perform any actions
  return false;
};