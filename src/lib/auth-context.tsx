'use client';

import React, { createContext, useContext, useEffect, ReactNode } from 'react';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  User,
} from 'firebase/auth';
import { auth, googleProvider } from './firebase';
import { useAuthStore } from '@/store/useAuthStore';
import { useProfileStore } from '@/store/useProfileStore';
import { createUserDocument, getProfiles } from './firestore';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signup: (email: string, password: string, displayName: string) => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const { user, loading, setUser, setLoading } = useAuthStore();
  const { setProfiles } = useProfileStore();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setUser(user);

      if (user) {
        try {
          const profiles = await getProfiles(user.uid);
          setProfiles(profiles);
        } catch (error) {
          console.error('Error loading profiles:', error);
        }
      } else {
        setProfiles([]);
      }

      setLoading(false);
    });

    return unsubscribe;
  }, [setUser, setLoading, setProfiles]);

  const signup = async (
    email: string,
    password: string,
    displayName: string
  ) => {
    const { user } = await createUserWithEmailAndPassword(auth, email, password);
    await createUserDocument(user.uid, email, displayName);
  };

  const login = async (email: string, password: string) => {
    await signInWithEmailAndPassword(auth, email, password);
  };

  const loginWithGoogle = async () => {
    const { user } = await signInWithPopup(auth, googleProvider);
    await createUserDocument(
      user.uid,
      user.email || '',
      user.displayName || 'User'
    ).catch(() => {}); // User doc might already exist
  };

  const logout = async () => {
    await signOut(auth);
  };

  return (
    <AuthContext.Provider
      value={{ user, loading, signup, login, loginWithGoogle, logout }}
    >
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

export const useAuthContext = useAuth;
