/**
 * Emergency Mode Screen
 * "I Lost My Phone" feature - locks account and requires recovery
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
  SafeAreaView,
  ActivityIndicator,
  BackHandler,
} from 'react-native';
import { useAuth } from '@/context/AuthContext';

interface EmergencyModeScreenProps {
  onLockAccount: () => void;
  onCancel: () => void;
}

export const EmergencyModeScreen: React.FC<EmergencyModeScreenProps> = ({
  onLockAccount,
  onCancel,
}) => {
  const [loading, setLoading] = useState(false);
  const [confirmed, setConfirmed] = useState(false);
  const { lockAccount, logout } = useAuth();

  // Handle hardware back button
  useEffect(() => {
    const backAction = () => {
      onCancel();
      return true;
    };

    const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction);

    return () => backHandler.remove();
  }, [onCancel]);

  const handleLockAccount = async () => {
    setLoading(true);
    try {
      await lockAccount();
      await logout();

      Alert.alert(
        'Account Locked Successfully',
        'Your account has been locked. Use the recovery option to unlock it.',
        [
          {
            text: 'OK',
            onPress: onLockAccount,
          },
        ]
      );
    } catch (error) {
      Alert.alert('Error', 'Failed to lock account. Please try again.');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <TouchableOpacity onPress={onCancel} disabled={loading}>
            <Text style={styles.closeButton}>✕</Text>
          </TouchableOpacity>
          <Text style={styles.title}>Emergency Mode</Text>
          <View style={{ width: 24 }} />
        </View>

        <View style={styles.warningBox}>
          <Text style={styles.warningIcon}>🆘</Text>
          <Text style={styles.warningTitle}>I Lost My Phone</Text>
          <Text style={styles.warningText}>
            This will immediately lock your account and logout from this device to protect your
            funds.
          </Text>
        </View>

        <View style={styles.importantBox}>
          <Text style={styles.importantTitle}>⚠️ Important</Text>
          <Text style={styles.importantText}>
            • Your account will be locked immediately{'\n'}• You'll be logged out from this
            device{'\n'}• Use recovery to unlock your account{'\n'}• This action cannot be undone
            quickly
          </Text>
        </View>

        <View style={styles.recoveryInfo}>
          <Text style={styles.recoveryTitle}>📧 Recovery Method</Text>
          <Text style={styles.recoveryText}>
            You can recover your account using your backup email. An OTP will be sent to unlock
            your account.
          </Text>
        </View>

        <View style={styles.confirmBox}>
          <TouchableOpacity
            style={styles.checkbox}
            onPress={() => setConfirmed(!confirmed)}
            disabled={loading}
          >
            <View style={[styles.checkboxSquare, confirmed && styles.checkboxSquareChecked]}>
              {confirmed && <Text style={styles.checkmark}>✓</Text>}
            </View>
            <Text style={styles.checkboxText}>I understand and want to lock my account</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={[styles.lockButton, (!confirmed || loading) && styles.buttonDisabled]}
          onPress={handleLockAccount}
          disabled={!confirmed || loading}
        >
          {loading ? (
            <ActivityIndicator color="#FFF" />
          ) : (
            <Text style={styles.lockButtonText}>Lock Account Now</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.cancelButton}
          onPress={onCancel}
          disabled={loading}
        >
          <Text style={styles.cancelButtonText}>Cancel</Text>
        </TouchableOpacity>

        <View style={styles.contactBox}>
          <Text style={styles.contactTitle}>Need Help?</Text>
          <Text style={styles.contactText}>Contact support@finanapp.com</Text>
        </View>
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
    marginBottom: 24,
  },
  closeButton: {
    fontSize: 24,
    color: '#666',
    fontWeight: 'bold',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  warningBox: {
    backgroundColor: '#FFEBEE',
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
    alignItems: 'center',
    borderLeftWidth: 4,
    borderLeftColor: '#FF6B6B',
  },
  warningIcon: {
    fontSize: 48,
    marginBottom: 12,
  },
  warningTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#C62828',
    marginBottom: 8,
  },
  warningText: {
    fontSize: 14,
    color: '#C62828',
    textAlign: 'center',
    lineHeight: 20,
  },
  importantBox: {
    backgroundColor: '#FFF3CD',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#FF9800',
  },
  importantTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#856404',
    marginBottom: 8,
  },
  importantText: {
    fontSize: 13,
    color: '#856404',
    lineHeight: 18,
  },
  recoveryInfo: {
    backgroundColor: '#E8F5E9',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },
  recoveryTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2E7D32',
    marginBottom: 8,
  },
  recoveryText: {
    fontSize: 13,
    color: '#2E7D32',
    lineHeight: 18,
  },
  confirmBox: {
    backgroundColor: '#FFF',
    borderRadius: 8,
    padding: 12,
    marginBottom: 20,
  },
  checkbox: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkboxSquare: {
    width: 24,
    height: 24,
    borderWidth: 2,
    borderColor: '#DDD',
    borderRadius: 4,
    marginRight: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxSquareChecked: {
    backgroundColor: '#FF6B6B',
    borderColor: '#FF6B6B',
  },
  checkmark: {
    color: '#FFF',
    fontWeight: 'bold',
  },
  checkboxText: {
    flex: 1,
    fontSize: 14,
    color: '#333',
  },
  lockButton: {
    backgroundColor: '#FF6B6B',
    borderRadius: 8,
    padding: 14,
    alignItems: 'center',
    marginBottom: 8,
  },
  lockButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  cancelButton: {
    borderWidth: 1,
    borderColor: '#DDD',
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
    marginBottom: 20,
  },
  cancelButtonText: {
    color: '#666',
    fontSize: 16,
    fontWeight: '600',
  },
  contactBox: {
    backgroundColor: '#F0F0F0',
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
  },
  contactTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: '#666',
  },
  contactText: {
    fontSize: 12,
    color: '#999',
    marginTop: 4,
  },
});
