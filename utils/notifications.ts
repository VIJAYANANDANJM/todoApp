import * as Notifications from 'expo-notifications';
import { Todo } from '@/types/todo';

// Configure notification behavior
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

export const notificationService = {
  async requestPermissions(): Promise<boolean> {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    
    return finalStatus === 'granted';
  },

  async scheduleNotification(todo: Todo): Promise<string | null> {
    if (!todo.reminderTime || todo.completed) {
      return null;
    }

    const hasPermission = await this.requestPermissions();
    if (!hasPermission) {
      return null;
    }

    // Cancel existing notification if any
    if (todo.notificationId) {
      await Notifications.cancelScheduledNotificationAsync(todo.notificationId);
    }

    const notificationId = await Notifications.scheduleNotificationAsync({
      content: {
        title: '📋 Todo Reminder',
        body: todo.title,
        data: { todoId: todo.id },
        sound: true,
        priority: Notifications.AndroidNotificationPriority.HIGH,
      },
      trigger: todo.reminderTime,
    });

    return notificationId;
  },

  async cancelNotification(notificationId: string): Promise<void> {
    if (notificationId) {
      await Notifications.cancelScheduledNotificationAsync(notificationId);
    }
  },

  async updateNotification(todo: Todo): Promise<string | null> {
    if (todo.notificationId) {
      await this.cancelNotification(todo.notificationId);
    }
    return await this.scheduleNotification(todo);
  },
};

