import { create } from "zustand";
import { persist } from "zustand/middleware";

type User = {
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
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      users: [],
      currentUser: null,
      isAuthenticated: false,

      register: (username, email, password) => {
        const existingUser = get().users.find((user) => user.email === email);

        if (existingUser) {
          return false;
        }

        const newUser: User = {
          id: crypto.randomUUID(),
          username,
          email,
          password,
        };

        set({
          users: [...get().users, newUser],
        });

        return true;
      },

      login: (email, password) => {
        const user = get().users.find(
          (user) => user.email === email && user.password === password,
        );

        if (!user) {
          return false;
        }

        set({
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
    }),
    {
      name: "nirman-auth",
    },
  ),
);
