/**
 * Send Money Screen
 * Allows users to send money (blocked if high risk)
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
  SafeAreaView,
  ActivityIndicator,
  BackHandler,
} from 'react-native';
import { useAuth } from '@/context/AuthContext';
import { getMockUser } from '@/utils/mockData';
import { sendTransactionNotification, requestNotificationPermissions } from '@/utils/notifications';

interface SendMoneyScreenProps {
  onSuccess: () => void;
  onCancel: () => void;
}

export const SendMoneyScreen: React.FC<SendMoneyScreenProps> = ({ onSuccess, onCancel }) => {
  const [recipientName, setRecipientName] = useState('');
  const [upiId, setUpiId] = useState('');
  const [amount, setAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'name' | 'upi'>('name');
  const [loading, setLoading] = useState(false);
  const { email, isHighRisk } = useAuth();
  const [userBalance, setUserBalance] = useState(0);

  useEffect(() => {
    if (email) {
      const user = getMockUser(email);
      if (user) {
        setUserBalance(user.balance);
      }
    }
  }, [email]);

  // Handle hardware back button
  useEffect(() => {
    const backAction = () => {
      onCancel();
      return true;
    };

    const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction);

    return () => backHandler.remove();
  }, [onCancel]);

  const handleSendMoney = async () => {
    // Check if high risk
    if (isHighRisk()) {
      Alert.alert(
        '🚫 Transaction Blocked',
        'Transactions are blocked due to suspicious activity. Complete OTP verification first.'
      );
      return;
    }

    const recipient = paymentMethod === 'upi' ? upiId : recipientName;

    if (!recipient.trim() || !amount.trim()) {
      Alert.alert('Error', `Please enter ${paymentMethod === 'upi' ? 'UPI ID' : 'recipient name'} and amount`);
      return;
    }

    if (paymentMethod === 'upi' && !upiId.includes('@')) {
      Alert.alert('Error', 'Please enter a valid UPI ID (e.g., name@paytm)');
      return;
    }

    const amountNum = parseFloat(amount);
    if (isNaN(amountNum) || amountNum <= 0) {
      Alert.alert('Error', 'Please enter a valid amount');
      return;
    }

    if (amountNum > userBalance) {
      Alert.alert('Error', 'Insufficient balance');
      return;
    }

    setLoading(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));

      const successMessage = paymentMethod === 'upi'
        ? `₹${amountNum.toLocaleString('en-IN')} sent to ${upiId}`
        : `₹${amountNum.toLocaleString('en-IN')} sent to ${recipientName}`;

      Alert.alert('Success', successMessage, [
        {
          text: 'OK',
          onPress: async () => {
            // Send notification
            await requestNotificationPermissions();
            await sendTransactionNotification(amountNum, recipient, 'sent');
            onSuccess();
          },
        },
      ]);

      setRecipientName('');
      setUpiId('');
      setAmount('');
    } catch (error) {
      Alert.alert('Error', 'Transaction failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <TouchableOpacity onPress={onCancel}>
            <Text style={styles.closeButton}>✕</Text>
          </TouchableOpacity>
          <Text style={styles.title}>Send Money</Text>
          <View style={{ width: 24 }} />
        </View>

        <View style={styles.balanceBox}>
          <Text style={styles.balanceLabel}>Available Balance</Text>
          <Text style={styles.balance}>₹{userBalance.toLocaleString('en-IN')}</Text>
        </View>

        <View style={styles.paymentMethodBox}>
          <Text style={styles.formLabel}>Payment Method</Text>
          <View style={styles.methodButtons}>
            <TouchableOpacity
              style={[styles.methodButton, paymentMethod === 'name' && styles.methodButtonActive]}
              onPress={() => setPaymentMethod('name')}
            >
              <Text style={[styles.methodButtonText, paymentMethod === 'name' && styles.methodButtonTextActive]}>
                👤 By Name
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.methodButton, paymentMethod === 'upi' && styles.methodButtonActive]}
              onPress={() => setPaymentMethod('upi')}
            >
              <Text style={[styles.methodButtonText, paymentMethod === 'upi' && styles.methodButtonTextActive]}>
                📱 UPI ID
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.form}>
          {paymentMethod === 'name' ? (
            <>
              <Text style={styles.formLabel}>Recipient Name</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter recipient name"
                placeholderTextColor="#999"
                value={recipientName}
                onChangeText={setRecipientName}
                editable={!loading}
              />
            </>
          ) : (
            <>
              <Text style={styles.formLabel}>UPI ID</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter UPI ID (e.g., name@paytm)"
                placeholderTextColor="#999"
                value={upiId}
                onChangeText={setUpiId}
                editable={!loading}
                autoCapitalize="none"
              />
              <View style={styles.upiApps}>
                <Text style={styles.upiAppsTitle}>Popular UPI Apps:</Text>
                <View style={styles.upiAppsList}>
                  <Text style={styles.upiApp}>📱 Paytm</Text>
                  <Text style={styles.upiApp}>🏦 PhonePe</Text>
                  <Text style={styles.upiApp}>💰 Google Pay</Text>
                  <Text style={styles.upiApp}>🏛️ BHIM</Text>
                </View>
              </View>
            </>
          )}

          <Text style={styles.formLabel}>Amount (₹)</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter amount"
            placeholderTextColor="#999"
            keyboardType="decimal-pad"
            value={amount}
            onChangeText={setAmount}
            editable={!loading}
          />

          <View style={styles.feeInfo}>
            <Text style={styles.feeText}>Transaction Fee: Free</Text>
          </View>

          <TouchableOpacity
            style={[styles.sendButton, loading && styles.buttonDisabled]}
            onPress={handleSendMoney}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#FFF" />
            ) : (
              <Text style={styles.sendButtonText}>Send Money</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.cancelButton}
            onPress={onCancel}
            disabled={loading}
          >
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.securityBox}>
          <Text style={styles.securityTitle}>🔒 Safe & Secure</Text>
          <Text style={styles.securityText}>
            All transactions are encrypted and protected. You'll receive a confirmation after
            sending.
          </Text>
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
  balanceBox: {
    backgroundColor: '#007AFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
  },
  balanceLabel: {
    color: '#FFF',
    fontSize: 12,
    opacity: 0.8,
  },
  balance: {
    color: '#FFF',
    fontSize: 32,
    fontWeight: 'bold',
    marginTop: 8,
  },
  form: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
  },
  formLabel: {
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
  feeInfo: {
    backgroundColor: '#F0F0F0',
    borderRadius: 6,
    padding: 10,
    marginTop: 16,
    marginBottom: 16,
  },
  feeText: {
    fontSize: 13,
    color: '#666',
    fontWeight: '500',
  },
  sendButton: {
    backgroundColor: '#4CAF50',
    borderRadius: 8,
    padding: 14,
    alignItems: 'center',
    marginBottom: 8,
  },
  sendButtonText: {
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
    fontSize: 16,
    fontWeight: '600',
  },
  securityBox: {
    backgroundColor: '#E8F5E9',
    borderRadius: 8,
    padding: 12,
  },
  securityTitle: {
    color: '#2E7D32',
    fontWeight: '600',
    marginBottom: 6,
  },
  securityText: {
    color: '#2E7D32',
    fontSize: 12,
    lineHeight: 16,
  },
  paymentMethodBox: {
    backgroundColor: '#FFF',
    padding: 20,
    borderRadius: 12,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  methodButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  methodButton: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#E0E0E0',
    alignItems: 'center',
  },
  methodButtonActive: {
    borderColor: '#1976D2',
    backgroundColor: '#E3F2FD',
  },
  methodButtonText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  methodButtonTextActive: {
    color: '#1976D2',
    fontWeight: 'bold',
  },
  upiApps: {
    marginTop: 12,
    marginBottom: 8,
  },
  upiAppsTitle: {
    fontSize: 12,
    color: '#666',
    marginBottom: 8,
  },
  upiAppsList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  upiApp: {
    fontSize: 12,
    color: '#1976D2',
    backgroundColor: '#F0F8FF',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
});
