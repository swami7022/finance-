/**
 * Risk Detection Utility
 * Simulates device ID, location, and determines login risk level
 */

export type RiskLevel = 'LOW' | 'HIGH';

export interface DeviceInfo {
  deviceId: string;
  location: string;
  lastSeen?: string;
}

// Mock device registry - stores previously seen devices
let knownDevices: Map<string, DeviceInfo> = new Map();

/**
 * Generate a mock device ID based on device characteristics
 */
export const generateDeviceId = (): string => {
  // In a real app, this would use device info APIs
  return `device_${Math.random().toString(36).substr(2, 9)}`;
};

/**
 * Generate a mock location (city name)
 */
export const generateMockLocation = (): string => {
  const cities = [
    'New York',
    'Los Angeles',
    'Chicago',
    'Houston',
    'Phoenix',
    'San Francisco',
    'Seattle',
    'Boston',
    'Miami',
    'Denver',
  ];
  return cities[Math.floor(Math.random() * cities.length)];
};

/**
 * Register or update a trusted device
 */
export const registerDevice = (deviceId: string, location: string): void => {
  knownDevices.set(deviceId, {
    deviceId,
    location,
    lastSeen: new Date().toISOString(),
  });
};

/**
 * Clear known devices (used for testing or reset)
 */
export const clearDeviceRegistry = (): void => {
  knownDevices.clear();
};

/**
 * Detect if login is risky based on device and location
 * Returns HIGH RISK if:
 * - Device is new (not in registry)
 * - Location is different from last known location
 *
 * Returns LOW RISK if:
 * - Device is known and location matches
 */
export const detectLoginRisk = (deviceId: string, location: string): RiskLevel => {
  const knownDevice = knownDevices.get(deviceId);

  // New device = HIGH RISK
  if (!knownDevice) {
    return 'HIGH';
  }

  // Different location = HIGH RISK
  if (knownDevice.location !== location) {
    return 'HIGH';
  }

  // Same device, same location = LOW RISK
  return 'LOW';
};

/**
 * Get the current device and location
 */
export const getCurrentDeviceInfo = (): DeviceInfo => {
  return {
    deviceId: generateDeviceId(),
    location: generateMockLocation(),
  };
};

/**
 * Get all known devices for the user
 */
export const getKnownDevices = (): DeviceInfo[] => {
  return Array.from(knownDevices.values());
};
