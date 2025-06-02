'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';

interface User {
  id: string;
  email: string;
  username: string;
  ageTier: string;
  isEmailVerified: boolean;
  isAgeVerified: boolean;
  role: string; // e.g., 'user', 'parent'
}

// Types for Parental Controls (can be moved to a shared types file later)
export interface ChildAccount { // Exporting if ParentalControlDashboard will import
  id: string;
  displayName: string;
  ageTier: string; // Consider using AgeTier enum if applicable
  currentSettings: ChildSettings;
  // Add other relevant fields like lastActivity, etc.
}

export interface ChildSettings { // Exporting
  contentRestrictions: string[];
  timeLimits: { dailyMinutes: number; weeklyMinutes?: number };
  collaborationPermissions: 'friends_only' | 'supervised' | 'allowed' | 'blocked';
  storyPublishingAllowed: boolean;
}

export interface PendingRequest { // Exporting
  id: string;
  childId: string;
  childName: string;
  requestType: string;
  details: string;
  requestedAt: string; // ISO date string
}


interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (userData: RegisterData) => Promise<void>;
  logout: () => void;
  refreshToken: () => Promise<void>;
  submitAgeVerification: (method: string, verificationData: any) => Promise<void>;
  // Parental Control Functions
  fetchChildAccounts: () => Promise<ChildAccount[]>;
  updateChildSettings: (childId: string, settings: Partial<ChildSettings>) => Promise<void>;
  fetchPendingRequests: () => Promise<PendingRequest[]>;
  // User Profile/Settings Functions
  updateUserProfile: (profileData: Partial<User>) => Promise<void>;
  changePassword: (currentPassword: string, newPassword: string) => Promise<void>;
}

interface RegisterData {
  email: string;
  password: string;
  dateOfBirth: string;
  parentEmail?: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  // Check for existing token on mount
  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      // Verify token and get user data
      fetchUserProfile();
    } else {
      setIsLoading(false);
    }
  }, []);

  const fetchUserProfile = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      const response = await fetch('/api/auth/profile', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const apiUser = await response.json();
        // Map API response to local User interface
        const profileUser: User = {
          id: apiUser.userId,
          email: apiUser.email,
          username: apiUser.username,
          ageTier: apiUser.verifiedAgeTier,
          isEmailVerified: apiUser.isEmailVerified || false,
          isAgeVerified: apiUser.verifiedAgeTier !== 'unverified',
          role: apiUser.role || 'user', // Assume 'user' if no role is provided by API
        };
        setUser(profileUser);
      } else {
        // Token is invalid, clear it
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
      }
    } catch (error) {
      console.error('Error fetching user profile:', error);
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem('accessToken', data.accessToken);
        // Assuming refreshToken might not always be returned by /api/auth/login
        if (data.refreshToken) {
          localStorage.setItem('refreshToken', data.refreshToken);
        }
        // Map API response data.user to local User interface
        const loggedInUser: User = {
          id: data.user.userId,
          email: data.user.email,
          username: data.user.username || '', 
          ageTier: data.user.verifiedAgeTier,
          isEmailVerified: data.user.isEmailVerified || false,
          isAgeVerified: data.user.verifiedAgeTier !== 'unverified',
          role: data.user.role || 'user', // Assume 'user' if no role is provided
        };
        setUser(loggedInUser);
        router.push('/explore');
      } else {
        throw new Error(data.message || 'Login failed');
      }
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (userData: RegisterData) => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      const data = await response.json();

      if (response.ok) {
        // Registration successful, redirect to login or email verification
        router.push('/login?message=Registration successful. Please check your email to verify your account.');
      } else {
        throw new Error(data.message || 'Registration failed');
      }
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    setUser(null);
    router.push('/login');
  };

  const refreshToken = async () => {
    try {
      const refreshToken = localStorage.getItem('refreshToken');
      if (!refreshToken) {
        throw new Error('No refresh token available');
      }

      const response = await fetch('/api/auth/refresh-token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
        },
        body: JSON.stringify({ refreshToken }),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem('accessToken', data.accessToken);
        if (data.refreshToken) {
          localStorage.setItem('refreshToken', data.refreshToken);
        }
      } else {
        // Refresh failed, logout user
        logout();
      }
    } catch (error) {
      console.error('Error refreshing token:', error);
      logout();
    }
  };

  const submitAgeVerification = async (method: string, verificationData: any) => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem('accessToken');
      let response;

      const body = JSON.stringify({ method, verificationData });
      let headers: HeadersInit = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      };

      // If verificationData is FormData, let the browser set Content-Type
      if (verificationData instanceof FormData) {
        delete headers['Content-Type']; // Browser will set it to multipart/form-data
        // FormData should be sent directly as body, not stringified
        response = await fetch('/api/auth/verify-age', {
          method: 'POST',
          headers: headers,
          body: verificationData, // Send FormData directly
        });
      } else {
        response = await fetch('/api/auth/verify-age', {
          method: 'POST',
          headers: headers,
          body: body, // Send JSON stringified body
        });
      }

      const data = await response.json();

      if (response.ok) {
        // After successful verification, re-fetch user profile to get updated status
        await fetchUserProfile();
        // Optionally, display a success message based on data from response
        // router.push('/profile?message=Age verification submitted');
      } else {
        throw new Error(data.message || 'Age verification failed');
      }
    } catch (error) {
      console.error('Error submitting age verification:', error);
      throw error; // Re-throw to be caught by the form
    } finally {
      setIsLoading(false);
    }
  };

  // --- Parental Control Functions (Placeholders) ---
  const fetchChildAccounts = async (): Promise<ChildAccount[]> => {
    console.log('AuthContext: fetchChildAccounts called (placeholder)');
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));
    // Return dummy data similar to ParentalControlDashboard's initial state
    // This data structure should align with what the dashboard expects.
    return [
      {
        id: 'child1_ctx',
        displayName: 'Kiddo1 (from Ctx)',
        ageTier: 'kids', // from AgeTier enum or string
        currentSettings: {
          contentRestrictions: ['violence'],
          timeLimits: { dailyMinutes: 100 },
          collaborationPermissions: 'supervised',
          storyPublishingAllowed: false,
        },
      },
    ];
  };

  const updateChildSettings = async (childId: string, settings: Partial<ChildSettings>): Promise<void> => {
    console.log(`AuthContext: updateChildSettings for ${childId} with`, settings, '(placeholder)');
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));
    // In a real scenario, you might re-fetch child accounts or update context state if necessary
  };

  const fetchPendingRequests = async (): Promise<PendingRequest[]> => {
    console.log('AuthContext: fetchPendingRequests called (placeholder)');
    await new Promise(resolve => setTimeout(resolve, 500));
    return [
      {
        id: 'req_ctx_1',
        childId: 'child1_ctx',
        childName: 'Kiddo1 (from Ctx)',
        requestType: 'Story Publishing',
        details: 'Request to publish "Adventures in Context Space"',
        requestedAt: new Date().toISOString(),
      },
    ];
  };

  const updateUserProfile = async (profileData: Partial<User>): Promise<void> => {
    setIsLoading(true);
    console.log('AuthContext: updateUserProfile called with', profileData, '(placeholder)');
    // Simulate API call to PUT /api/auth/profile or /api/users/me
    await new Promise(resolve => setTimeout(resolve, 750));
    try {
      // const response = await fetch('/api/users/me', {
      //   method: 'PUT',
      //   headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${localStorage.getItem('accessToken')}` },
      //   body: JSON.stringify(profileData),
      // });
      // const updatedUser = await response.json();
      // if (!response.ok) throw new Error(updatedUser.message || 'Failed to update profile');
      
      // For placeholder: optimistic update
      setUser(prevUser => prevUser ? ({ ...prevUser, ...profileData }) : null);
      // await fetchUserProfile(); // Or re-fetch full profile
      console.log('Profile updated successfully (placeholder)');
    } catch (error) {
      console.error('Error updating user profile:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const changePassword = async (currentPassword: string, newPassword: string): Promise<void> => {
    setIsLoading(true);
    console.log('AuthContext: changePassword called (placeholder)');
    // Simulate API call to POST /api/auth/change-password
    await new Promise(resolve => setTimeout(resolve, 750));
    try {
      // const response = await fetch('/api/auth/change-password', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${localStorage.getItem('accessToken')}` },
      //   body: JSON.stringify({ currentPassword, newPassword }),
      // });
      // const result = await response.json();
      // if (!response.ok) throw new Error(result.message || 'Failed to change password');
      console.log('Password changed successfully (placeholder)');
    } catch (error) {
      console.error('Error changing password:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const value = {
    user,
    isLoading,
    login,
    register,
    logout,
    refreshToken,
    submitAgeVerification,
    // Parental control functions
    fetchChildAccounts,
    updateChildSettings,
    fetchPendingRequests,
    // User profile functions
    updateUserProfile,
    changePassword,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};