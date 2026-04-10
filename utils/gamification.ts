/**
 * Gamification Utility
 * Achievement system with badges and rewards
 */

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  category: 'saving' | 'spending' | 'security' | 'goals' | 'streak';
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  points: number;
  unlocked: boolean;
  unlockedDate?: string;
  progress?: number;
  maxProgress?: number;
}

export interface UserStats {
  totalPoints: number;
  achievementsUnlocked: number;
  currentStreak: number;
  longestStreak: number;
  totalSaved: number;
  transactionsCount: number;
  riskAssessments: number;
}

// Mock achievements data
export const getAllAchievements = (): Achievement[] => [
  {
    id: 'first-login',
    title: 'Welcome Aboard!',
    description: 'Complete your first login',
    icon: '🎉',
    category: 'security',
    rarity: 'common',
    points: 10,
    unlocked: true,
    unlockedDate: '2024-01-01',
  },
  {
    id: 'saving-streak',
    title: 'Savings Champion',
    description: 'Save money for 7 consecutive days',
    icon: '💰',
    category: 'saving',
    rarity: 'rare',
    points: 50,
    unlocked: false,
    progress: 5,
    maxProgress: 7,
  },
  {
    id: 'budget-master',
    title: 'Budget Master',
    description: 'Stay under budget for an entire month',
    icon: '📊',
    category: 'spending',
    rarity: 'epic',
    points: 100,
    unlocked: false,
  },
  {
    id: 'security-guardian',
    title: 'Security Guardian',
    description: 'Complete 10 risk assessments',
    icon: '🛡️',
    category: 'security',
    rarity: 'rare',
    points: 75,
    unlocked: false,
    progress: 3,
    maxProgress: 10,
  },
  {
    id: 'goal-crusher',
    title: 'Goal Crusher',
    description: 'Achieve your first savings goal',
    icon: '🎯',
    category: 'goals',
    rarity: 'epic',
    points: 150,
    unlocked: false,
  },
  {
    id: 'transaction-ninja',
    title: 'Transaction Ninja',
    description: 'Complete 50 transactions',
    icon: '⚡',
    category: 'spending',
    rarity: 'rare',
    points: 80,
    unlocked: false,
    progress: 12,
    maxProgress: 50,
  },
  {
    id: 'biometric-pioneer',
    title: 'Biometric Pioneer',
    description: 'Use biometric login for the first time',
    icon: '👆',
    category: 'security',
    rarity: 'common',
    points: 25,
    unlocked: false,
  },
  {
    id: 'eco-warrior',
    title: 'Eco Warrior',
    description: 'Offset your carbon footprint through sustainable choices',
    icon: '🌱',
    category: 'saving',
    rarity: 'legendary',
    points: 200,
    unlocked: false,
  },
  {
    id: 'upi-pioneer',
    title: 'UPI Champion',
    description: 'Make your first UPI payment',
    icon: '📱',
    category: 'spending',
    rarity: 'common',
    points: 30,
    unlocked: false,
  },
  {
    id: 'festival-saver',
    title: 'Festival Saver',
    description: 'Save ₹10,000 for Diwali celebrations',
    icon: '🪔',
    category: 'saving',
    rarity: 'rare',
    points: 75,
    unlocked: false,
    progress: 6500,
    maxProgress: 10000,
  },
  {
    id: 'digital-india',
    title: 'Digital India Citizen',
    description: 'Complete 25 digital transactions',
    icon: '🇮🇳',
    category: 'spending',
    rarity: 'epic',
    points: 120,
    unlocked: false,
    progress: 18,
    maxProgress: 25,
  },
  {
    id: 'rupee-millionaire',
    title: 'Rupee Millionaire',
    description: 'Save ₹1,00,000 in your account',
    icon: '💰',
    category: 'saving',
    rarity: 'legendary',
    points: 250,
    unlocked: false,
  },
  {
    id: 'holi-celebrator',
    title: 'Holi Celebrator',
    description: 'Save for Holi festival expenses',
    icon: '🎨',
    category: 'goals',
    rarity: 'common',
    points: 40,
    unlocked: false,
  },
];

// Calculate user stats based on their activity
export const calculateUserStats = (transactions: any[], achievements: Achievement[]): UserStats => {
  const totalPoints = achievements
    .filter(a => a.unlocked)
    .reduce((sum, a) => sum + a.points, 0);

  const achievementsUnlocked = achievements.filter(a => a.unlocked).length;

  // Mock streak calculation
  const currentStreak = 3;
  const longestStreak = 12;

  const totalSaved = transactions
    .filter(t => t.type === 'received')
    .reduce((sum, t) => sum + t.amount, 0);

  const transactionsCount = transactions.length;

  return {
    totalPoints,
    achievementsUnlocked,
    currentStreak,
    longestStreak,
    totalSaved,
    transactionsCount,
    riskAssessments: 3, // Mock value
  };
};

// Check for newly unlocked achievements
export const checkForNewAchievements = (
  transactions: any[],
  userStats: UserStats,
  currentAchievements: Achievement[]
): Achievement[] => {
  const newAchievements = [...currentAchievements];

  // Check transaction count achievement
  const transactionAchievement = newAchievements.find(a => a.id === 'transaction-ninja');
  if (transactionAchievement && !transactionAchievement.unlocked) {
    transactionAchievement.progress = userStats.transactionsCount;
    if (userStats.transactionsCount >= 50) {
      transactionAchievement.unlocked = true;
      transactionAchievement.unlockedDate = new Date().toISOString().split('T')[0];
    }
  }

  // Check security achievement
  const securityAchievement = newAchievements.find(a => a.id === 'security-guardian');
  if (securityAchievement && !securityAchievement.unlocked) {
    securityAchievement.progress = userStats.riskAssessments;
    if (userStats.riskAssessments >= 10) {
      securityAchievement.unlocked = true;
      securityAchievement.unlockedDate = new Date().toISOString().split('T')[0];
    }
  }

  return newAchievements;
};

// Get achievement rarity color
export const getRarityColor = (rarity: string): string => {
  switch (rarity) {
    case 'common': return '#8B8B8B';
    case 'rare': return '#4A90E2';
    case 'epic': return '#9B59B6';
    case 'legendary': return '#E67E22';
    default: return '#8B8B8B';
  }
};

// Get next level requirements
export const getNextLevelRequirements = (currentPoints: number): { level: number; pointsNeeded: number } => {
  const levels = [
    { level: 1, points: 0 },
    { level: 2, points: 100 },
    { level: 3, points: 250 },
    { level: 4, points: 500 },
    { level: 5, points: 1000 },
    { level: 6, points: 2000 },
    { level: 7, points: 3500 },
    { level: 8, points: 5000 },
  ];

  for (let i = levels.length - 1; i >= 0; i--) {
    if (currentPoints >= levels[i].points) {
      if (i === levels.length - 1) {
        return { level: levels[i].level, pointsNeeded: 0 };
      }
      return {
        level: levels[i].level,
        pointsNeeded: levels[i + 1].points - currentPoints
      };
    }
  }

  return { level: 1, pointsNeeded: levels[1].points - currentPoints };
};