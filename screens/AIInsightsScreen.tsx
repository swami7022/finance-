/**
 * AI Insights Screen
 * Shows AI-powered spending analysis and recommendations
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Alert,
  BackHandler,
} from 'react-native';
import { useAuth } from '@/context/AuthContext';
import { getMockTransactions, getMockUser } from '@/utils/mockData';
import {
  analyzeSpendingPatterns,
  generatePersonalizedAdvice,
  calculateFinancialHealthScore,
  type SpendingInsight
} from '@/utils/aiInsights';

interface AIInsightsScreenProps {
  onClose: () => void;
}

export const AIInsightsScreen: React.FC<AIInsightsScreenProps> = ({ onClose }) => {
  const [insights, setInsights] = useState<SpendingInsight[]>([]);
  const [advice, setAdvice] = useState<string[]>([]);
  const [healthScore, setHealthScore] = useState(0);
  const [loading, setLoading] = useState(true);
  const { email } = useAuth();

  // Handle hardware back button
  useEffect(() => {
    const backAction = () => {
      onClose();
      return true;
    };

    const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction);

    return () => backHandler.remove();
  }, [onClose]);

  // Load and analyze data
  useEffect(() => {
    loadInsights();
  }, [email]);

  const loadInsights = async () => {
    if (!email) return;

    try {
      const transactions = getMockTransactions(email);
      const user = getMockUser(email);

      if (user) {
        const spendingInsights = analyzeSpendingPatterns(transactions);
        const personalizedAdvice = generatePersonalizedAdvice(user);
        const score = calculateFinancialHealthScore(transactions, user.balance);

        setInsights(spendingInsights);
        setAdvice(personalizedAdvice);
        setHealthScore(score);
      }
    } catch (error) {
      console.error('Error loading insights:', error);
    } finally {
      setLoading(false);
    }
  };

  const getInsightIcon = (type: string) => {
    switch (type) {
      case 'saving': return '💰';
      case 'warning': return '⚠️';
      case 'tip': return '💡';
      case 'achievement': return '🏆';
      default: return '📊';
    }
  };

  const getInsightColor = (impact: string) => {
    switch (impact) {
      case 'high': return '#E74C3C';
      case 'medium': return '#F39C12';
      case 'low': return '#27AE60';
      default: return '#BDC3C7';
    }
  };

  const getHealthScoreColor = (score: number) => {
    if (score >= 80) return '#27AE60';
    if (score >= 60) return '#2ECC71';
    if (score >= 40) return '#F39C12';
    return '#E74C3C';
  };

  const getHealthScoreLabel = (score: number) => {
    if (score >= 80) return 'Excellent';
    if (score >= 60) return 'Good';
    if (score >= 40) return 'Fair';
    return 'Needs Attention';
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Analyzing your spending patterns...</Text>
          <Text style={styles.loadingSubtext}>This may take a moment</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <TouchableOpacity onPress={onClose}>
            <Text style={styles.closeButton}>✕</Text>
          </TouchableOpacity>
          <Text style={styles.title}>AI Insights</Text>
          <View style={{ width: 24 }} />
        </View>

        {/* Financial Health Score */}
        <View style={styles.healthCard}>
          <Text style={styles.healthTitle}>Financial Health Score</Text>
          <View style={styles.scoreContainer}>
            <Text style={[styles.scoreNumber, { color: getHealthScoreColor(healthScore) }]}>
              {healthScore}
            </Text>
            <Text style={styles.scoreLabel}>{getHealthScoreLabel(healthScore)}</Text>
          </View>
          <Text style={styles.healthDescription}>
            Based on your spending patterns, transaction frequency, and balance management.
          </Text>
        </View>

        {/* Personalized Advice */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>💡 Personalized Advice</Text>
          {advice.map((tip, index) => (
            <View key={index} style={styles.adviceCard}>
              <Text style={styles.adviceText}>{tip}</Text>
            </View>
          ))}
        </View>

        {/* Spending Insights */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>📊 Spending Insights</Text>
          {insights.map((insight) => (
            <TouchableOpacity
              key={insight.id}
              style={[styles.insightCard, { borderLeftColor: getInsightColor(insight.impact) }]}
              onPress={() => insight.actionable && Alert.alert(insight.title, insight.description)}
            >
              <View style={styles.insightHeader}>
                <Text style={styles.insightIcon}>{getInsightIcon(insight.type)}</Text>
                <View style={styles.insightContent}>
                  <Text style={styles.insightTitle}>{insight.title}</Text>
                  <Text style={styles.insightCategory}>{insight.category}</Text>
                </View>
                <Text style={styles.insightImpact}>{insight.impact.toUpperCase()}</Text>
              </View>
              <Text style={styles.insightDescription}>{insight.description}</Text>
              {insight.actionable && (
                <Text style={styles.actionableText}>Tap for more details</Text>
              )}
            </TouchableOpacity>
          ))}
        </View>

        {/* Refresh Button */}
        <TouchableOpacity style={styles.refreshButton} onPress={loadInsights}>
          <Text style={styles.refreshButtonText}>🔄 Refresh Analysis</Text>
        </TouchableOpacity>
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
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  closeButton: {
    fontSize: 24,
    color: '#666',
    padding: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  loadingSubtext: {
    fontSize: 14,
    color: '#666',
  },
  healthCard: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  healthTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 15,
  },
  scoreContainer: {
    alignItems: 'center',
    marginBottom: 15,
  },
  scoreNumber: {
    fontSize: 48,
    fontWeight: 'bold',
  },
  scoreLabel: {
    fontSize: 16,
    color: '#666',
    marginTop: 5,
  },
  healthDescription: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  section: {
    marginBottom: 25,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 15,
  },
  adviceCard: {
    backgroundColor: '#FFF',
    borderRadius: 8,
    padding: 15,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  adviceText: {
    fontSize: 14,
    color: '#333',
    lineHeight: 20,
  },
  insightCard: {
    backgroundColor: '#FFF',
    borderRadius: 8,
    padding: 15,
    marginBottom: 10,
    borderLeftWidth: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  insightHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  insightIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  insightContent: {
    flex: 1,
  },
  insightTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  insightCategory: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  insightImpact: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#666',
  },
  insightDescription: {
    fontSize: 14,
    color: '#666',
    lineHeight: 18,
  },
  actionableText: {
    fontSize: 12,
    color: '#007AFF',
    marginTop: 8,
    fontWeight: '500',
  },
  refreshButton: {
    backgroundColor: '#007AFF',
    borderRadius: 8,
    padding: 14,
    alignItems: 'center',
    marginTop: 10,
  },
  refreshButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
  },
});