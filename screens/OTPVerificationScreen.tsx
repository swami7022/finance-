/**
 * OTP Verification Screen
 * shown when user logs in from a new device or location (HIGH RISK)
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
  ScrollView,
  BackHandler,
} from 'react-native';
import { verifyMockOTP, generateMockOTP } from '@/utils/mockData';
import { useAuth } from '@/context/AuthContext';

interface OTPVerificationScreenProps {
  onVerificationSuccess: () => void;
  onCancel: () => void;
}

export const OTPVerificationScreen: React.FC<OTPVerificationScreenProps> = ({
  onVerificationSuccess,
  onCancel,
}) => {
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [mockOTP, setMockOTP] = useState('');
  const [timer, setTimer] = useState(60);
  const { setRiskLevel } = useAuth();

  // Generate mock OTP on mount
  useEffect(() => {
    const generatedOTP = generateMockOTP();
    setMockOTP(generatedOTP);
  }, []);

  // Timer countdown
  useEffect(() => {
    if (timer > 0) {
      const interval = setTimeout(() => setTimer(timer - 1), 1000);
      return () => clearTimeout(interval);
    }
  }, [timer]);

  // Handle hardware back button
  useEffect(() => {
    const backAction = () => {
      onCancel();
      return true;
    };

    const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction);

    return () => backHandler.remove();
  }, [onCancel]);

  const handleVerifyOTP = async () => {
    setLoading(true);
    try {
      if (!otp.trim()) {
        Alert.alert('Error', 'Please enter the OTP');
        setLoading(false);
        return;
      }

      // Verify OTP against the generated demo OTP
      if (otp === mockOTP) {
        // Mark as LOW RISK after successful OTP verification
        await setRiskLevel('LOW');

        Alert.alert('Verification Successful', 'Your device has been verified', [
          {
            text: 'Continue',
            onPress: onVerificationSuccess,
          },
        ]);
      } else {
        Alert.alert('Invalid OTP', 'The OTP you entered is incorrect');
      }
    } catch (error) {
      Alert.alert('Error', 'An error occurred during verification');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleResendOTP = () => {
    const newOTP = generateMockOTP();
    setMockOTP(newOTP);
    setTimer(60);
    Alert.alert('OTP Resent', 'A new OTP has been generated');
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <Text style={styles.warningIcon}>⚠️</Text>
        <Text style={styles.title}>Verify Your Device</Text>
        <Text style={styles.subtitle}>
          We detected a login from a new device or location. Please verify to continue.
        </Text>
      </View>

      <View style={styles.form}>
        <View style={styles.infoBox}>
          <Text style={styles.infoTitle}>An OTP has been sent to your backup email</Text>
          <Text style={styles.infoText}>
            This is for demonstration. The demo OTP is: <Text style={styles.demoOTP}>{mockOTP}</Text>
          </Text>
        </View>

        <Text style={styles.label}>Enter OTP</Text>
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

        <TouchableOpacity
          style={[styles.verifyButton, loading && styles.buttonDisabled]}
          onPress={handleVerifyOTP}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#FFF" />
          ) : (
            <Text style={styles.buttonText}>Verify OTP</Text>
          )}
        </TouchableOpacity>

        <View style={styles.resendContainer}>
          {timer > 0 ? (
            <Text style={styles.timerText}>Resend OTP in {timer}s</Text>
          ) : (
            <TouchableOpacity onPress={handleResendOTP}>
              <Text style={styles.resendText}>Resend OTP</Text>
            </TouchableOpacity>
          )}
        </View>

        <TouchableOpacity
          style={styles.cancelButton}
          onPress={onCancel}
          disabled={loading}
        >
          <Text style={styles.cancelButtonText}>Cancel</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.securityInfo}>
        <Text style={styles.securityTitle}>🔒 Why this extra step?</Text>
        <Text style={styles.securityText}>
          Your account security is important. We verify logins from new devices to protect your funds.
        </Text>
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
  },
  header: {
    alignItems: 'center',
    marginBottom: 30,
    marginTop: 20,
  },
  warningIcon: {
    fontSize: 48,
    marginBottom: 12,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    lineHeight: 20,
  },
  form: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
  },
  infoBox: {
    backgroundColor: '#FFF3CD',
    borderRadius: 8,
    padding: 12,
    marginBottom: 20,
    borderLeftWidth: 4,
    borderLeftColor: '#FF9800',
  },
  infoTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#856404',
    marginBottom: 4,
  },
  infoText: {
    fontSize: 12,
    color: '#856404',
    lineHeight: 18,
  },
  demoOTP: {
    fontWeight: 'bold',
    backgroundColor: '#FFE082',
    paddingHorizontal: 4,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#DDD',
    borderRadius: 8,
    padding: 12,
    fontSize: 18,
    textAlign: 'center',
    letterSpacing: 2,
    color: '#333',
  },
  verifyButton: {
    backgroundColor: '#4CAF50',
    borderRadius: 8,
    padding: 14,
    alignItems: 'center',
    marginTop: 20,
  },
  buttonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  resendContainer: {
    alignItems: 'center',
    marginTop: 16,
  },
  timerText: {
    fontSize: 14,
    color: '#999',
  },
  resendText: {
    fontSize: 14,
    color: '#007AFF',
    fontWeight: '600',
  },
  cancelButton: {
    borderWidth: 1,
    borderColor: '#DDD',
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
    marginTop: 12,
  },
  cancelButtonText: {
    color: '#666',
    fontSize: 14,
    fontWeight: '600',
  },
  securityInfo: {
    backgroundColor: '#E8F5E9',
    borderRadius: 8,
    padding: 16,
  },
  securityTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2E7D32',
    marginBottom: 8,
  },
  securityText: {
    fontSize: 13,
    color: '#2E7D32',
    lineHeight: 18,
  },
});
