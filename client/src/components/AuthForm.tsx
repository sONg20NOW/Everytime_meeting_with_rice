import React, { useState } from 'react';
import type { LoginFormData, CreateUserRequest, LoginRequest } from '../types';

interface AuthFormProps {
  onLogin: (loginData: LoginRequest) => Promise<void>;
  onRegister: (userData: CreateUserRequest) => Promise<void>;
  isLoading: boolean;
  error: string | null;
}

export const AuthForm: React.FC<AuthFormProps> = ({ onLogin, onRegister, isLoading, error }) => {
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [formData, setFormData] = useState<LoginFormData>({
    email: '',
    password: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.email || !formData.password) {
      alert('이메일과 비밀번호를 모두 입력해주세요.');
      return;
    }

    if (formData.password.length < 6) {
      alert('비밀번호는 6자 이상이어야 합니다.');
      return;
    }

    try {
      if (isLoginMode) {
        await onLogin({
          email: formData.email,
          password: formData.password
        });
      } else {
        await onRegister({
          email: formData.email,
          password: formData.password
        });
      }
    } catch (error) {
      // 에러는 상위 컴포넌트에서 처리
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const toggleMode = () => {
    setIsLoginMode(!isLoginMode);
    setFormData({ email: '', password: '' }); // 폼 초기화
  };

  return (
    <div className="max-w-md mx-auto">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">
          {isLoginMode ? '로그인' : '회원가입'}
        </h2>
        
        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">이메일</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="your@email.com"
              required
              disabled={isLoading}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">비밀번호</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="6자 이상 입력"
              required
              minLength={6}
              disabled={isLoading}
            />
          </div>
          
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <i className={`fas ${isLoginMode ? 'fa-sign-in-alt' : 'fa-user-plus'} mr-2`}></i>
            {isLoading ? '처리 중...' : isLoginMode ? '로그인' : '회원가입'}
          </button>
        </form>
        
        <div className="mt-4 text-center">
          <button
            type="button"
            onClick={toggleMode}
            disabled={isLoading}
            className="text-indigo-600 hover:text-indigo-800 text-sm transition-colors disabled:opacity-50"
          >
            {isLoginMode ? '계정이 없으신가요? 회원가입' : '이미 계정이 있으신가요? 로그인'}
          </button>
        </div>
      </div>
    </div>
  );
};