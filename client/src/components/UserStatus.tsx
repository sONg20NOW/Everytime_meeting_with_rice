import React from 'react';
import type { User } from '../types';

interface UserStatusProps {
  user: User;
  onLogout: () => void;
}

export const UserStatus: React.FC<UserStatusProps> = ({ user, onLogout }) => {
  return (
    <div className="bg-white rounded-lg shadow-lg p-4 text-center mb-8">
      <div className="flex items-center justify-center space-x-4">
        <div>
          <i className="fas fa-user-circle text-2xl text-indigo-600"></i>
          <span className="ml-2 font-medium">{user.name}</span>
          <span className="text-gray-500">({user.university})</span>
        </div>
        <button
          onClick={onLogout}
          className="bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600 transition-colors"
        >
          로그아웃
        </button>
      </div>
    </div>
  );
};