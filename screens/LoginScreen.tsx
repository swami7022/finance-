/**
 * Login Screen
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from 'react-native';
import * as LocalAuthentication from 'expo-local-authentication';
import { useAuth } from '@/context/AuthContext';
import { validateLogin } from '@/utils/auth';
import { generateDeviceId, generateMockLocation, detectLoginRisk, registerDevice } from '@/utils/riskDetection';
import { getMockUser } from '@/utils/mockData';
import type { RiskLevel } from '@/utils/riskDetection';

interface LoginScreenProps {
  onNavigateToSignup: () => void;
  onNavigateToRecovery: () => void;
  onLoginSuccess: () => void;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({
  onNavigateToSignup,
  onNavigateToRecovery,
  onLoginSuccess,
}) => {
  const [email, setEmail] = useState('demo@example.com');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [biometricAvailable, setBiometricAvailable] = useState(false);
  const { login, setRiskLevel } = useAuth();

  // Check biometric availability on mount
  useEffect(() => {
    checkBiometricAvailability();
  }, []);

  const checkBiometricAvailability = async () => {
    const compatible = await LocalAuthentication.hasHardwareAsync();
    const enrolled = await LocalAuthentication.isEnrolledAsync();
    setBiometricAvailable(compatible && enrolled);
  };

  const handleBiometricLogin = async () => {
    try {
      const result = await LocalAuthentication.authenticateAsync({
        promptMessage: 'Login with Biometrics',
        fallbackLabel: 'Use Password',
      });

      if (result.success) {
        // Simulate biometric login with demo user
        const user = getMockUser('demo@example.com');
        if (user) {
          const deviceId = generateDeviceId();
          const location = generateMockLocation();
          const riskLevel = detectLoginRisk(deviceId, location) as RiskLevel;
          registerDevice(deviceId, location);

          await login('demo@example.com', user.id, deviceId, riskLevel);
          await setRiskLevel(riskLevel);
          onLoginSuccess();
        }
      } else {
        Alert.alert('Biometric Authentication Failed', 'Please try again or use password login.');
      }
    } catch (error) {
      Alert.alert('Error', 'Biometric authentication is not available on this device.');
    }
  };

  const handleLogin = async () => {
    setLoading(true);
    try {
      // Validate input
      if (!validateLogin(email, password)) {
        Alert.alert('Login Failed', 'Invalid email or password');
        setLoading(false);
        return;
      }

      // Get mock user
      const user = getMockUser(email);
      if (!user) {
        Alert.alert('Login Failed', 'User not found');
        setLoading(false);
        return;
      }

      // Generate device info and detect risk
      const deviceId = generateDeviceId();
      const location = generateMockLocation();
      const riskLevel = detectLoginRisk(deviceId, location) as RiskLevel;
      registerDevice(deviceId, location);

      // Save auth state
      await login(email, user.id, deviceId, riskLevel);
      await setRiskLevel(riskLevel);

      // Show alert if high risk
      if (riskLevel === 'HIGH') {
        Alert.alert(
          '⚠️ Suspicious Login Detected',
          'New device or location detected. Additional verification required.',
          [{ text: 'Continue to Verification', onPress: onLoginSuccess }]
        );
      } else {
        Alert.alert('Login Successful', 'Welcome back!', [{ text: 'OK', onPress: onLoginSuccess }]);
      }
    } catch (error) {
      Alert.alert('Error', 'An error occurred during login');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <Text style={styles.title}>🔐 Secure Finance</Text>
        <Text style={styles.subtitle}>Recovery App</Text>
      </View>

      <View style={styles.form}>
        <Text style={styles.label}>Email</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter your email"
          placeholderTextColor="#999"
          keyboardType="email-address"
          autoCapitalize="none"
          value={email}
          onChangeText={setEmail}
          editable={!loading}
        />

        <Text style={styles.label}>Password</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter your password"
          placeholderTextColor="#999"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
          editable={!loading}
        />

        <TouchableOpacity
          style={[styles.loginButton, loading && styles.buttonDisabled]}
          onPress={handleLogin}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#FFF" />
          ) : (
            <Text style={styles.buttonText}>Login</Text>
          )}
        </TouchableOpacity>

        {biometricAvailable && (
          <TouchableOpacity
            style={[styles.biometricButton, loading && styles.buttonDisabled]}
            onPress={handleBiometricLogin}
            disabled={loading}
          >
            <Text style={styles.biometricButtonText}>🔐 Login with Biometrics</Text>
          </TouchableOpacity>
        )}

        <View style={styles.divider}>
          <View style={styles.line} />
          <Text style={styles.dividerText}>or</Text>
          <View style={styles.line} />
        </View>

        <TouchableOpacity
          style={styles.secondaryButton}
          onPress={onNavigateToSignup}
          disabled={loading}
        >
          <Text style={styles.secondaryButtonText}>Create New Account</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.linkButton}
          onPress={onNavigateToRecovery}
          disabled={loading}
        >
          <Text style={styles.linkText}>Account Locked? Recover Here</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>Demo Credentials:</Text>
        <Text style={styles.demoText}>Email: demo@example.com</Text>
        <Text style={styles.demoText}>Password: any password (6+ chars)</Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  content: {
    padding: 20,
    justifyContent: 'space-between',
    minHeight: '100%',
  },
  header: {
    alignItems: 'center',
    marginTop: 40,
    marginBottom: 40,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
  },
  form: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
    marginTop: 12,
  },
  input: {
    borderWidth: 1,
    borderColor: '#DDD',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: '#333',
  },
  loginButton: {
    backgroundColor: '#007AFF',
    borderRadius: 8,
    padding: 14,
    alignItems: 'center',
    marginTop: 24,
  },
  buttonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  biometricButton: {
    backgroundColor: '#28A745',
    borderRadius: 8,
    padding: 14,
    alignItems: 'center',
    marginTop: 12,
  },
  biometricButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 20,
  },
  line: {
    flex: 1,
    height: 1,
    backgroundColor: '#DDD',
  },
  dividerText: {
    marginHorizontal: 12,
    color: '#999',
  },
  secondaryButton: {
    borderWidth: 1,
    borderColor: '#007AFF',
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
  },
  secondaryButtonText: {
    color: '#007AFF',
    fontSize: 14,
    fontWeight: '600',
  },
  linkButton: {
    marginTop: 16,
    alignItems: 'center',
  },
  linkText: {
    color: '#FF6B6B',
    fontSize: 14,
    fontWeight: '500',
  },
  footer: {
    backgroundColor: '#FFF3CD',
    borderRadius: 8,
    padding: 16,
    marginTop: 20,
  },
  footerText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#856404',
    marginBottom: 8,
  },
  demoText: {
    fontSize: 12,
    color: '#856404',
    marginBottom: 4,
  },
});
