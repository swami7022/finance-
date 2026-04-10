/**
 * Notification Utility
 * Handles push notifications for the app
 */

import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

// Configure notification handler
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

// Request permissions
export const requestNotificationPermissions = async (): Promise<boolean> => {
  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;

  if (existingStatus !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }

  if (finalStatus !== 'granted') {
    return false;
  }

  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C',
    });
  }

  return true;
};

// Send local notification
export const sendLocalNotification = async (
  title: string,
  body: string,
  data?: any
): Promise<void> => {
  await Notifications.scheduleNotificationAsync({
    content: {
      title,
      body,
      data: data || {},
    },
    trigger: null, // Send immediately
  });
};

// Send transaction notification
export const sendTransactionNotification = async (
  amount: number,
  recipient: string,
  type: 'sent' | 'received'
): Promise<void> => {
  const title = type === 'sent' ? 'Money Sent' : 'Money Received';
  const body = type === 'sent'
    ? `₹${amount.toLocaleString('en-IN')} sent to ${recipient}`
    : `₹${amount.toLocaleString('en-IN')} received from ${recipient}`;

  await sendLocalNotification(title, body, { type: 'transaction', amount, recipient });
};

// Send security alert notification
export const sendSecurityAlert = async (message: string): Promise<void> => {
  await sendLocalNotification('Security Alert', message, { type: 'security' });
};

// Send OTP notification (for demo)
export const sendOTPNotification = async (otp: string): Promise<void> => {
  await sendLocalNotification(
    'OTP Verification',
    `Your verification code is: ${otp}`,
    { type: 'otp', otp }
  );
};