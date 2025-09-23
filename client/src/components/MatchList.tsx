import React from 'react';
import type { Match } from '../types';
import { MEAL_TYPE_NAMES, MATCH_STATUS_NAMES } from '../types';

interface MatchListProps {
  matches: Match[];
  currentUserId: number;
  onConfirmMatch: (matchId: number) => Promise<void>;
  onCancelMatch: (matchId: number) => Promise<void>;
  isLoading: boolean;
  getPartnerInfo: (match: Match, currentUserId: number) => {
    name: string;
    email: string;
    phone: string;
  };
}

export const MatchList: React.FC<MatchListProps> = ({
  matches,
  currentUserId,
  onConfirmMatch,
  onCancelMatch,
  isLoading,
  getPartnerInfo
}) => {
  const handleConfirm = async (matchId: number) => {
    try {
      await onConfirmMatch(matchId);
      alert('매칭이 확정되었습니다!');
    } catch (error) {
      console.error('매칭 확정 오류:', error);
    }
  };

  const handleCancel = async (matchId: number) => {
    if (confirm('정말로 이 매칭을 취소하시겠습니까?')) {
      try {
        await onCancelMatch(matchId);
        alert('매칭이 취소되었습니다.');
      } catch (error) {
        console.error('매칭 취소 오류:', error);
      }
    }
  };

  const getStatusColors = (status: string) => {
    const colors = {
      'pending': 'bg-yellow-100 text-yellow-800',
      'confirmed': 'bg-green-100 text-green-800',
      'cancelled': 'bg-red-100 text-red-800',
      'completed': 'bg-blue-100 text-blue-800'
    };
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  if (matches.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">
          <i className="fas fa-heart mr-2"></i>
          매칭 결과
        </h2>
        <div className="text-center text-gray-500 py-8">
          <i className="fas fa-heart-broken text-4xl mb-2"></i>
          <p>아직 매칭된 밥약이 없습니다.</p>
          <p className="text-sm">시간표를 등록하고 매칭 요청을 보내보세요!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">
        <i className="fas fa-heart mr-2"></i>
        매칭 결과
      </h2>
      
      <div className="space-y-4">
        {matches.map((match) => {
          const partner = getPartnerInfo(match, currentUserId);
          
          return (
            <div key={match.id} className="bg-white border rounded-lg p-4 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-2">
                  <i className="fas fa-user-friends text-indigo-600"></i>
                  <span className="font-medium">{partner.name}</span>
                  <span className={`px-2 py-1 rounded-full text-xs ${getStatusColors(match.status)}`}>
                    {MATCH_STATUS_NAMES[match.status as keyof typeof MATCH_STATUS_NAMES] || match.status}
                  </span>
                </div>
                <div className="text-sm text-gray-500">
                  {match.meal_date} {match.meal_time}
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4 text-sm mb-3">
                <div>
                  <span className="text-gray-600">식사:</span>{' '}
                  {MEAL_TYPE_NAMES[match.meal_type as keyof typeof MEAL_TYPE_NAMES] || match.meal_type}
                </div>
                <div>
                  <span className="text-gray-600">장소:</span> {match.location || '미정'}
                </div>
              </div>
              
              {match.message && (
                <div className="mb-3 p-2 bg-gray-50 rounded text-sm">
                  <i className="fas fa-comment text-gray-500 mr-1"></i>
                  {match.message}
                </div>
              )}
              
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-600">
                  {partner.email}
                  {partner.phone && ` • ${partner.phone}`}
                </div>
                
                {match.status === 'pending' && (
                  <div className="space-x-2">
                    <button
                      onClick={() => handleConfirm(match.id)}
                      disabled={isLoading}
                      className="bg-green-500 text-white px-3 py-1 rounded text-sm hover:bg-green-600 transition-colors disabled:opacity-50"
                    >
                      <i className="fas fa-check mr-1"></i>확정
                    </button>
                    <button
                      onClick={() => handleCancel(match.id)}
                      disabled={isLoading}
                      className="bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600 transition-colors disabled:opacity-50"
                    >
                      <i className="fas fa-times mr-1"></i>취소
                    </button>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};