import { Todo, TodoPriority } from '@/types/todo';

export const generateId = (): string => {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

export const formatDate = (date: Date): string => {
  const now = new Date();
  const diff = date.getTime() - now.getTime();
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

  if (days > 0) {
    return `${days}d ${hours}h`;
  } else if (hours > 0) {
    return `${hours}h ${minutes}m`;
  } else if (minutes > 0) {
    return `${minutes}m`;
  } else {
    return 'Overdue';
  }
};

export const formatDateTime = (date: Date): string => {
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

export const getPriorityColor = (priority: TodoPriority): string => {
  switch (priority) {
    case 'urgent':
      return '#ef4444';
    case 'high':
      return '#f59e0b';
    case 'medium':
      return '#3b82f6';
    case 'low':
      return '#10b981';
    default:
      return '#6b7280';
  }
};

export const getCategoryIcon = (category: string): string => {
  switch (category) {
    case 'personal':
      return 'person.fill';
    case 'work':
      return 'briefcase.fill';
    case 'shopping':
      return 'cart.fill';
    case 'health':
      return 'heart.fill';
    default:
      return 'folder.fill';
  }
};

export const sortTodos = (todos: Todo[], sortBy: 'priority' | 'deadline' | 'created' = 'priority'): Todo[] => {
  const sorted = [...todos];
  
  switch (sortBy) {
    case 'priority':
      const priorityOrder = { urgent: 4, high: 3, medium: 2, low: 1 };
      return sorted.sort((a, b) => {
        if (a.completed !== b.completed) {
          return a.completed ? 1 : -1;
        }
        return priorityOrder[b.priority] - priorityOrder[a.priority];
      });
    
    case 'deadline':
      return sorted.sort((a, b) => {
        if (a.completed !== b.completed) {
          return a.completed ? 1 : -1;
        }
        if (!a.deadline && !b.deadline) return 0;
        if (!a.deadline) return 1;
        if (!b.deadline) return -1;
        return a.deadline.getTime() - b.deadline.getTime();
      });
    
    case 'created':
      return sorted.sort((a, b) => {
        if (a.completed !== b.completed) {
          return a.completed ? 1 : -1;
        }
        return b.createdAt.getTime() - a.createdAt.getTime();
      });
    
    default:
      return sorted;
  }
};

export const filterTodos = (todos: Todo[], filters: {
  status?: string;
  priority?: string;
  category?: string;
  searchQuery?: string;
  showCompleted?: boolean;
}): Todo[] => {
  return todos.filter((todo) => {
    if (!filters.showCompleted && todo.completed) return false;
    if (filters.status && todo.status !== filters.status) return false;
    if (filters.priority && todo.priority !== filters.priority) return false;
    if (filters.category && todo.category !== filters.category) return false;
    if (filters.searchQuery) {
      const query = filters.searchQuery.toLowerCase();
      const matchesTitle = todo.title.toLowerCase().includes(query);
      const matchesDescription = todo.description?.toLowerCase().includes(query);
      if (!matchesTitle && !matchesDescription) return false;
    }
    return true;
  });
};

