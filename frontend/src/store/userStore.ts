import { create } from "zustand";
import { devtools } from "zustand/middleware";
import type { User } from "../types/user.types";

interface UserState {
  users: User[];
  selectedUsers: User[];
  isLoading: boolean;
  error: string | null;
}

interface UserActions {
  setUsers: (users: User[]) => void;
  setSelectedUsers: (users: User[]) => void;
  addSelectedUser: (user: User) => void;
  removeSelectedUser: (userId: string) => void;
  setIsLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  fetchUsers: () => Promise<void>;
}

export const useUserStore = create<UserState & UserActions>()(
  devtools(
    (set, get) => ({
      users: [],
      selectedUsers: [],
      isLoading: false,
      error: null,

      setUsers: (users) => set({ users }),
      setSelectedUsers: (selectedUsers) => set({ selectedUsers }),
      addSelectedUser: (user) =>
        set((state) => ({
          selectedUsers: [...state.selectedUsers, user],
        })),
      removeSelectedUser: (userId) =>
        set((state) => ({
          selectedUsers: state.selectedUsers.filter((u) => u.id !== userId),
        })),
      setIsLoading: (isLoading) => set({ isLoading }),
      setError: (error) => set({ error }),

      fetchUsers: async () => {
        set({ isLoading: true, error: null });
        try {
          // This would be replaced with actual API call
          const users = await new Promise<User[]>((resolve) => {
            setTimeout(() => {
              resolve([
                { id: "1", name: "John Doe", email: "john@example.com" },
                { id: "2", name: "Jane Smith", email: "jane@example.com" },
              ]);
            }, 1000);
          });
          set({ users, isLoading: false });
        } catch (error) {
          set({ error: "Failed to fetch users", isLoading: false });
        }
      },
    }),
    {
      name: "user-store",
    }
  )
);
