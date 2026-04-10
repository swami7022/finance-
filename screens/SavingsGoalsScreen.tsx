/**
 * Savings Goals Screen
 * Allows users to set and track savings goals
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
  SafeAreaView,
  ProgressBarAndroid,
  Platform,
  BackHandler,
} from 'react-native';
import { useAuth } from '@/context/AuthContext';
import { getMockUser } from '@/utils/mockData';

interface SavingsGoal {
  id: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  deadline: string;
  category: string;
}

interface SavingsGoalsScreenProps {
  onClose: () => void;
}

export const SavingsGoalsScreen: React.FC<SavingsGoalsScreenProps> = ({ onClose }) => {
  const [goals, setGoals] = useState<SavingsGoal[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [goalName, setGoalName] = useState('');
  const [targetAmount, setTargetAmount] = useState('');
  const [deadline, setDeadline] = useState('');
  const [category, setCategory] = useState('General');
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

  // Load mock goals
  useEffect(() => {
    const mockGoals: SavingsGoal[] = [
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
    setGoals(mockGoals);
  }, []);

  const handleAddGoal = () => {
    if (!goalName.trim() || !targetAmount.trim()) {
      Alert.alert('Error', 'Please enter goal name and target amount');
      return;
    }

    const amount = parseFloat(targetAmount);
    if (isNaN(amount) || amount <= 0) {
      Alert.alert('Error', 'Please enter a valid target amount');
      return;
    }

    const newGoal: SavingsGoal = {
      id: Date.now().toString(),
      name: goalName.trim(),
      targetAmount: amount,
      currentAmount: 0,
      deadline: deadline || '2025-12-31',
      category,
    };

    setGoals([...goals, newGoal]);
    setGoalName('');
    setTargetAmount('');
    setDeadline('');
    setCategory('General');
    setShowAddForm(false);
    Alert.alert('Success', 'Savings goal added!');
  };

  const handleContribute = (goalId: string) => {
    Alert.alert(
      'Add to Goal',
      'Enter amount to add to this savings goal:',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Add',
          onPress: (amount?: string) => {
            if (amount && !isNaN(parseFloat(amount))) {
              setGoals(goals.map(goal =>
                goal.id === goalId
                  ? { ...goal, currentAmount: goal.currentAmount + parseFloat(amount) }
                  : goal
              ));
              Alert.alert('Success', `₹${parseFloat(amount).toLocaleString('en-IN')} added to your goal!`);
            }
          },
        },
      ],
      { cancelable: true }
    );
  };

  const getProgressPercentage = (current: number, target: number) => {
    return Math.min((current / target) * 100, 100);
  };

  const getDaysLeft = (deadline: string) => {
    const today = new Date();
    const deadlineDate = new Date(deadline);
    const diffTime = deadlineDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 0;
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <TouchableOpacity onPress={onClose}>
            <Text style={styles.closeButton}>✕</Text>
          </TouchableOpacity>
          <Text style={styles.title}>Savings Goals</Text>
          <TouchableOpacity onPress={() => setShowAddForm(!showAddForm)}>
            <Text style={styles.addButton}>{showAddForm ? '✕' : '+'}</Text>
          </TouchableOpacity>
        </View>

        {showAddForm && (
          <View style={styles.addForm}>
            <Text style={styles.formTitle}>Add New Goal</Text>

            <TextInput
              style={styles.input}
              placeholder="Goal name (e.g., Emergency Fund)"
              value={goalName}
              onChangeText={setGoalName}
            />

            <TextInput
              style={styles.input}
              placeholder="Target amount (e.g., 5000)"
              keyboardType="numeric"
              value={targetAmount}
              onChangeText={setTargetAmount}
            />

            <TextInput
              style={styles.input}
              placeholder="Deadline (YYYY-MM-DD)"
              value={deadline}
              onChangeText={setDeadline}
            />

            <Text style={styles.categoryLabel}>Category</Text>
            <View style={styles.categoryButtons}>
              {['Festival', 'Emergency', 'Travel', 'Electronics', 'Education', 'Health', 'Home'].map((cat) => (
                <TouchableOpacity
                  key={cat}
                  style={[styles.categoryButton, category === cat && styles.categoryButtonActive]}
                  onPress={() => setCategory(cat)}
                >
                  <Text style={[styles.categoryButtonText, category === cat && styles.categoryButtonTextActive]}>
                    {cat}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <TouchableOpacity style={styles.addGoalButton} onPress={handleAddGoal}>
              <Text style={styles.addGoalButtonText}>Add Goal</Text>
            </TouchableOpacity>
          </View>
        )}

        <View style={styles.goalsList}>
          {goals.map((goal) => (
            <View key={goal.id} style={styles.goalCard}>
              <View style={styles.goalHeader}>
                <Text style={styles.goalName}>{goal.name}</Text>
                <Text style={styles.goalCategory}>{goal.category}</Text>
              </View>

              <View style={styles.progressContainer}>
                <Text style={styles.progressText}>
                  ₹{goal.currentAmount.toLocaleString('en-IN')} / ₹{goal.targetAmount.toLocaleString('en-IN')}
                </Text>
                <Text style={styles.progressPercent}>
                  {getProgressPercentage(goal.currentAmount, goal.targetAmount).toFixed(1)}%
                </Text>
              </View>

              {Platform.OS === 'android' ? (
                <ProgressBarAndroid
                  styleAttr="Horizontal"
                  indeterminate={false}
                  progress={getProgressPercentage(goal.currentAmount, goal.targetAmount) / 100}
                  color="#007AFF"
                />
              ) : (
                <View style={styles.progressBar}>
                  <View
                    style={[
                      styles.progressFill,
                      {
                        width: `${getProgressPercentage(goal.currentAmount, goal.targetAmount)}%`,
                      },
                    ]}
                  />
                </View>
              )}

              <View style={styles.goalFooter}>
                <Text style={styles.deadlineText}>
                  {getDaysLeft(goal.deadline)} days left
                </Text>
                <TouchableOpacity
                  style={styles.contributeButton}
                  onPress={() => handleContribute(goal.id)}
                >
                  <Text style={styles.contributeButtonText}>Add Money</Text>
                </TouchableOpacity>
              </View>
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
  addButton: {
    fontSize: 24,
    color: '#007AFF',
    padding: 8,
  },
  addForm: {
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
  formTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 15,
  },
  input: {
    borderWidth: 1,
    borderColor: '#DDD',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    fontSize: 16,
  },
  addGoalButton: {
    backgroundColor: '#28A745',
    borderRadius: 8,
    padding: 14,
    alignItems: 'center',
  },
  addGoalButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
  },
  goalsList: {
    gap: 15,
  },
  goalCard: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  goalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  goalName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  goalCategory: {
    fontSize: 12,
    color: '#666',
    backgroundColor: '#F0F0F0',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  progressContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  progressText: {
    fontSize: 14,
    color: '#666',
  },
  progressPercent: {
    fontSize: 14,
    fontWeight: '600',
    color: '#007AFF',
  },
  progressBar: {
    height: 8,
    backgroundColor: '#E0E0E0',
    borderRadius: 4,
    marginBottom: 15,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#007AFF',
    borderRadius: 4,
  },
  goalFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  deadlineText: {
    fontSize: 12,
    color: '#666',
  },
  contributeButton: {
    backgroundColor: '#007AFF',
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  contributeButtonText: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: '600',
  },
  categoryLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
    marginTop: 12,
  },
  categoryButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 16,
  },
  categoryButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    backgroundColor: '#FFF',
  },
  categoryButtonActive: {
    borderColor: '#007AFF',
    backgroundColor: '#E3F2FD',
  },
  categoryButtonText: {
    fontSize: 12,
    color: '#666',
  },
  categoryButtonTextActive: {
    color: '#007AFF',
    fontWeight: '600',
  },
});