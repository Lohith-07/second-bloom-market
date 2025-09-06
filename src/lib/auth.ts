// Simulated authentication system using localStorage
export interface User {
  id: string;
  email: string;
  username: string;
  avatar_url?: string;
  created_at: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
}

// Mock user data
const MOCK_USERS: User[] = [
  {
    id: '1',
    email: 'demo@ecofinds.com',
    username: 'EcoEnthusiast',
    avatar_url: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
    created_at: new Date().toISOString()
  }
];

class AuthService {
  private readonly STORAGE_KEY = 'ecofinds_auth';
  private readonly USERS_KEY = 'ecofinds_users';

  constructor() {
    // Initialize users in localStorage if not exists
    if (!localStorage.getItem(this.USERS_KEY)) {
      localStorage.setItem(this.USERS_KEY, JSON.stringify(MOCK_USERS));
    }
  }

  async register(email: string, password: string, username: string): Promise<User> {
    const users = this.getUsers();
    
    if (users.find(u => u.email === email)) {
      throw new Error('User already exists');
    }

    const newUser: User = {
      id: Date.now().toString(),
      email,
      username,
      created_at: new Date().toISOString()
    };

    users.push(newUser);
    localStorage.setItem(this.USERS_KEY, JSON.stringify(users));
    this.setCurrentUser(newUser);
    
    return newUser;
  }

  async login(email: string, password: string): Promise<User> {
    const users = this.getUsers();
    const user = users.find(u => u.email === email);
    
    if (!user) {
      throw new Error('Invalid credentials');
    }

    this.setCurrentUser(user);
    return user;
  }

  logout(): void {
    localStorage.removeItem(this.STORAGE_KEY);
  }

  getCurrentUser(): User | null {
    const authData = localStorage.getItem(this.STORAGE_KEY);
    return authData ? JSON.parse(authData) : null;
  }

  updateProfile(updates: Partial<User>): User | null {
    const currentUser = this.getCurrentUser();
    if (!currentUser) return null;

    const updatedUser = { ...currentUser, ...updates };
    this.setCurrentUser(updatedUser);

    // Update in users list
    const users = this.getUsers();
    const index = users.findIndex(u => u.id === currentUser.id);
    if (index !== -1) {
      users[index] = updatedUser;
      localStorage.setItem(this.USERS_KEY, JSON.stringify(users));
    }

    return updatedUser;
  }

  private setCurrentUser(user: User): void {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(user));
  }

  private getUsers(): User[] {
    const users = localStorage.getItem(this.USERS_KEY);
    return users ? JSON.parse(users) : [];
  }
}

export const authService = new AuthService();