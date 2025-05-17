import React, { createContext, useReducer, useContext, ReactNode, Dispatch, useEffect } from 'react';
import type { Account } from '../types/account';

interface AuthState {
  isAuthenticated: boolean;
  account: Account | null;
  accessToken: string | null;
}

const initialState: AuthState = {
  isAuthenticated: false,
  account: null,
  accessToken: null,
};

function loadAuthState(): AuthState {
  try {
    const data = localStorage.getItem('auth');
    if (data) return JSON.parse(data);
  } catch (err) {
    console.error('Error loading auth state from localStorage:', err);
    localStorage.removeItem('auth'); // Remove invalid data if any
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

type AuthAction =
  | { type: 'LOGIN'; payload: { account: Account; accessToken: string } }
  | { type: 'LOGOUT' };

function authReducer(state: AuthState, action: AuthAction): AuthState {
  switch (action.type) {
    case 'LOGIN':
      return {
        isAuthenticated: true,
        account: action.payload.account,
        accessToken: action.payload.accessToken,
      };
    case 'LOGOUT':
      return initialState;
    default:
      return state;
  }
}

const AuthContext = createContext<{
  state: AuthState;
  dispatch: Dispatch<AuthAction>;
}>({ state: initialState, dispatch: () => null });

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(authReducer, loadAuthState());

  useEffect(() => {
    saveAuthState(state);
  }, [state]);

  return (
    <AuthContext.Provider value={{ state, dispatch }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
