/**
 * AI Insights Utility
 * Provides AI-powered spending analysis and recommendations
 */

export interface SpendingInsight {
  id: string;
  type: 'saving' | 'warning' | 'tip' | 'achievement';
  title: string;
  description: string;
  impact: 'high' | 'medium' | 'low';
  category: string;
  actionable: boolean;
}

export interface SpendingPattern {
  category: string;
  amount: number;
  percentage: number;
  trend: 'up' | 'down' | 'stable';
  frequency: number;
}

// Mock AI analysis of spending patterns
export const analyzeSpendingPatterns = (transactions: any[]): SpendingInsight[] => {
  const insights: SpendingInsight[] = [];

  // Calculate spending by category
  const categorySpending: { [key: string]: number } = {};
  let totalSpending = 0;

  transactions.forEach(transaction => {
    if (transaction.type === 'send') {
      const category = categorizeTransaction(transaction.recipient);
      categorySpending[category] = (categorySpending[category] || 0) + transaction.amount;
      totalSpending += transaction.amount;
    }
  });

  // Convert to percentages
  const patterns: SpendingPattern[] = Object.entries(categorySpending).map(([category, amount]) => ({
    category,
    amount,
    percentage: (amount / totalSpending) * 100,
    trend: Math.random() > 0.5 ? 'up' : 'down', // Mock trend
    frequency: Math.floor(Math.random() * 10) + 1,
  }));

  // Generate insights based on patterns
  patterns.forEach(pattern => {
    if (pattern.percentage > 30) {
      insights.push({
        id: `high-${pattern.category}`,
        type: 'warning',
        title: `High spending in ${pattern.category}`,
        description: `You're spending ${pattern.percentage.toFixed(1)}% of your budget on ${pattern.category}. Consider setting a limit.`,
        impact: 'high',
        category: pattern.category,
        actionable: true,
      });
    }

    if (pattern.trend === 'up' && pattern.frequency > 5) {
      insights.push({
        id: `trend-${pattern.category}`,
        type: 'tip',
        title: `${pattern.category} spending increasing`,
        description: `Your ${pattern.category} expenses have been trending upward. Review your subscriptions and habits.`,
        impact: 'medium',
        category: pattern.category,
        actionable: true,
      });
    }
  });

  // Add general insights
  insights.push({
    id: 'weekly-budget',
    type: 'saving',
    title: 'Weekly Budget Achievement',
    description: 'You\'re 15% under your weekly spending target. Great job maintaining discipline!',
    impact: 'medium',
    category: 'budget',
    actionable: false,
  });

  insights.push({
    id: 'roundup-saving',
    type: 'tip',
    title: 'Round-up Savings Opportunity',
    description: 'Enable round-up savings to automatically save ₹1,041 this week from transaction rounding.',
    impact: 'low',
    category: 'saving',
    actionable: true,
  });

  return insights;
};

// Categorize transaction based on recipient
const categorizeTransaction = (recipient: string): string => {
  const lowerRecipient = recipient.toLowerCase();

  if (lowerRecipient.includes('swiggy') || lowerRecipient.includes('zomato') || lowerRecipient.includes('food') || lowerRecipient.includes('restaurant')) {
    return 'Food & Dining';
  }
  if (lowerRecipient.includes('uber') || lowerRecipient.includes('ola') || lowerRecipient.includes('rapido') || lowerRecipient.includes('taxi') || lowerRecipient.includes('petrol')) {
    return 'Transportation';
  }
  if (lowerRecipient.includes('amazon') || lowerRecipient.includes('flipkart') || lowerRecipient.includes('shopping') || lowerRecipient.includes('bigbasket')) {
    return 'Shopping';
  }
  if (lowerRecipient.includes('netflix') || lowerRecipient.includes('hotstar') || lowerRecipient.includes('zee5') || lowerRecipient.includes('subscription')) {
    return 'Entertainment';
  }
  if (lowerRecipient.includes('starbucks') || lowerRecipient.includes('coffee') || lowerRecipient.includes('chai')) {
    return 'Beverages';
  }
  if (lowerRecipient.includes('paytm') || lowerRecipient.includes('phonepe') || lowerRecipient.includes('gpay') || lowerRecipient.includes('upi')) {
    return 'Digital Payments';
  }

  return 'Other';
};

// Generate personalized financial advice
export const generatePersonalizedAdvice = (userProfile: any): string[] => {
  const advice: string[] = [];

  // Mock personalized advice based on user data
  advice.push("Based on your spending patterns, you could save ₹12,450/month by reducing food delivery expenses from Swiggy/Zomato.");
  advice.push("Consider using UPI payments for all transactions to earn cashback rewards from your bank.");
  advice.push("Your emergency fund is growing well - you're on track to reach your 6-month expense coverage by Diwali.");
  advice.push("Try the 50/30/20 rule: 50% needs, 30% wants, 20% savings. You're currently at 45/35/20.");
  advice.push("Festival season is coming! Start saving ₹2,000/month for Diwali and Holi celebrations.");
  advice.push("Use BHIM UPI for government scheme payments to avoid extra charges and earn rewards.");

  return advice;
};

// Calculate financial health score (0-100)
export const calculateFinancialHealthScore = (transactions: any[], balance: number): number => {
  let score = 50; // Base score

  // Analyze transaction patterns
  const recentTransactions = transactions.slice(0, 10);
  const spendingTransactions = recentTransactions.filter(t => t.type === 'send');

  if (spendingTransactions.length > 0) {
    const avgSpending = spendingTransactions.reduce((sum, t) => sum + t.amount, 0) / spendingTransactions.length;

    // Lower spending = higher score
    if (avgSpending < 50) score += 20;
    else if (avgSpending < 100) score += 10;
    else score -= 10;

    // Consistent spending patterns = higher score
    const spendingVariance = calculateVariance(spendingTransactions.map(t => t.amount));
    if (spendingVariance < 100) score += 15;
  }

  // Balance factor
  if (balance > 1000) score += 15;
  else if (balance > 500) score += 10;
  else if (balance < 100) score -= 10;

  return Math.max(0, Math.min(100, score));
};

const calculateVariance = (numbers: number[]): number => {
  const mean = numbers.reduce((sum, n) => sum + n, 0) / numbers.length;
  const squaredDiffs = numbers.map(n => Math.pow(n - mean, 2));
  return squaredDiffs.reduce((sum, sq) => sum + sq, 0) / numbers.length;
};