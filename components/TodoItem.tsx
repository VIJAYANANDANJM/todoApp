import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { Todo } from '@/types/todo';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { formatDate, getPriorityColor, getCategoryIcon } from '@/utils/helpers';

interface TodoItemProps {
  todo: Todo;
  onToggle: (id: string) => void;
  onPress: (todo: Todo) => void;
  onDelete: (id: string) => void;
}

const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);

export default function TodoItem({ todo, onToggle, onPress, onDelete }: TodoItemProps) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'dark'];
  const scale = useSharedValue(1);
  const opacity = useSharedValue(1);
  const translateX = useSharedValue(0);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { scale: scale.value },
        { translateX: translateX.value },
      ],
      opacity: opacity.value,
    };
  });

  const handlePressIn = () => {
    scale.value = withSpring(0.95);
  };

  const handlePressOut = () => {
    scale.value = withSpring(1);
  };

  const handleDelete = () => {
    translateX.value = withTiming(-500, { duration: 300 });
    opacity.value = withTiming(0, { duration: 300 }, () => {
      onDelete(todo.id);
    });
  };

  const priorityColor = getPriorityColor(todo.priority);
  const categoryIcon = getCategoryIcon(todo.category);

  return (
    <AnimatedTouchable
      style={[styles.container, animatedStyle]}
      onPress={() => onPress(todo)}
      onLongPress={handleDelete}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      activeOpacity={0.7}
    >
      <View style={[styles.card, { backgroundColor: colors.card }]}>
        <TouchableOpacity
          onPress={() => onToggle(todo.id)}
          style={styles.checkboxContainer}
        >
          <View
            style={[
              styles.checkbox,
              {
                borderColor: todo.completed ? priorityColor : colors.border,
                backgroundColor: todo.completed ? priorityColor : 'transparent',
              },
            ]}
          >
            {todo.completed && (
              <Ionicons name="checkmark" size={16} color="#fff" />
            )}
          </View>
        </TouchableOpacity>

        <View style={styles.content}>
          <View style={styles.header}>
            <Text
              style={[
                styles.title,
                { color: colors.text },
                todo.completed && styles.completedTitle,
              ]}
              numberOfLines={1}
            >
              {todo.title}
            </Text>
            <View style={[styles.priorityBadge, { backgroundColor: priorityColor + '20' }]}>
              <View style={[styles.priorityDot, { backgroundColor: priorityColor }]} />
              <Text style={[styles.priorityText, { color: priorityColor }]}>
                {todo.priority}
              </Text>
            </View>
          </View>

          {todo.description && (
            <Text
              style={[styles.description, { color: colors.textSecondary }]}
              numberOfLines={2}
            >
              {todo.description}
            </Text>
          )}

          <View style={styles.footer}>
            <View style={styles.categoryContainer}>
              <Ionicons name={categoryIcon as any} size={14} color={colors.accent} />
              <Text style={[styles.categoryText, { color: colors.textSecondary }]}>
                {todo.category}
              </Text>
            </View>

            {todo.deadline && (
              <View style={styles.deadlineContainer}>
                <Ionicons name="time-outline" size={14} color={colors.warning} />
                <Text style={[styles.deadlineText, { color: colors.warning }]}>
                  {formatDate(todo.deadline)}
                </Text>
              </View>
            )}

            {todo.reminderTime && (
              <Ionicons name="notifications-outline" size={14} color={colors.accent} />
            )}
          </View>
        </View>
      </View>
    </AnimatedTouchable>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 12,
  },
  card: {
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'flex-start',
    shadowColor: '#7c3aed',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  checkboxContainer: {
    marginRight: 12,
    marginTop: 2,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    flex: 1,
    marginRight: 8,
  },
  completedTitle: {
    textDecorationLine: 'line-through',
    opacity: 0.6,
  },
  priorityBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  priorityDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 4,
  },
  priorityText: {
    fontSize: 10,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  description: {
    fontSize: 14,
    marginBottom: 12,
    lineHeight: 20,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flexWrap: 'wrap',
  },
  categoryContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  categoryText: {
    fontSize: 12,
    textTransform: 'capitalize',
  },
  deadlineContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  deadlineText: {
    fontSize: 12,
    fontWeight: '500',
  },
});

