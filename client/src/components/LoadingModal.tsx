import React from 'react';

interface LoadingModalProps {
  isVisible: boolean;
  message?: string;
}

export const LoadingModal: React.FC<LoadingModalProps> = ({
  isVisible,
  message = '처리 중입니다...'
}) => {
  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 text-center">
        <i className="fas fa-spinner fa-spin text-4xl text-indigo-600 mb-4"></i>
        <p className="text-gray-700">{message}</p>
      </div>
    </div>
  );
};