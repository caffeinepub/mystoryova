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

/** Sleep for `ms` milliseconds */
function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Returns true if the error is a transient canister/network error
 * (canister stopped, starting, busy, network hiccup, timeout, etc.).
 * Any thrown error during verifyAdminPassword means the backend wasn't
 * reachable — a wrong password returns `false`, it never throws.
 * So we retry on ALL errors except "incorrect password" logic errors.
 */
function isTransientError(e: unknown): boolean {
  const msg = (e instanceof Error ? e.message : String(e)).toLowerCase();
  // Explicit non-retryable cases (shouldn't happen for login, but be safe)
  if (msg.includes("invalid argument") || msg.includes("candid")) return false;
  // Retry on everything else — canister stopped/starting, network errors, timeouts
  return true;
}

/** Call `fn`, retrying up to `maxRetries` times on transient errors with exponential backoff */
async function withCanisterRetry<T>(
  fn: () => Promise<T>,
  maxRetries = 15,
  baseDelayMs = 2000,
): Promise<T> {
  let lastError: unknown;
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (e) {
      lastError = e;
      if (isTransientError(e) && attempt < maxRetries) {
        // Exponential backoff: 2s, 4s, 8s, then cap at 8s
        const delay = Math.min(baseDelayMs * 2 ** attempt, 8000);
        await sleep(delay);
        continue;
      }
      throw e;
    }
  }
  throw lastError;
}

export function AdminProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(
    () => sessionStorage.getItem(SESSION_KEY) === "true",
  );
  const { actor, isFetching } = useActor();
  const isActorReady = !!actor && !isFetching;

  const login = useCallback(
    async (password: string) => {
      if (!actor) throw new Error("Backend is still connecting. Please wait.");
      const ok = await withCanisterRetry(() =>
        actor.verifyAdminPassword(password.trim()),
      );
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
        return await withCanisterRetry(() =>
          actor.changeAdminPassword(oldPassword, newPassword),
        );
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
