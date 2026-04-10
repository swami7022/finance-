/**
 * Carbon Footprint Screen
 * Shows environmental impact of user's spending
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
import { getMockTransactions } from '@/utils/mockData';
import {
  calculateCarbonFootprint,
  getEnvironmentalRating,
  type CarbonFootprint,
  type CarbonCategory
} from '@/utils/carbonFootprint';

interface CarbonFootprintScreenProps {
  onClose: () => void;
}

export const CarbonFootprintScreen: React.FC<CarbonFootprintScreenProps> = ({ onClose }) => {
  const [footprint, setFootprint] = useState<CarbonFootprint | null>(null);
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

  // Load carbon footprint data
  useEffect(() => {
    loadCarbonData();
  }, [email]);

  const loadCarbonData = async () => {
    if (!email) return;

    try {
      const transactions = getMockTransactions(email);
      const carbonData = calculateCarbonFootprint(transactions);
      setFootprint(carbonData);
    } catch (error) {
      console.error('Error loading carbon data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleOffsetPurchase = () => {
    if (!footprint) return;

    Alert.alert(
      'Offset Your Carbon Footprint',
      `Would you like to purchase carbon credits to offset your ${footprint.totalEmissions.toFixed(1)} kg CO2 emissions? This will cost approximately ₹${footprint.offsetAmount.toLocaleString('en-IN')}.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Purchase Credits',
          onPress: () => {
            Alert.alert('Success!', 'Thank you for offsetting your carbon footprint! 🌱');
          },
        },
      ]
    );
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Calculating your carbon footprint...</Text>
          <Text style={styles.loadingSubtext}>Analyzing your spending impact</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!footprint) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Unable to load carbon data</Text>
        </View>
      </SafeAreaView>
    );
  }

  const rating = getEnvironmentalRating(footprint.totalEmissions);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <TouchableOpacity onPress={onClose}>
            <Text style={styles.closeButton}>✕</Text>
          </TouchableOpacity>
          <Text style={styles.title}>Carbon Footprint</Text>
          <View style={{ width: 24 }} />
        </View>

        {/* Environmental Rating */}
        <View style={[styles.ratingCard, { borderLeftColor: rating.color }]}>
          <Text style={styles.ratingTitle}>Your Rating</Text>
          <Text style={[styles.ratingText, { color: rating.color }]}>
            {rating.rating}
          </Text>
          <Text style={styles.ratingDescription}>{rating.description}</Text>
        </View>

        {/* Carbon Summary */}
        <View style={styles.summaryCard}>
          <Text style={styles.summaryTitle}>Monthly Impact</Text>
          <View style={styles.metricsContainer}>
            <View style={styles.metric}>
              <Text style={styles.metricValue}>{footprint.totalEmissions.toFixed(1)}</Text>
              <Text style={styles.metricUnit}>kg CO2</Text>
              <Text style={styles.metricLabel}>Total Emissions</Text>
            </View>
            <View style={styles.metric}>
              <Text style={styles.metricValue}>{footprint.averagePerTransaction.toFixed(1)}</Text>
              <Text style={styles.metricUnit}>kg CO2</Text>
              <Text style={styles.metricLabel}>Per Transaction</Text>
            </View>
            <View style={styles.metric}>
              <Text style={styles.metricValue}>
                {footprint.monthlyTrend > 0 ? '+' : ''}{footprint.monthlyTrend.toFixed(1)}%
              </Text>
              <Text style={styles.metricUnit}>vs last month</Text>
              <Text style={styles.metricLabel}>Trend</Text>
            </View>
          </View>
        </View>

        {/* Category Breakdown */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>📊 Emissions by Category</Text>
          {footprint.categories.map((category, index) => (
            <View key={index} style={styles.categoryCard}>
              <View style={styles.categoryHeader}>
                <View style={styles.categoryInfo}>
                  <Text style={styles.categoryName}>{category.name}</Text>
                  <Text style={styles.categoryEmissions}>
                    {category.emissions.toFixed(1)} kg CO2 ({category.percentage.toFixed(1)}%)
                  </Text>
                </View>
                <View style={[styles.categoryColor, { backgroundColor: category.color }]} />
              </View>
              <View style={styles.categoryBar}>
                <View
                  style={[
                    styles.categoryBarFill,
                    {
                      width: `${category.percentage}%`,
                      backgroundColor: category.color
                    }
                  ]}
                />
              </View>
            </View>
          ))}
        </View>

        {/* Carbon Offset */}
        <View style={styles.offsetCard}>
          <Text style={styles.offsetTitle}>🌱 Offset Your Impact</Text>
          <Text style={styles.offsetDescription}>
            Neutralize your carbon footprint by purchasing carbon credits.
            For ₹{footprint.offsetAmount.toLocaleString('en-IN')}, you can offset your monthly emissions.
          </Text>
          <TouchableOpacity style={styles.offsetButton} onPress={handleOffsetPurchase}>
            <Text style={styles.offsetButtonText}>Purchase Carbon Credits</Text>
          </TouchableOpacity>
        </View>

        {/* Tips Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>💡 Reduction Tips</Text>
          {footprint.categories.slice(0, 2).map((category, index) => (
            <View key={index} style={styles.tipsCard}>
              <Text style={styles.tipsCategory}>{category.name} Tips:</Text>
              {category.tips.slice(0, 2).map((tip, tipIndex) => (
                <Text key={tipIndex} style={styles.tipText}>• {tip}</Text>
              ))}
            </View>
          ))}
        </View>

        {/* Refresh Button */}
        <TouchableOpacity style={styles.refreshButton} onPress={loadCarbonData}>
          <Text style={styles.refreshButtonText}>🔄 Recalculate Footprint</Text>
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
  ratingCard: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    borderLeftWidth: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  ratingTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 10,
  },
  ratingText: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  ratingDescription: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  summaryCard: {
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
  summaryTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 15,
  },
  metricsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  metric: {
    flex: 1,
    alignItems: 'center',
  },
  metricValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  metricUnit: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  metricLabel: {
    fontSize: 10,
    color: '#666',
    marginTop: 2,
    textAlign: 'center',
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
  categoryCard: {
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
  categoryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  categoryInfo: {
    flex: 1,
  },
  categoryName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  categoryEmissions: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  categoryColor: {
    width: 20,
    height: 20,
    borderRadius: 10,
  },
  categoryBar: {
    height: 6,
    backgroundColor: '#E0E0E0',
    borderRadius: 3,
  },
  categoryBarFill: {
    height: '100%',
    borderRadius: 3,
  },
  offsetCard: {
    backgroundColor: '#E8F5E8',
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#27AE60',
  },
  offsetTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#27AE60',
    marginBottom: 10,
  },
  offsetDescription: {
    fontSize: 14,
    color: '#333',
    lineHeight: 20,
    marginBottom: 15,
  },
  offsetButton: {
    backgroundColor: '#27AE60',
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
  },
  offsetButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
  },
  tipsCard: {
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
  tipsCategory: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  tipText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
    marginBottom: 5,
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