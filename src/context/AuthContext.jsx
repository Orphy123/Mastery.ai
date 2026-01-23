import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase, isSupabaseConfigured } from '../services/supabase';

// Create auth context
const AuthContext = createContext({});

// Custom hook for using auth context
export const useAuth = () => {
  return useContext(AuthContext);
};

// Auth provider component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const AUTH_STORAGE_KEY = 'Mastery.ai_user';
  const DEMO_USERS_KEY = 'Mastery.ai_demo_users';

  const getStoredUser = () => {
    try {
      const stored = localStorage.getItem(AUTH_STORAGE_KEY);
      return stored ? JSON.parse(stored) : null;
    } catch (error) {
      console.error('Error reading stored user:', error);
      return null;
    }
  };

  const setStoredUser = (nextUser) => {
    try {
      if (nextUser) {
        localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(nextUser));
      } else {
        localStorage.removeItem(AUTH_STORAGE_KEY);
      }
    } catch (error) {
      console.error('Error storing user:', error);
    }
  };

  const getDemoUsers = () => {
    try {
      const stored = localStorage.getItem(DEMO_USERS_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('Error reading demo users:', error);
      return [];
    }
  };

  const saveDemoUsers = (users) => {
    try {
      localStorage.setItem(DEMO_USERS_KEY, JSON.stringify(users));
    } catch (error) {
      console.error('Error saving demo users:', error);
    }
  };

  const normalizeUser = (authUser) => {
    if (!authUser) return null;
    return {
      id: authUser.id,
      email: authUser.email,
      full_name: authUser.user_metadata?.full_name || authUser.full_name || authUser.displayName || '',
      avatar_url: authUser.user_metadata?.avatar_url || authUser.avatar_url || authUser.photoURL || null
    };
  };

  useEffect(() => {
    if (!isSupabaseConfigured) {
      const storedUser = getStoredUser();
      setUser(storedUser);
      setLoading(false);
      return;
    }

    // Check active sessions and set the user
    supabase.auth.getSession().then(({ data: { session } }) => {
      const sessionUser = session?.user ?? null;
      setUser(sessionUser);
      setStoredUser(normalizeUser(sessionUser));
      setLoading(false);
    });

    // Listen for changes on auth state (logged in, signed out, etc.)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      const sessionUser = session?.user ?? null;
      setUser(sessionUser);
      setStoredUser(normalizeUser(sessionUser));
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signUp = async ({ email, password, fullName }) => {
    try {
      if (!isSupabaseConfigured) {
        const demoUsers = getDemoUsers();
        const existing = demoUsers.find((item) => item.email === email);
        if (existing) {
          throw new Error('An account with this email already exists.');
        }

        const demoUser = {
          id: `demo-${Date.now()}`,
          email,
          full_name: fullName || '',
          password
        };

        demoUsers.push(demoUser);
        saveDemoUsers(demoUsers);
        const sessionUser = { id: demoUser.id, email: demoUser.email, full_name: demoUser.full_name };
        setUser(sessionUser);
        setStoredUser(sessionUser);

        return { data: { user: sessionUser }, error: null };
      }

      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
          },
        },
      });

      if (error) throw error;

      // Profile row is created by the database trigger in migrations.

      return { data, error: null };
    } catch (error) {
      return { data: null, error };
    }
  };

  const signIn = async ({ email, password }) => {
    try {
      if (!isSupabaseConfigured) {
        const demoUsers = getDemoUsers();
        const existing = demoUsers.find((item) => item.email === email);
        if (!existing || existing.password !== password) {
          throw new Error('Invalid email or password.');
        }

        const sessionUser = { id: existing.id, email: existing.email, full_name: existing.full_name };
        setUser(sessionUser);
        setStoredUser(sessionUser);
        return { data: { user: sessionUser }, error: null };
      }

      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      return { data: null, error };
    }
  };

  const signOut = async () => {
    try {
      if (!isSupabaseConfigured) {
        setUser(null);
        setStoredUser(null);
        return;
      }

      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      setStoredUser(null);
    } catch (error) {
      console.error('Error signing out:', error.message);
    }
  };

  const resetPassword = async (email) => {
    try {
      if (!isSupabaseConfigured) {
        throw new Error('Password reset requires Supabase to be configured.');
      }

      const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      return { data: null, error };
    }
  };

  const updatePassword = async (newPassword) => {
    try {
      if (!isSupabaseConfigured) {
        throw new Error('Password updates require Supabase to be configured.');
      }

      const { data, error } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      return { data: null, error };
    }
  };

  const value = {
    user,
    currentUser: user,
    isAuthenticated: Boolean(user),
    loading,
    signUp,
    signIn,
    signOut,
    resetPassword,
    updatePassword,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};