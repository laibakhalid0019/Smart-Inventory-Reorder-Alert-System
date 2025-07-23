import React, { createContext, useContext, useState, useEffect } from 'react';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'retailer' | 'distributor' | 'delivery';
  profilePicture?: string;
  initials: string;
}

interface UserContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  isLoggedIn: boolean;
  logout: () => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};

// Mock users for demonstration - in real app this would come from authentication
const mockUsers = {
  retailer: {
    id: 'ret_001',
    name: 'Sarah Johnson',
    email: 'sarah@retailstore.com',
    role: 'retailer' as const,
    profilePicture: 'https://images.unsplash.com/photo-1494790108755-2616b4db2615?w=400',
    initials: 'SJ'
  },
  distributor: {
    id: 'dist_001', 
    name: 'Michael Chen',
    email: 'michael@techsupply.com',
    role: 'distributor' as const,
    profilePicture: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400',
    initials: 'MC'
  },
  delivery: {
    id: 'del_001',
    name: 'Alex Rodriguez',
    email: 'alex@fastdelivery.com', 
    role: 'delivery' as const,
    profilePicture: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400',
    initials: 'AR'
  }
};

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    // Auto-login based on current route for demo purposes
    const path = window.location.pathname;
    if (path.includes('/dashboard/retailer') || path.includes('/retailer/')) {
      setUser(mockUsers.retailer);
    } else if (path.includes('/dashboard/distributor') || path.includes('/distributor/')) {
      setUser(mockUsers.distributor);
    } else if (path.includes('/dashboard/delivery') || path.includes('/delivery/')) {
      setUser(mockUsers.delivery);
    }
  }, []);

  const isLoggedIn = !!user;

  const logout = () => {
    setUser(null);
    // Clear any stored authentication data
    localStorage.removeItem('user');
    sessionStorage.clear();
  };

  return (
    <UserContext.Provider value={{ user, setUser, isLoggedIn, logout }}>
      {children}
    </UserContext.Provider>
  );
};