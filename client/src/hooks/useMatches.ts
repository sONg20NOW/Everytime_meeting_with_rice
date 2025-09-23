import { useState, useEffect } from 'react';
import type { Match, MatchState, CreateMatchRequest } from '../types';
import { matchAPI, handleApiError } from '../utils/api';

export const useMatches = (userId: number | null) => {
  const [state, setState] = useState<MatchState>({
    matches: [],
    isLoading: false,
    error: null,
  });

  // 매칭 목록 로드
  const loadMatches = async (): Promise<void> => {
    if (!userId) return;

    setState(prev => ({ ...prev, isLoading: true, error: null }));
    
    try {
      const matches = await matchAPI.getUserMatches(userId);
      setState(prev => ({ ...prev, matches, isLoading: false }));
    } catch (error) {
      const errorMessage = handleApiError(error);
      setState(prev => ({ ...prev, error: errorMessage, isLoading: false }));
    }
  };

  // 매칭 요청 생성
  const createMatchRequest = async (
    matchData: CreateMatchRequest
  ): Promise<{ request_id: number; matches: any[] }> => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));
    
    try {
      const result = await matchAPI.createMatchRequest(matchData);
      
      // 성공 시 매칭 목록 새로고침
      await loadMatches();
      
      setState(prev => ({ ...prev, isLoading: false }));
      return result;
    } catch (error) {
      const errorMessage = handleApiError(error);
      setState(prev => ({ ...prev, error: errorMessage, isLoading: false }));
      throw error;
    }
  };

  // 매칭 상태 업데이트
  const updateMatchStatus = async (
    matchId: number, 
    status: 'confirmed' | 'cancelled'
  ): Promise<void> => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));
    
    try {
      await matchAPI.updateMatchStatus(matchId, status);
      
      // 성공 시 매칭 목록 새로고침
      await loadMatches();
      
      setState(prev => ({ ...prev, isLoading: false }));
    } catch (error) {
      const errorMessage = handleApiError(error);
      setState(prev => ({ ...prev, error: errorMessage, isLoading: false }));
      throw error;
    }
  };

  // userId가 변경될 때마다 매칭 로드
  useEffect(() => {
    if (userId) {
      loadMatches();
    } else {
      setState({ matches: [], isLoading: false, error: null });
    }
  }, [userId]);

  // 에러 클리어
  const clearError = (): void => {
    setState(prev => ({ ...prev, error: null }));
  };

  // 매칭 파트너 정보 가져오기
  const getPartnerInfo = (match: Match, currentUserId: number) => {
    if (match.user1_id === currentUserId) {
      return {
        name: match.user2_name || '',
        email: match.user2_email || '',
        phone: match.user2_phone || '',
      };
    } else {
      return {
        name: match.user1_name || '',
        email: match.user1_email || '',
        phone: match.user1_phone || '',
      };
    }
  };

  return {
    ...state,
    createMatchRequest,
    updateMatchStatus,
    loadMatches,
    clearError,
    getPartnerInfo,
  };
};