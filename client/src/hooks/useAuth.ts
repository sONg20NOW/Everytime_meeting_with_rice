import { useState, useEffect } from 'react';
import type { User, CreateUserRequest, AuthState } from '../types';
import { userAPI, handleApiError } from '../utils/api';

const STORAGE_KEY = 'currentUser';

export const useAuth = () => {
  const [state, setState] = useState<AuthState>({
    user: null,
    isLoading: false,
    error: null,
  });

  // 로컬 스토리지에서 사용자 정보 로드
  useEffect(() => {
    const savedUser = localStorage.getItem(STORAGE_KEY);
    if (savedUser) {
      try {
        const user = JSON.parse(savedUser);
        setState(prev => ({ ...prev, user }));
      } catch (error) {
        console.error('Failed to parse saved user:', error);
        localStorage.removeItem(STORAGE_KEY);
      }
    }
  }, []);

  // 로그인/회원가입
  const login = async (userData: CreateUserRequest): Promise<void> => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));
    
    try {
      const user = await userAPI.createUser(userData);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
      setState(prev => ({ ...prev, user, isLoading: false }));
    } catch (error) {
      const errorMessage = handleApiError(error);
      setState(prev => ({ ...prev, error: errorMessage, isLoading: false }));
      throw error;
    }
  };

  // 로그아웃
  const logout = (): void => {
    localStorage.removeItem(STORAGE_KEY);
    setState({ user: null, isLoading: false, error: null });
  };

  // 에러 클리어
  const clearError = (): void => {
    setState(prev => ({ ...prev, error: null }));
  };

  return {
    ...state,
    login,
    logout,
    clearError,
    isAuthenticated: !!state.user,
  };
};