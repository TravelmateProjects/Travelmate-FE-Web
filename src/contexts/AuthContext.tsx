/* eslint-disable react-refresh/only-export-components */
import { createContext, useReducer, ReactNode, Dispatch, useEffect, useState } from 'react';
import type { Account } from '../types/Account';
import type { User } from '../types/User';
import authService from '../services/authService';

export interface AuthState {
  isAuthenticated: boolean;
  account: Account | null;
  user: User | null;
  isLoading: boolean;
}

const initialState: AuthState = {
  isAuthenticated: false,
  account: null,
  user: null,
  isLoading: true,
};

function loadAuthState(): AuthState {
  try {
    const data = localStorage.getItem('auth');
    // console.log("[AuthContext] Loading auth state from localStorage:", data);

    if (data) return JSON.parse(data);
  } catch (err) {
    console.error('Error loading auth state from localStorage:', err);
    localStorage.removeItem('auth');
  }
  return initialState;
}

function saveAuthState(state: AuthState) {
  try {
    localStorage.setItem('auth', JSON.stringify(state));
  } catch (err) {
    console.error('Error saving auth state to localStorage:', err);
  }
}

export type AuthAction =
  | { type: 'LOGIN'; payload: { account: Account; user: User | null } }
  | { type: 'LOGOUT' }
  | { type: 'RESTORE'; payload: { account: Account | null; user: User | null } };

function authReducer(state: AuthState, action: AuthAction): AuthState {
  switch (action.type) {
    case 'LOGIN':
      return {
        isAuthenticated: true,
        account: action.payload.account,
        user: action.payload.user,
        isLoading: false,
      };
    case 'LOGOUT':
      return {
        ...initialState,
        isLoading: false,
      };
    case 'RESTORE':
      return {
        isAuthenticated: !!(action.payload.account && (
            // Admin: only needs account
          action.payload.account.role === 'admin' ||
            // User: requires both account and user
          (action.payload.account.role === 'partner' && action.payload.user)
        )),
        account: action.payload.account,
        user: action.payload.user,
        isLoading: false,
      };
    default:
      return state;
  }
}

export const AuthContext = createContext<{
  state: AuthState;
  dispatch: Dispatch<AuthAction>;
}>({ state: initialState, dispatch: () => null });

// Global flag to avoid multiple calls
let isRestoreInProgress = false;

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);
  const [hasInitialized, setHasInitialized] = useState(false);

  console.log("[AuthProvider] Current state:", state);
  console.log("[AuthProvider] hasInitialized:", hasInitialized);
  useEffect(() => {
    const restoreAuth = async () => {
      // Check and set initialization state atomically
      setHasInitialized(prevInitialized => {
        if (prevInitialized || isRestoreInProgress) {
          console.log("[AuthContext] Already initialized or in progress, skipping...", {
            hasInitialized: prevInitialized,
            isRestoreInProgress
          });
          return prevInitialized; // Don't change state
        }

        // Start restoration process
        isRestoreInProgress = true;
        console.log("[AuthContext] === Start restoreAuth ===");

        // Execute the actual restoration logic
        const doRestore = async () => {
          const savedState = loadAuthState();
          console.log("[AuthContext] Saved state:", savedState);
          console.log("[AuthContext] Check conditions:", {
            hasAccount: !!savedState.account,
            hasUser: !!savedState.user,
            accountRole: savedState.account?.role,
            accountId: savedState.account?.id,
            userId: savedState.user?._id
          });

            // Check condition based on role
          const isValidAuthState = savedState.account && (
            // Admin: only needs account, user is not required
            (savedState.account.role === 'admin') ||
            // User: requires both account and user
            (savedState.account.role === 'partner' && savedState.user)
          );

          try {
            if (isValidAuthState) {
              console.log("[AuthContext] Found saved auth state, attempting refresh...");
              console.log("[AuthContext] Attempting to refresh token...");
              await authService.refreshToken({ platform: 'web' });
              // If successful, restore the state
              dispatch({
                type: 'RESTORE',
                payload: {
                  account: savedState.account,
                  user: savedState.user || null,
                },
              });
              console.log("[AuthContext] Authentication restored successfully");
            } else {
              console.log("[AuthContext] No saved auth state found, trying refresh anyway...");
              try {
                await authService.refreshToken({ platform: 'web' });
                console.log("[AuthContext] Refresh successful but no saved state");
                // TODO: Need API to get user info
                dispatch({
                  type: 'RESTORE',
                  payload: {
                    account: null,
                    user: null,
                  },
                });
              } catch {
                console.log("[AuthContext] No valid token or saved state");
                dispatch({
                  type: 'RESTORE',
                  payload: {
                    account: null,
                    user: null,
                  },
                });
              }
            }
          } catch (err) {
            console.log("[AuthContext] Token refresh failed, clearing auth state:", err);
            localStorage.removeItem('auth');
            dispatch({
              type: 'RESTORE',
              payload: {
                account: null,
                user: null,
              },
            });
          } finally {
            isRestoreInProgress = false;
            console.log("[AuthContext] === Finished restoreAuth ===");
          }
        };

        // Execute restoration asynchronously
        doRestore();
        
        return true; // Set hasInitialized to true
      });
    };

    restoreAuth();
  }, []); // Empty dependency array

  useEffect(() => {
    // Save auth state to localStorage whenever it changes
    saveAuthState(state);
  }, [state]);

  return (
    <AuthContext.Provider value={{ state, dispatch }}>
      {children}
    </AuthContext.Provider>
  );
};
