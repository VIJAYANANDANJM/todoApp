export type TodoPriority = 'low' | 'medium' | 'high' | 'urgent';
export type TodoCategory = 'personal' | 'work' | 'shopping' | 'health' | 'other';
export type TodoStatus = 'pending' | 'in-progress' | 'completed';

export interface Todo {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  priority: TodoPriority;
  category: TodoCategory;
  status: TodoStatus;
  deadline?: Date;
  reminderTime?: Date;
  createdAt: Date;
  updatedAt: Date;
  notificationId?: string;
}

export interface TodoFilters {
  status?: TodoStatus;
  priority?: TodoPriority;
  category?: TodoCategory;
  searchQuery?: string;
  showCompleted?: boolean;
}

