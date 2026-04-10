/**
 * AsyncStorage Utility
 * Securely stores user session and risk data
 */

import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEYS = {
  USER_SESSION: '@finanapp_user_session',
  DEVICE_ID: '@finanapp_device_id',
  RISK_LEVEL: '@finanapp_risk_level',
  ACCOUNT_LOCKED: '@finanapp_account_locked',
  KNOWN_DEVICES: '@finanapp_known_devices',
  USER_DATA: '@finanapp_user_data',
  SAVINGS_GOALS: '@finanapp_savings_goals',
  ACHIEVEMENTS: '@finanapp_achievements',
  CARBON_DATA: '@finanapp_carbon_data',
  AI_INSIGHTS: '@finanapp_ai_insights',
};

export interface StoredSession {
  email: string;
  userId: string;
  loginTime: string;
  deviceId: string;
}

/**
 * Save user session
 */
export const saveSession = async (session: StoredSession): Promise<void> => {
  try {
    await AsyncStorage.setItem(STORAGE_KEYS.USER_SESSION, JSON.stringify(session));
  } catch (error) {
    console.error('Error saving session:', error);
  }
};

/**
 * Get stored session
 */
export const getSession = async (): Promise<StoredSession | null> => {
  try {
    const session = await AsyncStorage.getItem(STORAGE_KEYS.USER_SESSION);
    return session ? JSON.parse(session) : null;
  } catch (error) {
    console.error('Error retrieving session:', error);
    return null;
  }
};

/**
 * Clear session (logout)
 */
export const clearSession = async (): Promise<void> => {
  try {
    await AsyncStorage.removeItem(STORAGE_KEYS.USER_SESSION);
  } catch (error) {
    console.error('Error clearing session:', error);
  }
};

/**
 * Save risk level for current session
 */
export const saveRiskLevel = async (riskLevel: string): Promise<void> => {
  try {
    await AsyncStorage.setItem(STORAGE_KEYS.RISK_LEVEL, riskLevel);
  } catch (error) {
    console.error('Error saving risk level:', error);
  }
};

/**
 * Get current risk level
 */
export const getRiskLevel = async (): Promise<string> => {
  try {
    const riskLevel = await AsyncStorage.getItem(STORAGE_KEYS.RISK_LEVEL);
    return riskLevel || 'LOW';
  } catch (error) {
    console.error('Error retrieving risk level:', error);
    return 'LOW';
  }
};

/**
 * Set account locked status
 */
export const setAccountLocked = async (locked: boolean): Promise<void> => {
  try {
    await AsyncStorage.setItem(STORAGE_KEYS.ACCOUNT_LOCKED, JSON.stringify(locked));
  } catch (error) {
    console.error('Error setting account locked:', error);
  }
};

/**
 * Check if account is locked
 */
export const isAccountLocked = async (): Promise<boolean> => {
  try {
    const locked = await AsyncStorage.getItem(STORAGE_KEYS.ACCOUNT_LOCKED);
    return locked ? JSON.parse(locked) : false;
  } catch (error) {
    console.error('Error checking account locked:', error);
    return false;
  }
};

/**
 * Clear all app data
 */
export const clearAllData = async (): Promise<void> => {
  try {
    await AsyncStorage.multiRemove([
      STORAGE_KEYS.USER_SESSION,
      STORAGE_KEYS.DEVICE_ID,
      STORAGE_KEYS.RISK_LEVEL,
      STORAGE_KEYS.ACCOUNT_LOCKED,
      STORAGE_KEYS.KNOWN_DEVICES,
      STORAGE_KEYS.USER_DATA,
      STORAGE_KEYS.SAVINGS_GOALS,
      STORAGE_KEYS.ACHIEVEMENTS,
      STORAGE_KEYS.CARBON_DATA,
      STORAGE_KEYS.AI_INSIGHTS,
    ]);
  } catch (error) {
    console.error('Error clearing all data:', error);
  }
};

// ===== USER DATA STORAGE =====

/**
 * Save complete user data (including transactions)
 */
export const saveUserData = async (userData: any): Promise<void> => {
  try {
    await AsyncStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(userData));
  } catch (error) {
    console.error('Error saving user data:', error);
  }
};

/**
 * Get stored user data
 */
export const getUserData = async (): Promise<any | null> => {
  try {
    const data = await AsyncStorage.getItem(STORAGE_KEYS.USER_DATA);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error('Error retrieving user data:', error);
    return null;
  }
};

/**
 * Add a new transaction to user data
 */
export const addTransaction = async (email: string, transaction: any): Promise<void> => {
  try {
    const userData = await getUserData();
    if (userData && userData[email]) {
      // Update balance based on transaction type
      if (transaction.type === 'send') {
        userData[email].balance -= transaction.amount;
      } else if (transaction.type === 'receive') {
        userData[email].balance += transaction.amount;
      }

      // Add transaction to the beginning of the array
      userData[email].transactions.unshift(transaction);

      // Keep only last 50 transactions to prevent storage bloat
      if (userData[email].transactions.length > 50) {
        userData[email].transactions = userData[email].transactions.slice(0, 50);
      }

      await saveUserData(userData);
    }
  } catch (error) {
    console.error('Error adding transaction:', error);
  }
};

/**
 * Update user balance
 */
export const updateUserBalance = async (email: string, newBalance: number): Promise<void> => {
  try {
    const userData = await getUserData();
    if (userData && userData[email]) {
      userData[email].balance = newBalance;
      await saveUserData(userData);
    }
  } catch (error) {
    console.error('Error updating balance:', error);
  }
};

// ===== SAVINGS GOALS STORAGE =====

/**
 * Save savings goals
 */
export const saveSavingsGoals = async (goals: any[]): Promise<void> => {
  try {
    await AsyncStorage.setItem(STORAGE_KEYS.SAVINGS_GOALS, JSON.stringify(goals));
  } catch (error) {
    console.error('Error saving savings goals:', error);
  }
};

/**
 * Get stored savings goals
 */
export const getSavingsGoals = async (): Promise<any[]> => {
  try {
    const goals = await AsyncStorage.getItem(STORAGE_KEYS.SAVINGS_GOALS);
    return goals ? JSON.parse(goals) : [];
  } catch (error) {
    console.error('Error retrieving savings goals:', error);
    return [];
  }
};

// ===== ACHIEVEMENTS STORAGE =====

/**
 * Save achievements progress
 */
export const saveAchievements = async (achievements: any[]): Promise<void> => {
  try {
    await AsyncStorage.setItem(STORAGE_KEYS.ACHIEVEMENTS, JSON.stringify(achievements));
  } catch (error) {
    console.error('Error saving achievements:', error);
  }
};

/**
 * Get stored achievements
 */
export const getAchievements = async (): Promise<any[]> => {
  try {
    const achievements = await AsyncStorage.getItem(STORAGE_KEYS.ACHIEVEMENTS);
    return achievements ? JSON.parse(achievements) : [];
  } catch (error) {
    console.error('Error retrieving achievements:', error);
    return [];
  }
};

// ===== CARBON FOOTPRINT STORAGE =====

/**
 * Save carbon footprint data
 */
export const saveCarbonData = async (carbonData: any): Promise<void> => {
  try {
    await AsyncStorage.setItem(STORAGE_KEYS.CARBON_DATA, JSON.stringify(carbonData));
  } catch (error) {
    console.error('Error saving carbon data:', error);
  }
};

/**
 * Get stored carbon footprint data
 */
export const getCarbonData = async (): Promise<any | null> => {
  try {
    const data = await AsyncStorage.getItem(STORAGE_KEYS.CARBON_DATA);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error('Error retrieving carbon data:', error);
    return null;
  }
};

// ===== AI INSIGHTS STORAGE =====

/**
 * Save AI insights data
 */
export const saveAIInsights = async (insights: any[]): Promise<void> => {
  try {
    await AsyncStorage.setItem(STORAGE_KEYS.AI_INSIGHTS, JSON.stringify(insights));
  } catch (error) {
    console.error('Error saving AI insights:', error);
  }
};

/**
 * Get stored AI insights
 */
export const getAIInsights = async (): Promise<any[]> => {
  try {
    const insights = await AsyncStorage.getItem(STORAGE_KEYS.AI_INSIGHTS);
    return insights ? JSON.parse(insights) : [];
  } catch (error) {
    console.error('Error retrieving AI insights:', error);
    return [];
  }
};

// ===== DATA INITIALIZATION =====

/**
 * Initialize app data with mock data if not exists
 */
export const initializeAppData = async (): Promise<void> => {
  try {
    // Check if user data exists
    const existingUserData = await getUserData();
    if (!existingUserData) {
      // Import mock data and save it
      const { mockUsers } = await import('./mockData');
      await saveUserData(mockUsers);
      console.log('✅ Mock user data initialized');
    }

    // Check if savings goals exist
    const existingGoals = await getSavingsGoals();
    if (existingGoals.length === 0) {
      const mockGoals = [
        {
          id: '1',
          name: 'Diwali Shopping',
          targetAmount: 15000,
          currentAmount: 8500,
          deadline: '2024-11-12',
          category: 'Festival',
        },
        {
          id: '2',
          name: 'Emergency Fund',
          targetAmount: 100000,
          currentAmount: 25000,
          deadline: '2025-12-31',
          category: 'Emergency',
        },
        {
          id: '3',
          name: 'Holi Celebration',
          targetAmount: 8000,
          currentAmount: 3200,
          deadline: '2025-03-14',
          category: 'Festival',
        },
        {
          id: '4',
          name: 'New Smartphone',
          targetAmount: 25000,
          currentAmount: 12000,
          deadline: '2024-12-01',
          category: 'Electronics',
        },
        {
          id: '5',
          name: 'Family Vacation to Goa',
          targetAmount: 75000,
          currentAmount: 28000,
          deadline: '2025-05-15',
          category: 'Travel',
        },
      ];
      await saveSavingsGoals(mockGoals);
      console.log('✅ Mock savings goals initialized');
    }

    // Check if achievements exist
    const existingAchievements = await getAchievements();
    if (existingAchievements.length === 0) {
      const { getAllAchievements } = await import('./gamification');
      const achievements = getAllAchievements();
      await saveAchievements(achievements);
      console.log('✅ Mock achievements initialized');
    }

  } catch (error) {
    console.error('Error initializing app data:', error);
  }
};
