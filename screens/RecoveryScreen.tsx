/**
 * Recovery Screen
 * Allows users to recover their account using backup email + OTP
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
  SafeAreaView,
  BackHandler,
} from 'react-native';
import { useAuth } from '@/context/AuthContext';
import { validateRecovery } from '@/utils/auth';
import { getMockUser, generateMockOTP, verifyMockOTP } from '@/utils/mockData';

interface RecoveryScreenProps {
  onRecoverySuccess: () => void;
  onBackToLogin: () => void;
}

export const RecoveryScreen: React.FC<RecoveryScreenProps> = ({
  onRecoverySuccess,
  onBackToLogin,
}) => {
  const [step, setStep] = useState<'email' | 'otp'>('email');
  const [email, setEmail] = useState('demo@example.com');
  const [backupEmail, setBackupEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [mockOTP, setMockOTP] = useState('');
  const { unlockAccount, login } = useAuth();

  // Handle hardware back button
  useEffect(() => {
    const backAction = () => {
      onBackToLogin();
      return true;
    };

    const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction);

    return () => backHandler.remove();
  }, [onBackToLogin]);

  const handleStartRecovery = async () => {
    setLoading(true);
    try {
      // Verify email exists
      const user = getMockUser(email);
      if (!user) {
        Alert.alert('Error', 'Account not found');
        setLoading(false);
        return;
      }

      // Generate OTP and move to OTP step
      const generatedOTP = generateMockOTP();
      setMockOTP(generatedOTP);

      Alert.alert(
        'Recovery Started',
        `An OTP has been sent to ${user.backupEmail}. Demo OTP: ${generatedOTP}`,
        [
          {
            text: 'Continue',
            onPress: () => setStep('otp'),
          },
        ]
      );
    } catch (error) {
      Alert.alert('Error', 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleRecovery = async () => {
    setLoading(true);
    try {
      if (!backupEmail.trim() || !otp.trim()) {
        Alert.alert('Error', 'Please enter backup email and OTP');
        setLoading(false);
        return;
      }

      // Validate recovery
      if (validateRecovery(email, backupEmail, otp)) {
        // Unlock account
        await unlockAccount();

        // Automatically login user
        const user = getMockUser(email);
        if (user) {
          const deviceId = `device_recovery_${Math.random().toString(36).substr(2, 9)}`;
          await login(email, user.id, deviceId, 'LOW');
        }

        Alert.alert(
          'Account Recovered',
          'Your account has been unlocked and you are logged in.',
          [
            {
              text: 'Continue',
              onPress: onRecoverySuccess,
            },
          ]
        );
      } else {
        Alert.alert('Recovery Failed', 'Invalid backup email or OTP');
      }
    } catch (error) {
      Alert.alert('Error', 'Recovery failed. Please try again.');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        {step === 'email' ? (
          <>
            <View style={styles.header}>
              <TouchableOpacity onPress={onBackToLogin} disabled={loading}>
                <Text style={styles.backButton}>← Back</Text>
              </TouchableOpacity>
              <Text style={styles.title}>Account Recovery</Text>
              <View style={{ width: 50 }} />
            </View>

            <View style={styles.infoBox}>
              <Text style={styles.infoIcon}>🔓</Text>
              <Text style={styles.infoTitle}>Recover Your Account</Text>
              <Text style={styles.infoText}>
                We'll send an OTP to your backup email to verify and unlock your account.
              </Text>
            </View>

            <View style={styles.form}>
              <Text style={styles.label}>Email Address</Text>
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

              <Text style={styles.helperText}>
                We'll verify this is your registered email
              </Text>

              <TouchableOpacity
                style={[styles.button, loading && styles.buttonDisabled]}
                onPress={handleStartRecovery}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator color="#FFF" />
                ) : (
                  <Text style={styles.buttonText}>Send OTP</Text>
                )}
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.cancelButton}
                onPress={onBackToLogin}
                disabled={loading}
              >
                <Text style={styles.cancelButtonText}>Back to Login</Text>
              </TouchableOpacity>
            </View>
          </>
        ) : (
          <>
            <View style={styles.header}>
              <TouchableOpacity
                onPress={() => setStep('email')}
                disabled={loading}
              >
                <Text style={styles.backButton}>← Back</Text>
              </TouchableOpacity>
              <Text style={styles.title}>Enter OTP</Text>
              <View style={{ width: 50 }} />
            </View>

            <View style={styles.infoBox}>
              <Text style={styles.infoIcon}>📧</Text>
              <Text style={styles.infoTitle}>Verify with OTP</Text>
              <Text style={styles.infoText}>
                An OTP has been sent to your backup email. Enter it below.
              </Text>
            </View>

            <View style={styles.form}>
              <Text style={styles.label}>Backup Email</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter backup email"
                placeholderTextColor="#999"
                keyboardType="email-address"
                autoCapitalize="none"
                value={backupEmail}
                onChangeText={setBackupEmail}
                editable={!loading}
              />

              <Text style={styles.label}>OTP Code</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter 6-digit OTP"
                placeholderTextColor="#999"
                keyboardType="number-pad"
                maxLength={6}
                value={otp}
                onChangeText={setOtp}
                editable={!loading}
              />

              <View style={styles.demoOtpBox}>
                <Text style={styles.demoOtpText}>Demo OTP: {mockOTP}</Text>
              </View>

              <TouchableOpacity
                style={[styles.button, loading && styles.buttonDisabled]}
                onPress={handleRecovery}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator color="#FFF" />
                ) : (
                  <Text style={styles.buttonText}>Unlock Account</Text>
                )}
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.cancelButton}
                onPress={onBackToLogin}
                disabled={loading}
              >
                <Text style={styles.cancelButtonText}>Back to Login</Text>
              </TouchableOpacity>
            </View>
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  content: {
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  backButton: {
    fontSize: 16,
    color: '#007AFF',
    fontWeight: '600',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  infoBox: {
    backgroundColor: '#E3F2FD',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginBottom: 24,
    borderLeftWidth: 4,
    borderLeftColor: '#007AFF',
  },
  infoIcon: {
    fontSize: 40,
    marginBottom: 12,
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1565C0',
    marginBottom: 8,
    textAlign: 'center',
  },
  infoText: {
    fontSize: 13,
    color: '#1565C0',
    textAlign: 'center',
    lineHeight: 18,
  },
  form: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 16,
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
  helperText: {
    fontSize: 12,
    color: '#999',
    marginTop: 6,
  },
  demoOtpBox: {
    backgroundColor: '#FFF9C4',
    borderRadius: 6,
    padding: 10,
    marginTop: 12,
    marginBottom: 16,
  },
  demoOtpText: {
    fontSize: 12,
    color: '#F57F17',
    fontWeight: '600',
  },
  button: {
    backgroundColor: '#4CAF50',
    borderRadius: 8,
    padding: 14,
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 8,
  },
  buttonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  cancelButton: {
    borderWidth: 1,
    borderColor: '#DDD',
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: '#666',
    fontSize: 14,
    fontWeight: '600',
  },
});
