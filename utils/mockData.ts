/**
 * Mock Data Utility
 * Provides dummy data for the app
 */

export interface Transaction {
  id: string;
  type: 'send' | 'receive';
  amount: number;
  recipient: string;
  date: string;
  status: 'completed' | 'pending' | 'failed';
}

export interface User {
  id: string;
  name: string;
  email: string;
  backupEmail: string;
  balance: number;
  accountLocked: boolean;
  transactions: Transaction[];
}

/**
 * Mock user data
 */
export const mockUsers: Record<string, User> = {
  'demo@example.com': {
    id: 'user_001',
    name: 'Rahul Sharma',
    email: 'demo@example.com',
    backupEmail: 'rahul.backup@example.com',
    balance: 450000, // ₹4,50,000
    accountLocked: false,
    transactions: [
      {
        id: 'txn_001',
        type: 'send',
        amount: 12500,
        recipient: 'Swiggy Food Delivery',
        date: '2024-04-09',
        status: 'completed',
      },
      {
        id: 'txn_002',
        type: 'receive',
        amount: 35000,
        recipient: 'Salary Credit',
        date: '2024-04-08',
        status: 'completed',
      },
      {
        id: 'txn_003',
        type: 'send',
        amount: 2500,
        recipient: 'Uber Ride',
        date: '2024-04-07',
        status: 'completed',
      },
      {
        id: 'txn_004',
        type: 'receive',
        amount: 15000,
        recipient: 'Freelance Payment',
        date: '2024-04-06',
        status: 'completed',
      },
    ],
  },
};

/**
 * Get mock user by email
 */
export const getMockUser = (email: string): User | null => {
  return mockUsers[email] ?? null; // safer than ||
};

/**
 * Get mock transaction list
 */
export const getMockTransactions = (email: string): Transaction[] => {
  const user = getMockUser(email);
  return user?.transactions ?? [];
};

/**
 * Generate mock OTP
 */
export const generateMockOTP = (): string => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

/**
 * Verify mock OTP (for demo, always accepts "123456")
 */
export const verifyMockOTP = (otp: string): boolean => {
  return otp === '123456';
};