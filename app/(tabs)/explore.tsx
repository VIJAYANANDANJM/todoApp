import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useFocusEffect } from 'expo-router';
import { Todo } from '@/types/todo';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { storage } from '@/utils/storage';
import { getPriorityColor, getCategoryIcon } from '@/utils/helpers';

export default function StatsScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'dark'];
  const [todos, setTodos] = useState<Todo[]>([]);

  useFocusEffect(
    React.useCallback(() => {
      loadTodos();
    }, [])
  );

  const loadTodos = async () => {
    const loadedTodos = await storage.getTodos();
    setTodos(loadedTodos);
  };

  const completedCount = todos.filter((t) => t.completed).length;
  const pendingCount = todos.filter((t) => !t.completed).length;
  const inProgressCount = todos.filter((t) => t.status === 'in-progress').length;
  const totalCount = todos.length;
  const completionRate = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  const priorityStats = {
    urgent: todos.filter((t) => t.priority === 'urgent' && !t.completed).length,
    high: todos.filter((t) => t.priority === 'high' && !t.completed).length,
    medium: todos.filter((t) => t.priority === 'medium' && !t.completed).length,
    low: todos.filter((t) => t.priority === 'low' && !t.completed).length,
  };

  const categoryStats = {
    personal: todos.filter((t) => t.category === 'personal').length,
    work: todos.filter((t) => t.category === 'work').length,
    shopping: todos.filter((t) => t.category === 'shopping').length,
    health: todos.filter((t) => t.category === 'health').length,
    other: todos.filter((t) => t.category === 'other').length,
  };

  const overdueCount = todos.filter(
    (t) => !t.completed && t.deadline && t.deadline < new Date()
  ).length;

  const upcomingDeadlines = todos
    .filter((t) => !t.completed && t.deadline && t.deadline > new Date())
    .sort((a, b) => (a.deadline?.getTime() || 0) - (b.deadline?.getTime() || 0))
    .slice(0, 5);

  const StatCard = ({
    title,
    value,
    icon,
    color,
    delay = 0,
  }: {
    title: string;
    value: string | number;
    icon: string;
    color: string;
    delay?: number;
  }) => (
    <Animated.View
      entering={FadeInDown.delay(delay).duration(400)}
      style={[styles.statCard, { backgroundColor: colors.card }]}
    >
      <View style={[styles.statIconContainer, { backgroundColor: color + '20' }]}>
        <Ionicons name={icon as any} size={24} color={color} />
      </View>
      <Text style={[styles.statValue, { color: colors.text }]}>{value}</Text>
      <Text style={[styles.statTitle, { color: colors.textSecondary }]}>{title}</Text>
    </Animated.View>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top']}>
      <StatusBar style="light" />
      
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.text }]}>Statistics</Text>
        <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
          Track your productivity
        </Text>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.statsGrid}>
          <StatCard
            title="Total Todos"
            value={totalCount}
            icon="list"
            color={colors.primary}
            delay={0}
          />
          <StatCard
            title="Completed"
            value={completedCount}
            icon="checkmark-circle"
            color={colors.success}
            delay={50}
          />
          <StatCard
            title="Pending"
            value={pendingCount}
            icon="time"
            color={colors.warning}
            delay={100}
          />
          <StatCard
            title="In Progress"
            value={inProgressCount}
            icon="sync"
            color={colors.accent}
            delay={150}
          />
        </View>

        <Animated.View
          entering={FadeInDown.delay(200).duration(400)}
          style={[styles.progressCard, { backgroundColor: colors.card }]}
        >
          <View style={styles.progressHeader}>
            <Text style={[styles.progressTitle, { color: colors.text }]}>Completion Rate</Text>
            <Text style={[styles.progressPercentage, { color: colors.primary }]}>
              {completionRate}%
            </Text>
          </View>
          <View style={[styles.progressBar, { backgroundColor: colors.surface }]}>
            <Animated.View
              style={[
                styles.progressFill,
                {
                  width: `${completionRate}%`,
                  backgroundColor: colors.primary,
                },
              ]}
            />
          </View>
        </Animated.View>

        <Animated.View
          entering={FadeInDown.delay(250).duration(400)}
          style={[styles.section, { backgroundColor: colors.card }]}
        >
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Priority Distribution</Text>
          <View style={styles.priorityList}>
            {(['urgent', 'high', 'medium', 'low'] as const).map((priority, index) => (
              <View key={priority} style={styles.priorityItem}>
                <View style={styles.priorityLeft}>
                  <View
                    style={[
                      styles.priorityDot,
                      { backgroundColor: getPriorityColor(priority) },
                    ]}
                  />
                  <Text style={[styles.priorityText, { color: colors.text }]}>
                    {priority.toUpperCase()}
                  </Text>
                </View>
                <Text style={[styles.priorityCount, { color: colors.textSecondary }]}>
                  {priorityStats[priority]}
                </Text>
              </View>
            ))}
          </View>
        </Animated.View>

        <Animated.View
          entering={FadeInDown.delay(300).duration(400)}
          style={[styles.section, { backgroundColor: colors.card }]}
        >
          <Text style={[styles.sectionTitle, { color: colors.text }]}>By Category</Text>
          <View style={styles.categoryGrid}>
            {Object.entries(categoryStats).map(([category, count], index) => (
              <View
                key={category}
                style={[styles.categoryItem, { backgroundColor: colors.surface }]}
              >
                <Ionicons
                  name={getCategoryIcon(category) as any}
                  size={20}
                  color={colors.accent}
                />
                <Text style={[styles.categoryName, { color: colors.text }]}>
                  {category}
                </Text>
                <Text style={[styles.categoryCount, { color: colors.textSecondary }]}>
                  {count}
                </Text>
              </View>
            ))}
          </View>
        </Animated.View>

        {overdueCount > 0 && (
          <Animated.View
            entering={FadeInDown.delay(350).duration(400)}
            style={[styles.alertCard, { backgroundColor: colors.error + '20' }]}
          >
            <Ionicons name="alert-circle" size={24} color={colors.error} />
            <View style={styles.alertContent}>
              <Text style={[styles.alertTitle, { color: colors.error }]}>
                {overdueCount} Overdue {overdueCount === 1 ? 'Todo' : 'Todos'}
              </Text>
              <Text style={[styles.alertText, { color: colors.textSecondary }]}>
                Complete them to stay on track!
              </Text>
            </View>
          </Animated.View>
        )}

        {upcomingDeadlines.length > 0 && (
          <Animated.View
            entering={FadeInDown.delay(400).duration(400)}
            style={[styles.section, { backgroundColor: colors.card }]}
          >
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Upcoming Deadlines</Text>
            {upcomingDeadlines.map((todo) => (
              <View key={todo.id} style={styles.deadlineItem}>
                <View style={styles.deadlineLeft}>
                  <Ionicons name="calendar" size={16} color={colors.warning} />
                  <Text style={[styles.deadlineTitle, { color: colors.text }]} numberOfLines={1}>
                    {todo.title}
                  </Text>
                </View>
                <Text style={[styles.deadlineDate, { color: colors.textSecondary }]}>
                  {todo.deadline?.toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                  })}
                </Text>
              </View>
            ))}
          </Animated.View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
  },
  subtitle: {
    fontSize: 14,
    marginTop: 4,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    gap: 20,
    paddingBottom: 40,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  statCard: {
    flex: 1,
    minWidth: '45%',
    padding: 16,
    borderRadius: 16,
    alignItems: 'center',
  },
  statIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  statTitle: {
    fontSize: 12,
    textTransform: 'uppercase',
  },
  progressCard: {
    padding: 20,
    borderRadius: 16,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  progressTitle: {
    fontSize: 16,
    fontWeight: '600',
  },
  progressPercentage: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  progressBar: {
    height: 8,
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
  },
  section: {
    padding: 20,
    borderRadius: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  priorityList: {
    gap: 12,
  },
  priorityItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  priorityLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  priorityDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  priorityText: {
    fontSize: 14,
    fontWeight: '500',
  },
  priorityCount: {
    fontSize: 16,
    fontWeight: '600',
  },
  categoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  categoryItem: {
    flex: 1,
    minWidth: '30%',
    padding: 12,
    borderRadius: 12,
    alignItems: 'center',
    gap: 8,
  },
  categoryName: {
    fontSize: 12,
    textTransform: 'capitalize',
    fontWeight: '500',
  },
  categoryCount: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  alertCard: {
    flexDirection: 'row',
    padding: 16,
    borderRadius: 16,
    alignItems: 'center',
    gap: 12,
  },
  alertContent: {
    flex: 1,
  },
  alertTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  alertText: {
    fontSize: 14,
  },
  deadlineItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(124, 58, 237, 0.1)',
  },
  deadlineLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  deadlineTitle: {
    fontSize: 14,
    flex: 1,
  },
  deadlineDate: {
    fontSize: 12,
  },
});
