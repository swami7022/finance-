/**
 * Carbon Footprint Utility
 * Track environmental impact of financial transactions
 */

export interface CarbonFootprint {
  totalEmissions: number; // in kg CO2
  transactionsAnalyzed: number;
  averagePerTransaction: number;
  categories: CarbonCategory[];
  monthlyTrend: number; // percentage change
  offsetAmount: number; // amount needed to offset
}

export interface CarbonCategory {
  name: string;
  emissions: number;
  percentage: number;
  color: string;
  tips: string[];
}

export interface TransactionCarbon {
  transactionId: string;
  emissions: number;
  category: string;
  offsetCost: number;
}

// Carbon emission factors (kg CO2 per dollar spent)
const CARBON_FACTORS = {
  'Food & Dining': 2.5, // Restaurant meals
  'Transportation': 3.2, // Gas, rideshare
  'Shopping': 1.8, // General retail
  'Entertainment': 0.8, // Digital services
  'Coffee': 1.2, // Coffee shops
  'Groceries': 0.5, // Food shopping
  'Utilities': 4.1, // Energy bills
  'Healthcare': 1.5, // Medical services
  'Other': 1.0, // Default
};

// Calculate carbon footprint for transactions
export const calculateCarbonFootprint = (transactions: any[]): CarbonFootprint => {
  let totalEmissions = 0;
  const categoryEmissions: { [key: string]: number } = {};
  const analyzedTransactions = transactions.filter(t => t.type === 'send');

  analyzedTransactions.forEach(transaction => {
    const category = categorizeTransaction(transaction.recipient);
    const factor = CARBON_FACTORS[category as keyof typeof CARBON_FACTORS] || CARBON_FACTORS.Other;
    const emissions = transaction.amount * factor;

    totalEmissions += emissions;
    categoryEmissions[category] = (categoryEmissions[category] || 0) + emissions;
  });

  const categories: CarbonCategory[] = Object.entries(categoryEmissions).map(([name, emissions]) => ({
    name,
    emissions,
    percentage: (emissions / totalEmissions) * 100,
    color: getCategoryColor(name),
    tips: getCarbonTips(name),
  }));

  const averagePerTransaction = totalEmissions / analyzedTransactions.length;
  const monthlyTrend = Math.random() * 20 - 10; // Mock trend between -10% to +10%
  const offsetAmount = totalEmissions * 1.66; // ₹1.66 per kg CO2 (equivalent to $0.02)

  return {
    totalEmissions,
    transactionsAnalyzed: analyzedTransactions.length,
    averagePerTransaction,
    categories,
    monthlyTrend,
    offsetAmount,
  };
};

// Categorize transaction for carbon tracking
const categorizeTransaction = (recipient: string): string => {
  const lowerRecipient = recipient.toLowerCase();

  if (lowerRecipient.includes('restaurant') || lowerRecipient.includes('pizza') ||
      lowerRecipient.includes('food') || lowerRecipient.includes('dining')) {
    return 'Food & Dining';
  }
  if (lowerRecipient.includes('uber') || lowerRecipient.includes('lyft') ||
      lowerRecipient.includes('taxi') || lowerRecipient.includes('gas') ||
      lowerRecipient.includes('fuel')) {
    return 'Transportation';
  }
  if (lowerRecipient.includes('amazon') || lowerRecipient.includes('shopping') ||
      lowerRecipient.includes('store') || lowerRecipient.includes('retail')) {
    return 'Shopping';
  }
  if (lowerRecipient.includes('netflix') || lowerRecipient.includes('spotify') ||
      lowerRecipient.includes('entertainment') || lowerRecipient.includes('movie')) {
    return 'Entertainment';
  }
  if (lowerRecipient.includes('coffee') || lowerRecipient.includes('starbucks') ||
      lowerRecipient.includes('cafe')) {
    return 'Coffee';
  }
  if (lowerRecipient.includes('grocery') || lowerRecipient.includes('market') ||
      lowerRecipient.includes('supermarket')) {
    return 'Groceries';
  }
  if (lowerRecipient.includes('electric') || lowerRecipient.includes('utility') ||
      lowerRecipient.includes('power') || lowerRecipient.includes('gas bill')) {
    return 'Utilities';
  }
  if (lowerRecipient.includes('hospital') || lowerRecipient.includes('doctor') ||
      lowerRecipient.includes('medical') || lowerRecipient.includes('pharmacy')) {
    return 'Healthcare';
  }

  return 'Other';
};

// Get color for category visualization
const getCategoryColor = (category: string): string => {
  const colors: { [key: string]: string } = {
    'Food & Dining': '#FF6B6B',
    'Transportation': '#4ECDC4',
    'Shopping': '#45B7D1',
    'Entertainment': '#96CEB4',
    'Coffee': '#FFEAA7',
    'Groceries': '#DDA0DD',
    'Utilities': '#98D8C8',
    'Healthcare': '#F7DC6F',
    'Other': '#BDC3C7',
  };
  return colors[category] || colors.Other;
};

// Get carbon reduction tips for each category
const getCarbonTips = (category: string): string[] => {
  const tips: { [key: string]: string[] } = {
    'Food & Dining': [
      'Try meat-free Mondays to reduce emissions by up to 30%',
      'Choose local restaurants to cut transportation emissions',
      'Opt for seasonal, locally-sourced ingredients when possible',
    ],
    'Transportation': [
      'Use public transport or bike for short trips',
      'Carpool or use ride-sharing efficiently',
      'Consider electric or hybrid vehicle options',
    ],
    'Shopping': [
      'Buy second-hand or refurbished items',
      'Choose products with minimal packaging',
      'Support eco-friendly brands and sustainable materials',
    ],
    'Entertainment': [
      'Stream services use less energy than physical media',
      'Choose digital subscriptions over physical products',
      'Attend local events to reduce travel emissions',
    ],
    'Coffee': [
      'Bring your own reusable cup',
      'Choose coffee shops that source sustainably',
      'Consider making coffee at home to reduce waste',
    ],
    'Groceries': [
      'Buy local and seasonal produce',
      'Choose loose produce over packaged items',
      'Plan meals to reduce food waste',
    ],
    'Utilities': [
      'Switch to renewable energy providers',
      'Use energy-efficient appliances',
      'Implement smart home energy management',
    ],
    'Healthcare': [
      'Choose digital consultations when possible',
      'Use public transport for medical appointments',
      'Opt for preventive care to reduce future medical needs',
    ],
    'Other': [
      'Review and optimize all recurring subscriptions',
      'Choose digital services over physical alternatives',
      'Consolidate errands to reduce travel',
    ],
  };
  return tips[category] || tips.Other;
};

// Calculate carbon offset cost
export const calculateOffsetCost = (emissions: number): number => {
  // Average cost to offset 1 kg of CO2 is about ₹1.66
  return emissions * 0.02;
};

// Get environmental impact rating
export const getEnvironmentalRating = (totalEmissions: number): {
  rating: 'Excellent' | 'Good' | 'Average' | 'Needs Improvement';
  color: string;
  description: string;
} => {
  const monthlyEmissions = totalEmissions; // Assuming this is monthly

  if (monthlyEmissions < 50) {
    return {
      rating: 'Excellent',
      color: '#27AE60',
      description: 'Your carbon footprint is exceptionally low! You\'re making great environmental choices.',
    };
  } else if (monthlyEmissions < 100) {
    return {
      rating: 'Good',
      color: '#2ECC71',
      description: 'Your carbon footprint is below average. Small changes can make a big difference.',
    };
  } else if (monthlyEmissions < 200) {
    return {
      rating: 'Average',
      color: '#F39C12',
      description: 'Your carbon footprint is about average. There are opportunities to reduce your impact.',
    };
  } else {
    return {
      rating: 'Needs Improvement',
      color: '#E74C3C',
      description: 'Your carbon footprint is higher than average. Consider making more sustainable choices.',
    };
  }
};