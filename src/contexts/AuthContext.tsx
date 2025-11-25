import React, { createContext, useContext, useEffect, useState } from 'react';
import { User } from '@/types';
import { getCurrentUser, setCurrentUser, getUsers, addUser, initializeDefaultAdmin, initializeSampleData } from '@/lib/storage';
import { useToast } from '@/hooks/use-toast';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  signup: (email: string, password: string, name: string) => Promise<boolean>;
  logout: () => void;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    initializeDefaultAdmin();
    initializeSampleData();
    const currentUser = getCurrentUser();
    if (currentUser) {
      setUser(currentUser);
    }
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    const users = getUsers();
    
    // Check for admin
    if (email === 'admin@gmail.com' && password === 'admin@12345') {
      const adminUser = users.find(u => u.email === 'admin@gmail.com');
      if (adminUser) {
        setUser(adminUser);
        setCurrentUser(adminUser);
        toast({
          title: "Login Successful",
          description: "Welcome back, Admin!",
        });
        return true;
      }
    }

    // Check for regular users
    const foundUser = users.find(u => u.email === email && u.role === 'user' && u.password === password);
    if (foundUser) {
      // Check if email is verified
      if (!foundUser.emailVerified) {
        toast({
          title: "Email Not Verified",
          description: "Please verify your email before logging in.",
          variant: "destructive",
        });
        return false;
      }

      setUser(foundUser);
      setCurrentUser(foundUser);
      toast({
        title: "Login Successful",
        description: `Welcome back, ${foundUser.name}!`,
      });
      return true;
    }

    toast({
      title: "Login Failed",
      description: "Invalid email or password",
      variant: "destructive",
    });
    return false;
  };

  const signup = async (email: string, password: string, name: string): Promise<boolean> => {
    const users = getUsers();
    
    if (users.some(u => u.email === email)) {
      toast({
        title: "Signup Failed",
        description: "Email already exists",
        variant: "destructive",
      });
      return false;
    }

    const newUser: User = {
      id: `user-${Date.now()}`,
      email,
      name,
      role: 'user',
      emailVerified: false,
      password,
    };

    addUser(newUser);
    
    toast({
      title: "Account Created",
      description: "Please verify your email to continue.",
    });
    
    return true;
  };

  const logout = () => {
    setUser(null);
    setCurrentUser(null);
    toast({
      title: "Logged Out",
      description: "You have been logged out successfully",
    });
  };

  return (
    <AuthContext.Provider value={{ user, login, signup, logout, isAdmin: user?.role === 'admin' }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
