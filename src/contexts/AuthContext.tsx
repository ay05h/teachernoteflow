import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from '@/hooks/use-toast';

type UserType = 'teacher' | 'student' | null;

interface User {
  id: string;
  name: string;
  email: string;
  type: UserType;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string, userType: UserType) => Promise<boolean>;
  register: (name: string, email: string, password: string, userType: UserType) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
}

interface UserWithPassword extends User {
  password: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  // Initialize users array if it doesn't exist in localStorage
  useEffect(() => {
    const storedUsers = localStorage.getItem('users');
    if (!storedUsers) {
      localStorage.setItem('users', JSON.stringify([]));
    }
  }, []);
  
  // In a real app, this would be fetched from a backend
  // For demo, we'll use local storage
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string, userType: UserType): Promise<boolean> => {
    setIsLoading(true);
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Check if user exists and validate credentials
      const storedUsers = localStorage.getItem('users');
      const users: UserWithPassword[] = storedUsers ? JSON.parse(storedUsers) : [];
      
      const existingUser = users.find(u => u.email === email && u.password === password);
      
      // If user doesn't exist or password doesn't match
      if (!existingUser) {
        toast({
          title: "Login failed",
          description: "Invalid email or password.",
          variant: "destructive",
        });
        setIsLoading(false);
        return false;
      }
      
      // Validate user type
      if (existingUser.type !== userType) {
        toast({
          title: "Login failed",
          description: `This account is registered as a ${existingUser.type}, not a ${userType}.`,
          variant: "destructive",
        });
        setIsLoading(false);
        return false;
      }
      
      // User exists and credentials match
      const userWithoutPassword = {
        id: existingUser.id,
        name: existingUser.name,
        email: existingUser.email,
        type: existingUser.type
      };
      
      setUser(userWithoutPassword);
      localStorage.setItem('user', JSON.stringify(userWithoutPassword));
      
      toast({
        title: "Login successful",
        description: `Welcome back, ${existingUser.name}!`,
      });
      
      return true;
    } catch (error) {
      console.error("Login error:", error);
      toast({
        title: "Login failed",
        description: "Please check your credentials and try again.",
        variant: "destructive",
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (
    name: string, 
    email: string, 
    password: string, 
    userType: UserType
  ): Promise<boolean> => {
    setIsLoading(true);
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Check if user already exists
      const storedUsers = localStorage.getItem('users');
      const users: UserWithPassword[] = storedUsers ? JSON.parse(storedUsers) : [];
      
      if (users.some(u => u.email === email)) {
        toast({
          title: "Registration failed",
          description: "An account with this email already exists.",
          variant: "destructive",
        });
        return false;
      }
      
      // Create a new user with password
      const newUser: UserWithPassword = {
        id: Math.random().toString(36).substring(2, 9),
        name,
        email,
        password, // Store password for authentication
        type: userType,
      };
      
      // Store the new user in the mock database
      users.push(newUser);
      localStorage.setItem('users', JSON.stringify(users));
      
      // Store user without password in the local state
      const userWithoutPassword = {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        type: newUser.type
      };
      
      setUser(userWithoutPassword);
      localStorage.setItem('user', JSON.stringify(userWithoutPassword));
      
      toast({
        title: "Registration successful",
        description: `Welcome, ${name}!`,
      });
      
      return true;
    } catch (error) {
      console.error("Registration error:", error);
      toast({
        title: "Registration failed",
        description: "Please try again with different credentials.",
        variant: "destructive",
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
    toast({
      title: "Logged out",
      description: "You have been successfully logged out.",
    });
  };

  return (
    <AuthContext.Provider 
      value={{ 
        user, 
        isLoading,
        login, 
        register, 
        logout,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
