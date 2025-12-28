import AsyncStorage from '@react-native-async-storage/async-storage';
import { Todo } from '@/types/todo';

const TODOS_KEY = '@todos';

export const storage = {
  async getTodos(): Promise<Todo[]> {
    try {
      const data = await AsyncStorage.getItem(TODOS_KEY);
      if (data) {
        const todos = JSON.parse(data);
        // Convert date strings back to Date objects
        return todos.map((todo: any) => ({
          ...todo,
          deadline: todo.deadline ? new Date(todo.deadline) : undefined,
          reminderTime: todo.reminderTime ? new Date(todo.reminderTime) : undefined,
          createdAt: new Date(todo.createdAt),
          updatedAt: new Date(todo.updatedAt),
        }));
      }
      return [];
    } catch (error) {
      console.error('Error loading todos:', error);
      return [];
    }
  },

  async saveTodos(todos: Todo[]): Promise<void> {
    try {
      await AsyncStorage.setItem(TODOS_KEY, JSON.stringify(todos));
    } catch (error) {
      console.error('Error saving todos:', error);
    }
  },

  async addTodo(todo: Todo): Promise<void> {
    const todos = await this.getTodos();
    todos.push(todo);
    await this.saveTodos(todos);
  },

  async updateTodo(id: string, updates: Partial<Todo>): Promise<void> {
    const todos = await this.getTodos();
    const index = todos.findIndex((t) => t.id === id);
    if (index !== -1) {
      todos[index] = { ...todos[index], ...updates, updatedAt: new Date() };
      await this.saveTodos(todos);
    }
  },

  async deleteTodo(id: string): Promise<void> {
    const todos = await this.getTodos();
    const filtered = todos.filter((t) => t.id !== id);
    await this.saveTodos(filtered);
  },

  async toggleTodo(id: string): Promise<void> {
    const todos = await this.getTodos();
    const index = todos.findIndex((t) => t.id === id);
    if (index !== -1) {
      todos[index] = {
        ...todos[index],
        completed: !todos[index].completed,
        status: !todos[index].completed ? 'completed' : 'pending',
        updatedAt: new Date(),
      };
      await this.saveTodos(todos);
    }
  },
};

