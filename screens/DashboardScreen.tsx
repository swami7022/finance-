/**
 * Dashboard Screen
 * Shows user balance, recent transactions, and send money option
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Alert,
  SafeAreaView,
  RefreshControl,
} from 'react-native';
import { useAuth } from '@/context/AuthContext';
import { getMockUser, getMockTransactions, type Transaction } from '@/utils/mockData';
import { getKnownDevices } from '@/utils/riskDetection';

interface DashboardScreenProps {
  onSendMoney: () => void;
  onEmergency: () => void;
  onLogout: () => void;
  onViewDevices: () => void;
  onSettings: () => void;
  onSavingsGoals: () => void;
  onAIInsights: () => void;
  onAchievements: () => void;
  onCarbonFootprint: () => void;
}

export const DashboardScreen: React.FC<DashboardScreenProps> = ({
  onSendMoney,
  onEmergency,
  onLogout,
  onViewDevices,
  onSettings,
  onSavingsGoals,
  onAIInsights,
  onAchievements,
  onCarbonFootprint,
}) => {
  const { email, isHighRisk, logout } = useAuth();
  const [balance, setBalance] = useState(0);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [userName, setUserName] = useState('');

  useEffect(() => {
    loadData();
  }, [email]);

  const loadData = () => {
    if (email) {
      const user = getMockUser(email);
      const txns = getMockTransactions(email);

      if (user) {
        setUserName(user.name);
        setBalance(user.balance);
      }
      setTransactions(txns);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    loadData();
    setRefreshing(false);
  };

  const handleSendMoney = () => {
    if (isHighRisk()) {
      Alert.alert(
        '🚫 Transaction Blocked',
        'Transactions are blocked due to suspicious activity. Complete verification first.'
      );
    } else {
      onSendMoney();
    }
  };

  const handleLogout = () => {
    Alert.alert('Logout', 'Are you sure you want to logout?', [
      { text: 'Cancel', onPress: () => {} },
      {
        text: 'Logout',
        onPress: async () => {
          await logout();
          onLogout();
        },
        style: 'destructive',
      },
    ]);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Welcome, {userName}</Text>
            <Text style={styles.email}>{email}</Text>
          </View>
          <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
            <Text style={styles.logoutText}>Logout</Text>
          </TouchableOpacity>
        </View>

        {/* Risk Status Alert */}
        {isHighRisk() && (
          <View style={styles.riskAlert}>
            <Text style={styles.riskAlertTitle}>⚠️ HIGH RISK DETECTED</Text>
            <Text style={styles.riskAlertText}>
              Your account is in high-risk mode. Complete OTP verification to enable transactions.
            </Text>
          </View>
        )}

        {/* Balance Card */}
        <View style={[styles.balanceCard, isHighRisk() && styles.balanceCardHighRisk]}>
          <Text style={styles.balanceLabel}>Total Balance</Text>
          <Text style={styles.balanceAmount}>₹{balance.toLocaleString('en-IN')}</Text>
          <Text style={styles.balanceSubtext}>Available for transactions</Text>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionButtons}>
          <TouchableOpacity
            style={[styles.actionButton, isHighRisk() && styles.actionButtonDisabled]}
            onPress={handleSendMoney}
            disabled={isHighRisk()}
          >
            <Text style={styles.actionIcon}>💸</Text>
            <Text style={styles.actionLabel}>Send Money</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionButton} onPress={onViewDevices}>
            <Text style={styles.actionIcon}>📱</Text>
            <Text style={styles.actionLabel}>Trusted Devices</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionButton, styles.emergencyButton]}
            onPress={onEmergency}
          >
            <Text style={styles.actionIcon}>🆘</Text>
            <Text style={styles.actionLabel}>Emergency</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionButton} onPress={onSettings}>
            <Text style={styles.actionIcon}>⚙️</Text>
            <Text style={styles.actionLabel}>Settings</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionButton} onPress={onSavingsGoals}>
            <Text style={styles.actionIcon}>🎯</Text>
            <Text style={styles.actionLabel}>Savings Goals</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionButton} onPress={onAIInsights}>
            <Text style={styles.actionIcon}>🤖</Text>
            <Text style={styles.actionLabel}>AI Insights</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionButton} onPress={onAchievements}>
            <Text style={styles.actionIcon}>🏆</Text>
            <Text style={styles.actionLabel}>Achievements</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionButton} onPress={onCarbonFootprint}>
            <Text style={styles.actionIcon}>🌱</Text>
            <Text style={styles.actionLabel}>Carbon Footprint</Text>
          </TouchableOpacity>
        </View>

        {/* Recent Transactions */}
        <View style={styles.transactionsSection}>
          <Text style={styles.sectionTitle}>Recent Transactions</Text>

          {transactions.length > 0 ? (
            transactions.slice(0, 5).map((txn) => (
              <View key={txn.id} style={styles.transactionItem}>
                <View style={styles.transactionLeft}>
                  <View>
                    <Text style={styles.transactionType}>
                      {txn.type === 'send' ? '➡️ Sent to' : '⬅️ Received from'}
                    </Text>
                    <Text style={styles.transactionRecipient}>{txn.recipient}</Text>
                  </View>
                  <Text style={styles.transactionDate}>{txn.date}</Text>
                </View>
                <View style={styles.transactionRight}>
                  <Text
                    style={[
                      styles.transactionAmount,
                      txn.type === 'send' ? styles.amountNegative : styles.amountPositive,
                    ]}
                  >
                    {txn.type === 'send' ? '- ' : '+ '}${txn.amount.toFixed(2)}
                  </Text>
                  <Text style={styles.transactionStatus}>{txn.status}</Text>
                </View>
              </View>
            ))
          ) : (
            <Text style={styles.noTransactions}>No transactions yet</Text>
          )}
        </View>

        {/* Security Info */}
        <View style={styles.securityInfo}>
          <Text style={styles.securityTitle}>🔒 Security Tips</Text>
          <Text style={styles.securityTip}>
            • Never share your password with anyone{'\n'}• Use a strong, unique password{'\n'}•
            Verify logins from new devices
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
  scrollContent: {
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  greeting: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1a1a1a',
  },
  email: {
    fontSize: 12,
    color: '#999',
    marginTop: 4,
  },
  logoutButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: '#FFE5E5',
    borderRadius: 6,
  },
  logoutText: {
    color: '#FF6B6B',
    fontWeight: '600',
    fontSize: 12,
  },
  riskAlert: {
    backgroundColor: '#FFEBEE',
    borderLeftWidth: 4,
    borderLeftColor: '#FF6B6B',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  riskAlertTitle: {
    color: '#C62828',
    fontWeight: '600',
    marginBottom: 4,
  },
  riskAlertText: {
    color: '#C62828',
    fontSize: 12,
    lineHeight: 16,
  },
  balanceCard: {
    backgroundColor: '#007AFF',
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
  },
  balanceCardHighRisk: {
    backgroundColor: '#FF9800',
  },
  balanceLabel: {
    color: '#FFF',
    fontSize: 14,
    opacity: 0.8,
  },
  balanceAmount: {
    color: '#FFF',
    fontSize: 36,
    fontWeight: 'bold',
    marginVertical: 8,
  },
  balanceSubtext: {
    color: '#FFF',
    fontSize: 12,
    opacity: 0.7,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  actionButton: {
    flex: 1,
    backgroundColor: '#FFF',
    borderRadius: 8,
    padding: 16,
    marginHorizontal: 4,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  actionButtonDisabled: {
    opacity: 0.5,
  },
  emergencyButton: {
    backgroundColor: '#FFEBEE',
  },
  actionIcon: {
    fontSize: 28,
    marginBottom: 8,
  },
  actionLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#333',
    textAlign: 'center',
  },
  transactionsSection: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
  },
  transactionItem: {
    backgroundColor: '#FFF',
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  transactionLeft: {
    flex: 1,
  },
  transactionType: {
    fontSize: 11,
    color: '#999',
    fontWeight: '500',
  },
  transactionRecipient: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginTop: 2,
  },
  transactionDate: {
    fontSize: 11,
    color: '#CCC',
    marginTop: 4,
  },
  transactionRight: {
    alignItems: 'flex-end',
  },
  transactionAmount: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  amountNegative: {
    color: '#FF6B6B',
  },
  amountPositive: {
    color: '#4CAF50',
  },
  transactionStatus: {
    fontSize: 10,
    color: '#999',
    marginTop: 4,
  },
  noTransactions: {
    textAlign: 'center',
    color: '#999',
    fontSize: 14,
    paddingVertical: 20,
  },
  securityInfo: {
    backgroundColor: '#E8F5E9',
    borderRadius: 8,
    padding: 12,
  },
  securityTitle: {
    color: '#2E7D32',
    fontWeight: '600',
    marginBottom: 8,
  },
  securityTip: {
    color: '#2E7D32',
    fontSize: 12,
    lineHeight: 18,
  },
});
