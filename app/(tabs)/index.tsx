import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  RefreshControl,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeInDown, FadeOutUp } from 'react-native-reanimated';
import { useFocusEffect, router } from 'expo-router';
import { Todo } from '@/types/todo';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { storage } from '@/utils/storage';
import { notificationService } from '@/utils/notifications';
import { sortTodos, filterTodos } from '@/utils/helpers';
import TodoItem from '@/components/TodoItem';
import AddTodoButton from '@/components/AddTodoButton';

export default function HomeScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'dark'];
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filteredTodos, setFilteredTodos] = useState<Todo[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<SortOption>('priority');
  const [filterBy, setFilterBy] = useState<FilterOption>('all');
  const [showCompleted, setShowCompleted] = useState(true);
  const [showFilters, setShowFilters] = useState(false);

  const loadTodos = useCallback(async () => {
    const loadedTodos = await storage.getTodos();
    setTodos(loadedTodos);
    applyFilters(loadedTodos, searchQuery, sortBy, filterBy, showCompleted);
  }, [searchQuery, sortBy, filterBy, showCompleted]);

  const applyFilters = (
    todosList: Todo[],
    query: string,
    sort: SortOption,
    filter: FilterOption,
    showComp: boolean
  ) => {
    let filtered = filterTodos(todosList, {
      searchQuery: query,
      status: filter !== 'all' ? filter : undefined,
      showCompleted: showComp,
    });
    filtered = sortTodos(filtered, sort);
    setFilteredTodos(filtered);
  };

  useFocusEffect(
    useCallback(() => {
      loadTodos();
    }, [loadTodos])
  );

  useEffect(() => {
    applyFilters(todos, searchQuery, sortBy, filterBy, showCompleted);
  }, [searchQuery, sortBy, filterBy, showCompleted, todos]);

  const handleToggle = async (id: string) => {
    await storage.toggleTodo(id);
    const todo = todos.find((t) => t.id === id);
    if (todo) {
      if (todo.notificationId && !todo.completed) {
        await notificationService.cancelNotification(todo.notificationId);
      }
    }
    loadTodos();
  };

  const handleDelete = async (id: string) => {
    const todo = todos.find((t) => t.id === id);
    if (todo?.notificationId) {
      await notificationService.cancelNotification(todo.notificationId);
    }
    await storage.deleteTodo(id);
    loadTodos();
  };

  const handlePressTodo = (todo: Todo) => {
    router.push({
      pathname: '/modal',
      params: { todoId: todo.id },
    });
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadTodos();
    setRefreshing(false);
  };

  const completedCount = todos.filter((t) => t.completed).length;
  const pendingCount = todos.filter((t) => !t.completed).length;

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top']}>
      <StatusBar style="light" />
      
      <View style={styles.header}>
        <View>
          <Text style={[styles.title, { color: colors.text }]}>My Todos</Text>
            <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
              {pendingCount} pending • {completedCount} completed
            </Text>
        </View>
        <TouchableOpacity
          onPress={() => setShowFilters(!showFilters)}
          style={[styles.filterButton, { backgroundColor: colors.surface }]}
        >
          <Ionicons name="filter" size={24} color={colors.accent} />
        </TouchableOpacity>
      </View>

      {showFilters && (
        <Animated.View
          entering={FadeInDown.duration(300)}
          exiting={FadeOutUp.duration(200)}
          style={[styles.filtersContainer, { backgroundColor: colors.surface }]}
        >
          <View style={styles.filterRow}>
            <Text style={[styles.filterLabel, { color: colors.textSecondary }]}>Sort:</Text>
            {(['priority', 'deadline', 'created'] as SortOption[]).map((option) => (
              <TouchableOpacity
                key={option}
                onPress={() => setSortBy(option)}
                style={[
                  styles.filterChip,
                  sortBy === option && { backgroundColor: colors.primary },
                ]}
              >
                <Text
                  style={[
                    styles.filterChipText,
                    { color: sortBy === option ? '#fff' : colors.text },
                  ]}
                >
                  {option}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
          <View style={styles.filterRow}>
            <Text style={[styles.filterLabel, { color: colors.textSecondary }]}>Filter:</Text>
            {(['all', 'pending', 'in-progress', 'completed'] as FilterOption[]).map((option) => (
              <TouchableOpacity
                key={option}
                onPress={() => setFilterBy(option)}
                style={[
                  styles.filterChip,
                  filterBy === option && { backgroundColor: colors.primary },
                ]}
              >
                <Text
                  style={[
                    styles.filterChipText,
                    { color: filterBy === option ? '#fff' : colors.text },
                  ]}
                >
                  {option}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
          <TouchableOpacity
            onPress={() => setShowCompleted(!showCompleted)}
            style={styles.toggleRow}
          >
            <Text style={[styles.filterLabel, { color: colors.textSecondary }]}>
              Show completed
            </Text>
            <Ionicons
              name={showCompleted ? 'checkbox' : 'square-outline'}
              size={20}
              color={colors.accent}
            />
          </TouchableOpacity>
        </Animated.View>
      )}

      <View style={[styles.searchContainer, { backgroundColor: colors.surface }]}>
        <Ionicons name="search" size={20} color={colors.textSecondary} />
        <TextInput
          style={[styles.searchInput, { color: colors.text }]}
          placeholder="Search todos..."
          placeholderTextColor={colors.textSecondary}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity onPress={() => setSearchQuery('')}>
            <Ionicons name="close-circle" size={20} color={colors.textSecondary} />
          </TouchableOpacity>
        )}
      </View>

      <FlatList
        data={filteredTodos}
        keyExtractor={(item) => item.id}
        renderItem={({ item, index }) => (
          <Animated.View
            entering={FadeInDown.delay(index * 50).duration(400)}
            exiting={FadeOutUp.duration(200)}
          >
            <TodoItem
              todo={item}
              onToggle={handleToggle}
              onPress={handlePressTodo}
              onDelete={handleDelete}
            />
          </Animated.View>
        )}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="checkmark-done-circle-outline" size={64} color={colors.textSecondary} />
            <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
              {searchQuery ? 'No todos found' : 'No todos yet'}
            </Text>
            <Text style={[styles.emptySubtext, { color: colors.textSecondary }]}>
              {searchQuery ? 'Try a different search' : 'Tap + to add your first todo'}
            </Text>
          </View>
        }
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={colors.primary}
            colors={[colors.primary]}
          />
        }
      />

      <AddTodoButton onPress={() => router.push('/modal')} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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
  filterButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  filtersContainer: {
    marginHorizontal: 20,
    marginBottom: 12,
    padding: 16,
    borderRadius: 16,
  },
  filterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    flexWrap: 'wrap',
    gap: 8,
  },
  filterLabel: {
    fontSize: 14,
    fontWeight: '600',
    marginRight: 8,
    minWidth: 60,
  },
  filterChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    backgroundColor: 'rgba(124, 58, 237, 0.2)',
  },
  filterChipText: {
    fontSize: 12,
    fontWeight: '500',
    textTransform: 'capitalize',
  },
  toggleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 4,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 20,
    marginBottom: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    gap: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
  },
  listContent: {
    paddingHorizontal: 20,
    paddingBottom: 100,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 80,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: 16,
  },
  emptySubtext: {
    fontSize: 14,
    marginTop: 8,
  },
});
