import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import DatePickerModal from '@/components/DatePickerModal';
import { Todo, TodoPriority, TodoCategory } from '@/types/todo';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { storage } from '@/utils/storage';
import { notificationService } from '@/utils/notifications';
import { generateId, formatDateTime } from '@/utils/helpers';

const priorities: TodoPriority[] = ['low', 'medium', 'high', 'urgent'];
const categories: TodoCategory[] = ['personal', 'work', 'shopping', 'health', 'other'];

export default function TodoModal() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'dark'];
  const { todoId } = useLocalSearchParams();
  const isEditing = !!todoId;

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<TodoPriority>('medium');
  const [category, setCategory] = useState<TodoCategory>('personal');
  const [deadline, setDeadline] = useState<Date | undefined>(undefined);
  const [reminderTime, setReminderTime] = useState<Date | undefined>(undefined);
  const [showDeadlinePicker, setShowDeadlinePicker] = useState(false);
  const [showReminderPicker, setShowReminderPicker] = useState(false);
  const [status, setStatus] = useState<'pending' | 'in-progress' | 'completed'>('pending');

  const loadTodo = useCallback(async () => {
    const todos = await storage.getTodos();
    const todo = todos.find((t) => t.id === todoId);
    if (todo) {
      setTitle(todo.title);
      setDescription(todo.description || '');
      setPriority(todo.priority);
      setCategory(todo.category);
      setDeadline(todo.deadline);
      setReminderTime(todo.reminderTime);
      setStatus(todo.status);
    }
  }, [todoId]);

  useEffect(() => {
    if (isEditing && todoId) {
      loadTodo();
    }
  }, [isEditing, todoId, loadTodo]);

  const handleSave = async () => {
    if (!title.trim()) {
      return;
    }

    const now = new Date();
    let notificationId: string | null = null;

    if (reminderTime && reminderTime > now) {
      const todoForNotification: Todo = {
        id: isEditing ? todoId as string : generateId(),
        title,
        description,
        completed: status === 'completed',
        priority,
        category,
        status,
        deadline,
        reminderTime,
        createdAt: now,
        updatedAt: now,
      };
      notificationId = await notificationService.scheduleNotification(todoForNotification);
    }

    const todo: Todo = {
      id: isEditing ? (todoId as string) : generateId(),
      title: title.trim(),
      description: description.trim() || undefined,
      completed: status === 'completed',
      priority,
      category,
      status,
      deadline,
      reminderTime,
      createdAt: isEditing ? new Date() : now,
      updatedAt: now,
      notificationId: notificationId || undefined,
    };

    if (isEditing) {
      const existingTodos = await storage.getTodos();
      const existingTodo = existingTodos.find((t) => t.id === todoId);
      if (existingTodo?.notificationId && existingTodo.notificationId !== notificationId) {
        await notificationService.cancelNotification(existingTodo.notificationId);
      }
      await storage.updateTodo(todoId as string, todo);
    } else {
      await storage.addTodo(todo);
    }

    router.back();
  };

  const handleDelete = async () => {
    if (isEditing && todoId) {
      const todos = await storage.getTodos();
      const todo = todos.find((t) => t.id === todoId);
      if (todo?.notificationId) {
        await notificationService.cancelNotification(todo.notificationId);
      }
      await storage.deleteTodo(todoId as string);
      router.back();
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top']}>
      <StatusBar style="light" />
      
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.closeButton}>
          <Ionicons name="close" size={28} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>
          {isEditing ? 'Edit Todo' : 'New Todo'}
        </Text>
        {isEditing && (
          <TouchableOpacity onPress={handleDelete} style={styles.deleteButton}>
            <Ionicons name="trash-outline" size={24} color={colors.error} />
          </TouchableOpacity>
        )}
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={[styles.inputContainer, { backgroundColor: colors.surface }]}>
          <TextInput
            style={[styles.titleInput, { color: colors.text }]}
            placeholder="Todo title"
            placeholderTextColor={colors.textSecondary}
            value={title}
            onChangeText={setTitle}
            autoFocus
          />
        </View>

        <View style={[styles.inputContainer, { backgroundColor: colors.surface }]}>
          <TextInput
            style={[styles.descriptionInput, { color: colors.text }]}
            placeholder="Description (optional)"
            placeholderTextColor={colors.textSecondary}
            value={description}
            onChangeText={setDescription}
            multiline
            numberOfLines={4}
            textAlignVertical="top"
          />
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Priority</Text>
          <View style={styles.optionsRow}>
            {priorities.map((p) => (
              <TouchableOpacity
                key={p}
                onPress={() => setPriority(p)}
                style={[
                  styles.optionChip,
                  { backgroundColor: colors.surface },
                  priority === p && { backgroundColor: colors.primary },
                ]}
              >
                <Text
                  style={[
                    styles.optionChipText,
                    { color: priority === p ? '#fff' : colors.text },
                  ]}
                >
                  {p}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Category</Text>
          <View style={styles.optionsRow}>
            {categories.map((c) => (
              <TouchableOpacity
                key={c}
                onPress={() => setCategory(c)}
                style={[
                  styles.optionChip,
                  { backgroundColor: colors.surface },
                  category === c && { backgroundColor: colors.primary },
                ]}
              >
                <Text
                  style={[
                    styles.optionChipText,
                    { color: category === c ? '#fff' : colors.text },
                  ]}
                >
                  {c}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Status</Text>
          <View style={styles.optionsRow}>
            {(['pending', 'in-progress', 'completed'] as const).map((s) => (
              <TouchableOpacity
                key={s}
                onPress={() => setStatus(s)}
                style={[
                  styles.optionChip,
                  { backgroundColor: colors.surface },
                  status === s && { backgroundColor: colors.primary },
                ]}
              >
                <Text
                  style={[
                    styles.optionChipText,
                    { color: status === s ? '#fff' : colors.text },
                  ]}
                >
                  {s}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <TouchableOpacity
            onPress={() => setShowDeadlinePicker(true)}
            style={[styles.dateButton, { backgroundColor: colors.surface }]}
          >
            <Ionicons name="calendar-outline" size={20} color={colors.accent} />
            <Text style={[styles.dateButtonText, { color: colors.text }]}>
              {deadline ? `Deadline: ${formatDateTime(deadline)}` : 'Set Deadline'}
            </Text>
            {deadline && (
              <TouchableOpacity
                onPress={() => setDeadline(undefined)}
                style={styles.removeButton}
              >
                <Ionicons name="close-circle" size={20} color={colors.error} />
              </TouchableOpacity>
            )}
          </TouchableOpacity>

          <DatePickerModal
            visible={showDeadlinePicker}
            onClose={() => setShowDeadlinePicker(false)}
            onConfirm={(date) => {
              setDeadline(date);
              setShowDeadlinePicker(false);
            }}
            initialDate={deadline}
            mode="datetime"
            minimumDate={new Date()}
          />
        </View>

        <View style={styles.section}>
          <TouchableOpacity
            onPress={() => setShowReminderPicker(true)}
            style={[styles.dateButton, { backgroundColor: colors.surface }]}
          >
            <Ionicons name="notifications-outline" size={20} color={colors.accent} />
            <Text style={[styles.dateButtonText, { color: colors.text }]}>
              {reminderTime ? `Reminder: ${formatDateTime(reminderTime)}` : 'Set Reminder'}
            </Text>
            {reminderTime && (
              <TouchableOpacity
                onPress={() => setReminderTime(undefined)}
                style={styles.removeButton}
              >
                <Ionicons name="close-circle" size={20} color={colors.error} />
              </TouchableOpacity>
            )}
          </TouchableOpacity>

          <DatePickerModal
            visible={showReminderPicker}
            onClose={() => setShowReminderPicker(false)}
            onConfirm={(date) => {
              setReminderTime(date);
              setShowReminderPicker(false);
            }}
            initialDate={reminderTime}
            mode="datetime"
            minimumDate={new Date()}
          />
        </View>
      </ScrollView>

      <View style={[styles.footer, { backgroundColor: colors.background }]}>
        <TouchableOpacity
          onPress={handleSave}
          style={[styles.saveButton, { backgroundColor: colors.primary }]}
          disabled={!title.trim()}
        >
          <Text style={styles.saveButtonText}>
            {isEditing ? 'Update' : 'Create'} Todo
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  closeButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  deleteButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    gap: 20,
  },
  inputContainer: {
    borderRadius: 16,
    padding: 16,
  },
  titleInput: {
    fontSize: 18,
    fontWeight: '600',
  },
  descriptionInput: {
    fontSize: 16,
    minHeight: 100,
  },
  section: {
    gap: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  optionsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  optionChip: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
  },
  optionChipText: {
    fontSize: 14,
    fontWeight: '500',
    textTransform: 'capitalize',
  },
  dateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    gap: 12,
  },
  dateButtonText: {
    flex: 1,
    fontSize: 16,
  },
  removeButton: {
    padding: 4,
  },
  footer: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: 'rgba(124, 58, 237, 0.2)',
  },
  saveButton: {
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
