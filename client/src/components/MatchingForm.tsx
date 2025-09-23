import React, { useState, useEffect } from 'react';
import type { MatchRequestFormData, CreateMatchRequest } from '../types';

interface MatchingFormProps {
  onCreateMatch: (matchData: CreateMatchRequest) => Promise<void>;
  isLoading: boolean;
  error: string | null;
  userId: number;
}

export const MatchingForm: React.FC<MatchingFormProps> = ({
  onCreateMatch,
  isLoading,
  error,
  userId
}) => {
  const [formData, setFormData] = useState<MatchRequestFormData>({
    meal_type: 'lunch',
    request_date: '',
    preferred_time_start: '12:00',
    preferred_time_end: '13:00',
    preferred_location: '',
    message: ''
  });

  // 오늘 날짜를 기본값으로 설정
  useEffect(() => {
    const today = new Date().toISOString().split('T')[0];
    setFormData(prev => ({ ...prev, request_date: today }));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.request_date || !formData.preferred_time_start || !formData.preferred_time_end) {
      alert('날짜와 시간을 모두 선택해주세요.');
      return;
    }

    if (formData.preferred_time_start >= formData.preferred_time_end) {
      alert('종료 시간은 시작 시간보다 늦어야 합니다.');
      return;
    }

    try {
      await onCreateMatch({
        requester_id: userId,
        meal_type: formData.meal_type,
        request_date: formData.request_date,
        preferred_time_start: formData.preferred_time_start,
        preferred_time_end: formData.preferred_time_end,
        preferred_location: formData.preferred_location,
        message: formData.message
      });
      
      // 성공 시 메시지만 초기화
      setFormData(prev => ({ ...prev, message: '' }));
    } catch (error) {
      // 에러는 상위 컴포넌트에서 처리
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const today = new Date().toISOString().split('T')[0];

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">
        <i className="fas fa-users mr-2"></i>
        밥약 매칭
      </h2>
      
      {error && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">식사 종류</label>
          <select
            name="meal_type"
            value={formData.meal_type}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            disabled={isLoading}
          >
            <option value="lunch">점심</option>
            <option value="dinner">저녁</option>
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">희망 날짜</label>
          <input
            type="date"
            name="request_date"
            value={formData.request_date}
            onChange={handleChange}
            min={today}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            required
            disabled={isLoading}
          />
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">시작 시간</label>
            <input
              type="time"
              name="preferred_time_start"
              value={formData.preferred_time_start}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
              disabled={isLoading}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">종료 시간</label>
            <input
              type="time"
              name="preferred_time_end"
              value={formData.preferred_time_end}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
              disabled={isLoading}
            />
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">선호 장소</label>
          <input
            type="text"
            name="preferred_location"
            value={formData.preferred_location}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="학생회관 식당, 공대 식당 등"
            disabled={isLoading}
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">메시지 (선택)</label>
          <textarea
            name="message"
            value={formData.message}
            onChange={handleChange}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="같이 밥 드실 분 구해요!"
            disabled={isLoading}
          />
        </div>
        
        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <i className="fas fa-search mr-2"></i>
          {isLoading ? '매칭 중...' : '밥친구 찾기'}
        </button>
      </form>
    </div>
  );
};