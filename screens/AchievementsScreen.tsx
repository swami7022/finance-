/**
 * Achievements Screen
 * Shows user achievements, badges, and gamification elements
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  BackHandler,
} from 'react-native';
import { useAuth } from '@/context/AuthContext';
import { getMockTransactions } from '@/utils/mockData';
import {
  getAllAchievements,
  calculateUserStats,
  checkForNewAchievements,
  getRarityColor,
  getNextLevelRequirements,
  type Achievement,
  type UserStats
} from '@/utils/gamification';

interface AchievementsScreenProps {
  onClose: () => void;
}

export const AchievementsScreen: React.FC<AchievementsScreenProps> = ({ onClose }) => {
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [userStats, setUserStats] = useState<UserStats | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
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

  // Load achievements and stats
  useEffect(() => {
    loadAchievements();
  }, [email]);

  const loadAchievements = async () => {
    if (!email) return;

    try {
      const transactions = getMockTransactions(email);
      let userAchievements = getAllAchievements();
      const stats = calculateUserStats(transactions, userAchievements);

      // Check for newly unlocked achievements
      userAchievements = checkForNewAchievements(transactions, stats, userAchievements);

      setAchievements(userAchievements);
      setUserStats(stats);
    } catch (error) {
      console.error('Error loading achievements:', error);
    }
  };

  const categories = [
    { id: 'all', label: 'All', icon: '🏆' },
    { id: 'saving', label: 'Saving', icon: '💰' },
    { id: 'spending', label: 'Spending', icon: '🛒' },
    { id: 'security', label: 'Security', icon: '🛡️' },
    { id: 'goals', label: 'Goals', icon: '🎯' },
    { id: 'streak', label: 'Streaks', icon: '🔥' },
  ];

  const filteredAchievements = selectedCategory === 'all'
    ? achievements
    : achievements.filter(a => a.category === selectedCategory);

  const unlockedCount = achievements.filter(a => a.unlocked).length;
  const totalCount = achievements.length;

  if (!userStats) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading achievements...</Text>
        </View>
      </SafeAreaView>
    );
  }

  const levelInfo = getNextLevelRequirements(userStats.totalPoints);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <TouchableOpacity onPress={onClose}>
            <Text style={styles.closeButton}>✕</Text>
          </TouchableOpacity>
          <Text style={styles.title}>Achievements</Text>
          <View style={{ width: 24 }} />
        </View>

        {/* Level Progress */}
        <View style={styles.levelCard}>
          <Text style={styles.levelTitle}>Level {levelInfo.level}</Text>
          <View style={styles.pointsContainer}>
            <Text style={styles.pointsText}>{userStats.totalPoints} points</Text>
            {levelInfo.pointsNeeded > 0 && (
              <Text style={styles.pointsNeeded}>
                {levelInfo.pointsNeeded} points to next level
              </Text>
            )}
          </View>
          <View style={styles.levelBar}>
            <View
              style={[
                styles.levelProgress,
                {
                  width: levelInfo.pointsNeeded === 0 ? '100%' :
                    `${((userStats.totalPoints % 100) / 100) * 100}%`
                }
              ]}
            />
          </View>
        </View>

        {/* Stats Overview */}
        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{unlockedCount}</Text>
            <Text style={styles.statLabel}>Unlocked</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{userStats.currentStreak}</Text>
            <Text style={styles.statLabel}>Day Streak</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>₹{userStats.totalSaved.toLocaleString('en-IN')}</Text>
            <Text style={styles.statLabel}>Total Saved</Text>
          </View>
        </View>

        {/* Category Filter */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoryContainer}>
          {categories.map((category) => (
            <TouchableOpacity
              key={category.id}
              style={[
                styles.categoryButton,
                selectedCategory === category.id && styles.categoryButtonActive
              ]}
              onPress={() => setSelectedCategory(category.id)}
            >
              <Text style={styles.categoryIcon}>{category.icon}</Text>
              <Text style={[
                styles.categoryLabel,
                selectedCategory === category.id && styles.categoryLabelActive
              ]}>
                {category.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Achievements List */}
        <View style={styles.achievementsContainer}>
          <Text style={styles.sectionTitle}>
            {selectedCategory === 'all' ? 'All Achievements' :
             `${categories.find(c => c.id === selectedCategory)?.label} Achievements`}
            ({filteredAchievements.filter(a => a.unlocked).length}/{filteredAchievements.length})
          </Text>

          {filteredAchievements.map((achievement) => (
            <View
              key={achievement.id}
              style={[
                styles.achievementCard,
                achievement.unlocked && styles.achievementCardUnlocked
              ]}
            >
              <View style={styles.achievementHeader}>
                <Text style={styles.achievementIcon}>{achievement.icon}</Text>
                <View style={styles.achievementContent}>
                  <Text style={[
                    styles.achievementTitle,
                    achievement.unlocked && styles.achievementTitleUnlocked
                  ]}>
                    {achievement.title}
                  </Text>
                  <Text style={styles.achievementDescription}>
                    {achievement.description}
                  </Text>
                </View>
                <View style={styles.achievementMeta}>
                  <Text style={[
                    styles.achievementRarity,
                    { color: getRarityColor(achievement.rarity) }
                  ]}>
                    {achievement.rarity.toUpperCase()}
                  </Text>
                  <Text style={styles.achievementPoints}>
                    {achievement.points} pts
                  </Text>
                </View>
              </View>

              {!achievement.unlocked && achievement.progress !== undefined && (
                <View style={styles.progressContainer}>
                  <Text style={styles.progressText}>
                    Progress: {achievement.progress}/{achievement.maxProgress}
                  </Text>
                  <View style={styles.progressBar}>
                    <View
                      style={[
                        styles.progressFill,
                        {
                          width: achievement.maxProgress
                            ? `${(achievement.progress / achievement.maxProgress) * 100}%`
                            : '0%'
                        }
                      ]}
                    />
                  </View>
                </View>
              )}

              {achievement.unlocked && achievement.unlockedDate && (
                <Text style={styles.unlockedDate}>
                  Unlocked on {new Date(achievement.unlockedDate).toLocaleDateString()}
                </Text>
              )}
            </View>
          ))}
        </View>
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
  },
  loadingText: {
    fontSize: 18,
    color: '#333',
  },
  levelCard: {
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
  levelTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  pointsContainer: {
    marginBottom: 15,
  },
  pointsText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#007AFF',
  },
  pointsNeeded: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  levelBar: {
    height: 8,
    backgroundColor: '#E0E0E0',
    borderRadius: 4,
  },
  levelProgress: {
    height: '100%',
    backgroundColor: '#007AFF',
    borderRadius: 4,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#FFF',
    borderRadius: 8,
    padding: 15,
    marginHorizontal: 5,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 5,
  },
  categoryContainer: {
    marginBottom: 20,
  },
  categoryButton: {
    backgroundColor: '#FFF',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 10,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  categoryButtonActive: {
    backgroundColor: '#007AFF',
  },
  categoryIcon: {
    fontSize: 16,
  },
  categoryLabel: {
    fontSize: 12,
    fontWeight: '500',
    marginTop: 2,
  },
  categoryLabelActive: {
    color: '#FFF',
  },
  achievementsContainer: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 15,
  },
  achievementCard: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 15,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  achievementCardUnlocked: {
    borderLeftWidth: 4,
    borderLeftColor: '#27AE60',
  },
  achievementHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  achievementIcon: {
    fontSize: 32,
    marginRight: 12,
  },
  achievementContent: {
    flex: 1,
  },
  achievementTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#666',
  },
  achievementTitleUnlocked: {
    color: '#333',
  },
  achievementDescription: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
    lineHeight: 18,
  },
  achievementMeta: {
    alignItems: 'flex-end',
  },
  achievementRarity: {
    fontSize: 10,
    fontWeight: 'bold',
  },
  achievementPoints: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  progressContainer: {
    marginTop: 10,
  },
  progressText: {
    fontSize: 12,
    color: '#666',
    marginBottom: 5,
  },
  progressBar: {
    height: 4,
    backgroundColor: '#E0E0E0',
    borderRadius: 2,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#007AFF',
    borderRadius: 2,
  },
  unlockedDate: {
    fontSize: 12,
    color: '#27AE60',
    marginTop: 8,
    fontStyle: 'italic',
  },
});