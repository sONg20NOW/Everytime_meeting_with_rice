import { useState, useEffect } from 'react';
import type { Timetable, TimetableState, TimetableAnalyzeResponse } from '../types';
import { timetableAPI, handleApiError } from '../utils/api';

export const useTimetable = (userId: number | null) => {
  const [state, setState] = useState<TimetableState>({
    timetables: [],
    isLoading: false,
    error: null,
  });

  // 시간표 목록 로드
  const loadTimetables = async (): Promise<void> => {
    if (!userId) return;

    setState(prev => ({ ...prev, isLoading: true, error: null }));
    
    try {
      const timetables = await timetableAPI.getUserTimetables(userId);
      setState(prev => ({ ...prev, timetables, isLoading: false }));
    } catch (error) {
      const errorMessage = handleApiError(error);
      setState(prev => ({ ...prev, error: errorMessage, isLoading: false }));
    }
  };

  // 시간표 이미지 업로드 및 분석
  const uploadTimetable = async (
    image: File, 
    semester: string
  ): Promise<TimetableAnalyzeResponse> => {
    if (!userId) throw new Error('사용자 ID가 필요합니다.');

    setState(prev => ({ ...prev, isLoading: true, error: null }));
    
    try {
      const formData = new FormData();
      formData.append('image', image);
      formData.append('userId', userId.toString());
      formData.append('semester', semester);

      const result = await timetableAPI.analyzeImage(formData);
      
      // 성공 시 시간표 목록 새로고침
      if (result.success) {
        await loadTimetables();
      }
      
      setState(prev => ({ ...prev, isLoading: false }));
      return result;
    } catch (error) {
      const errorMessage = handleApiError(error);
      setState(prev => ({ ...prev, error: errorMessage, isLoading: false }));
      throw error;
    }
  };

  // userId가 변경될 때마다 시간표 로드
  useEffect(() => {
    if (userId) {
      loadTimetables();
    } else {
      setState({ timetables: [], isLoading: false, error: null });
    }
  }, [userId]);

  // 에러 클리어
  const clearError = (): void => {
    setState(prev => ({ ...prev, error: null }));
  };

  // 최신 시간표 가져오기
  const getLatestTimetable = (): Timetable | null => {
    return state.timetables.length > 0 ? state.timetables[0] : null;
  };

  return {
    ...state,
    uploadTimetable,
    loadTimetables,
    clearError,
    getLatestTimetable,
  };
};