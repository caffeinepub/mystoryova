import {
  type ReactNode,
  createContext,
  useCallback,
  useContext,
  useState,
} from "react";
import { useActor } from "./useActor";

const SESSION_KEY = "chiddarwar_admin_auth";

interface AdminContextType {
  isAuthenticated: boolean;
  isActorReady: boolean;
  login: (password: string) => Promise<boolean>;
  logout: () => void;
  changePassword: (
    oldPassword: string,
    newPassword: string,
  ) => Promise<boolean>;
}

const AdminContext = createContext<AdminContextType>({
  isAuthenticated: false,
  isActorReady: false,
  login: async () => false,
  logout: () => {},
  changePassword: async () => false,
});

export function AdminProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(
    () => sessionStorage.getItem(SESSION_KEY) === "true",
  );
  const { actor, isFetching } = useActor();
  const isActorReady = !!actor && !isFetching;

  const login = useCallback(
    async (password: string) => {
      if (!actor) throw new Error("Backend is still connecting. Please wait.");
      const ok = await actor.verifyAdminPassword(password.trim());
      if (ok) {
        sessionStorage.setItem(SESSION_KEY, "true");
        setIsAuthenticated(true);
        return true;
      }
      return false;
    },
    [actor],
  );

  const logout = useCallback(() => {
    sessionStorage.removeItem(SESSION_KEY);
    setIsAuthenticated(false);
  }, []);

  const changePassword = useCallback(
    async (oldPassword: string, newPassword: string) => {
      try {
        if (!actor) throw new Error("No actor");
        return await actor.changeAdminPassword(oldPassword, newPassword);
      } catch {
        return false;
      }
    },
    [actor],
  );

  return (
    <AdminContext.Provider
      value={{ isAuthenticated, isActorReady, login, logout, changePassword }}
    >
      {children}
    </AdminContext.Provider>
  );
}

export function useAdmin() {
  return useContext(AdminContext);
}
