import axios, { AxiosResponse } from 'axios';
import type {
  User,
  CreateUserRequest,
  Timetable,
  TimetableAnalyzeResponse,
  CreateMatchRequest,
  Match,
  ApiResponse
} from '../types';

// Axios 인스턴스 생성
const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// 응답 인터셉터 - 에러 처리
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error);
    return Promise.reject(error);
  }
);

// User API
export const userAPI = {
  // 사용자 생성/로그인
  createUser: async (userData: CreateUserRequest): Promise<User> => {
    const response: AxiosResponse<User> = await api.post('/users', userData);
    return response.data;
  },
};

// Timetable API
export const timetableAPI = {
  // 시간표 이미지 분석
  analyzeImage: async (formData: FormData): Promise<TimetableAnalyzeResponse> => {
    const response: AxiosResponse<TimetableAnalyzeResponse> = await api.post(
      '/timetables/analyze',
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    return response.data;
  },

  // 사용자 시간표 조회
  getUserTimetables: async (userId: number): Promise<Timetable[]> => {
    const response: AxiosResponse<Timetable[]> = await api.get(`/users/${userId}/timetables`);
    return response.data;
  },
};

// Match API
export const matchAPI = {
  // 매칭 요청 생성
  createMatchRequest: async (matchData: CreateMatchRequest): Promise<{ request_id: number; matches: any[] }> => {
    const response = await api.post('/match-requests', matchData);
    return response.data;
  },

  // 사용자 매칭 조회
  getUserMatches: async (userId: number): Promise<Match[]> => {
    const response: AxiosResponse<Match[]> = await api.get(`/users/${userId}/matches`);
    return response.data;
  },

  // 매칭 상태 업데이트
  updateMatchStatus: async (matchId: number, status: string): Promise<{ success: boolean }> => {
    const response = await api.patch(`/matches/${matchId}`, { status });
    return response.data;
  },
};

// 에러 처리 유틸리티
export const handleApiError = (error: any): string => {
  if (error.response?.data?.error) {
    return error.response.data.error;
  }
  if (error.message) {
    return error.message;
  }
  return '알 수 없는 오류가 발생했습니다.';
};

export default api;