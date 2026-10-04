import { create } from "zustand";
import { persist } from "zustand/middleware";

export type User = {
  id: string;
  username: string;
  email: string;
  password: string;
};

type AuthState = {
  users: User[];
  currentUser: User | null;
  isAuthenticated: boolean;

  register: (username: string, email: string, password: string) => boolean;
  login: (email: string, password: string) => boolean;
  logout: () => void;
  validateSession: () => boolean;
};

export const DEFAULT_DEMO_USER: User = {
  id: "user-demo-admin",
  username: "Aditya",
  email: "admin@kasban.io",
  password: "password123",
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      users: [DEFAULT_DEMO_USER],
      currentUser: null,
      isAuthenticated: false,

      register: (username, email, password) => {
        const normalizedEmail = email.toLowerCase().trim();
        const existingUser = get().users.find(
          (user) => user.email.toLowerCase() === normalizedEmail
        );

        if (existingUser) {
          return false;
        }

        const newUser: User = {
          id: crypto.randomUUID(),
          username: username.trim(),
          email: normalizedEmail,
          password,
        };

        set({
          users: [...get().users, newUser],
        });

        return true;
      },

      login: (email, password) => {
        const normalizedEmail = email.toLowerCase().trim();
        const currentUsers = get().users.length > 0 ? get().users : [DEFAULT_DEMO_USER];

        const user = currentUsers.find(
          (user) =>
            user.email.toLowerCase() === normalizedEmail &&
            user.password === password
        );

        if (!user) {
          return false;
        }

        set({
          users: currentUsers,
          currentUser: user,
          isAuthenticated: true,
        });

        return true;
      },

      logout: () => {
        set({
          currentUser: null,
          isAuthenticated: false,
        });
      },

      validateSession: () => {
        const { currentUser, users, isAuthenticated } = get();
        if (!isAuthenticated || !currentUser) {
          if (isAuthenticated) {
            set({ isAuthenticated: false, currentUser: null });
          }
          return false;
        }

        const allUsers = users.length > 0 ? users : [DEFAULT_DEMO_USER];
        const userExists = allUsers.some(
          (u) =>
            u.id === currentUser.id &&
            u.email.toLowerCase() === currentUser.email.toLowerCase()
        );

        if (!userExists) {
          set({ isAuthenticated: false, currentUser: null });
          return false;
        }

        return true;
      },
    }),
    {
      name: "nirman-auth",
    }
  )
);

