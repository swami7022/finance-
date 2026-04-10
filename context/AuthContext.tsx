/**
 * Authentication Context
 * Manages user login state, risk level, and account locked status
 */

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { getSession, saveSession, clearSession, getRiskLevel, saveRiskLevel, isAccountLocked, setAccountLocked } from '@/utils/storage';
import type { RiskLevel } from '@/utils/riskDetection';

export interface AuthContextType {
  isLoggedIn: boolean;
  email: string | null;
  userId: string | null;
  deviceId: string | null;
  riskLevel: RiskLevel;
  accountLocked: boolean;
  loading: boolean;
  
  // Auth methods
  login: (email: string, userId: string, deviceId: string, riskLevel: RiskLevel) => Promise<void>;
  logout: () => Promise<void>;
  
  // Risk methods
  setRiskLevel: (level: RiskLevel) => Promise<void>;
  
  // Account lock methods
  lockAccount: () => Promise<void>;
  unlockAccount: () => Promise<void>;
  
  // Check if user is at high risk
  isHighRisk: () => boolean;
  
  // Initialize from storage
  initializeAuth: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [email, setEmail] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [deviceId, setDeviceId] = useState<string | null>(null);
  const [riskLevel, setRiskLevelState] = useState<RiskLevel>('LOW');
  const [accountLocked, setAccountLockedState] = useState(false);
  const [loading, setLoading] = useState(true);

  // Initialize auth from storage on app start
  useEffect(() => {
    initializeAuth();
  }, []);

  const initializeAuth = async () => {
    try {
      const session = await getSession();
      const risk = (await getRiskLevel()) as RiskLevel;
      const locked = await isAccountLocked();

      if (session) {
        setIsLoggedIn(true);
        setEmail(session.email);
        setUserId(session.userId);
        setDeviceId(session.deviceId);
        setRiskLevelState(risk);
        setAccountLockedState(locked);
      }
    } catch (error) {
      console.error('Error initializing auth:', error);
    } finally {
      setLoading(false);
    }
  };

  const login = async (userEmail: string, userIdValue: string, deviceIdValue: string, risk: RiskLevel) => {
    try {
      const session = {
        email: userEmail,
        userId: userIdValue,
        deviceId: deviceIdValue,
        loginTime: new Date().toISOString(),
      };

      await saveSession(session);
      await saveRiskLevel(risk);

      setIsLoggedIn(true);
      setEmail(userEmail);
      setUserId(userIdValue);
      setDeviceId(deviceIdValue);
      setRiskLevelState(risk);
      setAccountLockedState(false);
    } catch (error) {
      console.error('Error during login:', error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await clearSession();
      setIsLoggedIn(false);
      setEmail(null);
      setUserId(null);
      setDeviceId(null);
      setRiskLevelState('LOW');
      setAccountLockedState(false);
    } catch (error) {
      console.error('Error during logout:', error);
      throw error;
    }
  };

  const setRiskLevelHandler = async (level: RiskLevel) => {
    try {
      await saveRiskLevel(level);
      setRiskLevelState(level);
    } catch (error) {
      console.error('Error setting risk level:', error);
      throw error;
    }
  };

  const lockAccount = async () => {
    try {
      await setAccountLocked(true);
      setAccountLockedState(true);
    } catch (error) {
      console.error('Error locking account:', error);
      throw error;
    }
  };

  const unlockAccount = async () => {
    try {
      await setAccountLocked(false);
      setAccountLockedState(false);
      // Reset risk level when unlocking
      await saveRiskLevel('LOW');
      setRiskLevelState('LOW');
    } catch (error) {
      console.error('Error unlocking account:', error);
      throw error;
    }
  };

  const isHighRisk = () => riskLevel === 'HIGH';

  const value: AuthContextType = {
    isLoggedIn,
    email,
    userId,
    deviceId,
    riskLevel,
    accountLocked,
    loading,
    login,
    logout,
    setRiskLevel: setRiskLevelHandler,
    lockAccount,
    unlockAccount,
    isHighRisk,
    initializeAuth,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
