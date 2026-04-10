/**
 * Root App Component
 * Main orchestrator for all screens and navigation
 */

import React, { useState, useEffect } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { AuthProvider, useAuth } from '@/context/AuthContext';
import { LoginScreen } from '@/screens/LoginScreen';
import { SignUpScreen } from '@/screens/SignUpScreen';
import { DashboardScreen } from '@/screens/DashboardScreen';
import { OTPVerificationScreen } from '@/screens/OTPVerificationScreen';
import { SendMoneyScreen } from '@/screens/SendMoneyScreen';
import { EmergencyModeScreen } from '@/screens/EmergencyModeScreen';
import { RecoveryScreen } from '@/screens/RecoveryScreen';
import { TrustedDevicesScreen } from '@/screens/TrustedDevicesScreen';
import { SettingsScreen } from '@/screens/SettingsScreen';
import { SavingsGoalsScreen } from '@/screens/SavingsGoalsScreen';
import { AIInsightsScreen } from '@/screens/AIInsightsScreen';
import { AchievementsScreen } from '@/screens/AchievementsScreen';
import { CarbonFootprintScreen } from '@/screens/CarbonFootprintScreen';

type AppScreen =
  | 'login'
  | 'signup'
  | 'recovery'
  | 'otp-verification'
  | 'dashboard'
  | 'send-money'
  | 'emergency'
  | 'trusted-devices'
  | 'settings'
  | 'savings-goals'
  | 'ai-insights'
  | 'achievements'
  | 'carbon-footprint'
  | 'account-locked';

/**
 * AppContent Component - Handles screen routing
 */
const AppContent: React.FC = () => {
  const { isLoggedIn, accountLocked, isHighRisk, loading, initializeAuth } = useAuth();
  const [currentScreen, setCurrentScreen] = useState<AppScreen>('login');

  // Initialize auth on mount
  useEffect(() => {
    initializeAuth();
  }, []);

  // Update screen based on auth state
  useEffect(() => {
    if (loading) return;

    if (accountLocked) {
      setCurrentScreen('account-locked');
    } else if (isLoggedIn) {
      if (isHighRisk()) {
        setCurrentScreen('otp-verification');
      } else {
        setCurrentScreen('dashboard');
      }
    } else {
      setCurrentScreen('login');
    }
  }, [isLoggedIn, accountLocked, isHighRisk, loading]);

  // Show loading screen
  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#F5F5F5' }}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  // Render appropriate screen
  switch (currentScreen) {
    case 'login':
      return (
        <LoginScreen
          onNavigateToSignup={() => setCurrentScreen('signup')}
          onNavigateToRecovery={() => setCurrentScreen('recovery')}
          onLoginSuccess={() => {
            // Will update based on auth state effect
          }}
        />
      );

    case 'signup':
      return (
        <SignUpScreen
          onSignupSuccess={() => setCurrentScreen('login')}
          onBackToLogin={() => setCurrentScreen('login')}
        />
      );

    case 'recovery':
      return (
        <RecoveryScreen
          onRecoverySuccess={() => setCurrentScreen('dashboard')}
          onBackToLogin={() => setCurrentScreen('login')}
        />
      );

    case 'otp-verification':
      return (
        <OTPVerificationScreen
          onVerificationSuccess={() => setCurrentScreen('dashboard')}
          onCancel={() => setCurrentScreen('login')}
        />
      );

    case 'dashboard':
      return (
        <DashboardScreen
          onSendMoney={() => setCurrentScreen('send-money')}
          onEmergency={() => setCurrentScreen('emergency')}
          onLogout={() => setCurrentScreen('login')}
          onViewDevices={() => setCurrentScreen('trusted-devices')}
          onSettings={() => setCurrentScreen('settings')}
          onSavingsGoals={() => setCurrentScreen('savings-goals')}
          onAIInsights={() => setCurrentScreen('ai-insights')}
          onAchievements={() => setCurrentScreen('achievements')}
          onCarbonFootprint={() => setCurrentScreen('carbon-footprint')}
        />
      );

    case 'send-money':
      return (
        <SendMoneyScreen
          onSuccess={() => setCurrentScreen('dashboard')}
          onCancel={() => setCurrentScreen('dashboard')}
        />
      );

    case 'emergency':
      return (
        <EmergencyModeScreen
          onLockAccount={() => setCurrentScreen('account-locked')}
          onCancel={() => setCurrentScreen('dashboard')}
        />
      );

    case 'trusted-devices':
      return (
        <TrustedDevicesScreen
          onClose={() => setCurrentScreen('dashboard')}
        />
      );

    case 'settings':
      return (
        <SettingsScreen
          onClose={() => setCurrentScreen('dashboard')}
        />
      );

    case 'savings-goals':
      return (
        <SavingsGoalsScreen
          onClose={() => setCurrentScreen('dashboard')}
        />
      );

    case 'ai-insights':
      return (
        <AIInsightsScreen
          onClose={() => setCurrentScreen('dashboard')}
        />
      );

    case 'achievements':
      return (
        <AchievementsScreen
          onClose={() => setCurrentScreen('dashboard')}
        />
      );

    case 'carbon-footprint':
      return (
        <CarbonFootprintScreen
          onClose={() => setCurrentScreen('dashboard')}
        />
      );

    case 'account-locked':
      return (
        <RecoveryScreen
          onRecoverySuccess={() => setCurrentScreen('dashboard')}
          onBackToLogin={() => setCurrentScreen('login')}
        />
      );

    default:
      return (
        <LoginScreen
          onNavigateToSignup={() => setCurrentScreen('signup')}
          onNavigateToRecovery={() => setCurrentScreen('recovery')}
          onLoginSuccess={() => {}}
        />
      );
  }
};

/**
 * Root App Component
 */
export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
