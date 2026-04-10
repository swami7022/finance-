/**
 * Trusted Devices Screen
 * Shows list of trusted devices for the user
 */

import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  BackHandler,
} from 'react-native';
import { getKnownDevices } from '@/utils/riskDetection';
import type { DeviceInfo } from '@/utils/riskDetection';

interface TrustedDevicesScreenProps {
  onClose: () => void;
}

export const TrustedDevicesScreen: React.FC<TrustedDevicesScreenProps> = ({ onClose }) => {
  const [devices, setDevices] = useState<DeviceInfo[]>([]);

  useEffect(() => {
    const knownDevices = getKnownDevices();
    setDevices(knownDevices);
  }, []);

  // Handle hardware back button
  useEffect(() => {
    const backAction = () => {
      onClose();
      return true;
    };

    const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction);

    return () => backHandler.remove();
  }, [onClose]);

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return 'Unknown';
    try {
      const date = new Date(dateStr);
      return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
    } catch {
      return dateStr;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={onClose}>
          <Text style={styles.backButton}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Trusted Devices</Text>
        <View style={{ width: 50 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {devices.length > 0 ? (
          <>
            <Text style={styles.subtitle}>Devices that can access your account</Text>

            {devices.map((device, index) => (
              <View key={device.deviceId} style={styles.deviceCard}>
                <View style={styles.deviceHeader}>
                  <View style={styles.deviceIcon}>
                    <Text style={styles.phoneIcon}>📱</Text>
                  </View>
                  <View style={styles.deviceInfo}>
                    <Text style={styles.deviceId}>Device {index + 1}</Text>
                    <Text style={styles.deviceLocation}>{device.location}</Text>
                  </View>
                  <View style={styles.badgeContainer}>
                    <View style={styles.trustedBadge}>
                      <Text style={styles.badgeText}>✓ Trusted</Text>
                    </View>
                  </View>
                </View>

                <View style={styles.deviceDetails}>
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Device ID:</Text>
                    <Text style={styles.detailValue}>{device.deviceId.substring(0, 20)}...</Text>
                  </View>
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Last Seen:</Text>
                    <Text style={styles.detailValue}>{formatDate(device.lastSeen)}</Text>
                  </View>
                </View>
              </View>
            ))}

            <View style={styles.infoBox}>
              <Text style={styles.infoTitle}>🔒 How it works</Text>
              <Text style={styles.infoText}>
                We remember devices you trust. When you login from a new device, we'll ask for
                verification to keep your account secure.
              </Text>
            </View>
          </>
        ) : (
          <View style={styles.emptyState}>
            <Text style={styles.emptyIcon}>📱</Text>
            <Text style={styles.emptyTitle}>No Trusted Devices Yet</Text>
            <Text style={styles.emptyText}>
              Devices will appear here once you complete login verification
            </Text>
          </View>
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFF',
    borderBottomWidth: 1,
    borderBottomColor: '#EEE',
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
  content: {
    padding: 16,
  },
  subtitle: {
    fontSize: 13,
    color: '#999',
    marginBottom: 16,
  },
  deviceCard: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  deviceHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  deviceIcon: {
    width: 48,
    height: 48,
    borderRadius: 8,
    backgroundColor: '#F0F0F0',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  phoneIcon: {
    fontSize: 24,
  },
  deviceInfo: {
    flex: 1,
  },
  deviceId: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  deviceLocation: {
    fontSize: 12,
    color: '#999',
    marginTop: 2,
  },
  badgeContainer: {
    alignItems: 'flex-end',
  },
  trustedBadge: {
    backgroundColor: '#E8F5E9',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  badgeText: {
    fontSize: 10,
    color: '#2E7D32',
    fontWeight: '600',
  },
  deviceDetails: {
    backgroundColor: '#F9F9F9',
    borderRadius: 8,
    padding: 10,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  detailLabel: {
    fontSize: 12,
    color: '#999',
    fontWeight: '500',
  },
  detailValue: {
    fontSize: 12,
    color: '#333',
    fontWeight: '500',
  },
  infoBox: {
    backgroundColor: '#E8F5E9',
    borderRadius: 8,
    padding: 12,
    marginTop: 20,
  },
  infoTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2E7D32',
    marginBottom: 6,
  },
  infoText: {
    fontSize: 12,
    color: '#2E7D32',
    lineHeight: 16,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: 12,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 6,
  },
  emptyText: {
    fontSize: 13,
    color: '#999',
    textAlign: 'center',
    maxWidth: 280,
    lineHeight: 18,
  },
});
