// User related types
export interface User {
  id: number;
  name: string;
  email: string;
  phone?: string;
  university: string;
  created_at: string;
  updated_at: string;
}

export interface CreateUserRequest {
  name: string;
  email: string;
  phone?: string;
  university: string;
}

// Course related types
export interface Course {
  id?: number;
  timetable_id?: number;
  course_name: string;
  professor?: string;
  day_of_week: number; // 0=일요일, 1=월요일, ..., 6=토요일
  start_time: string; // HH:MM 형식
  end_time: string; // HH:MM 형식
  location?: string;
  created_at?: string;
}

// Timetable related types
export interface Timetable {
  id: number;
  user_id: number;
  semester: string;
  image_url?: string;
  created_at: string;
  updated_at: string;
  courses: Course[];
}

export interface TimetableAnalyzeRequest {
  image: File;
  userId: string;
  semester: string;
}

export interface TimetableAnalyzeResponse {
  success: boolean;
  timetable_id?: number;
  courses?: Course[];
  image_url?: string;
  message?: string;
  error?: string;
}

// Match related types
export interface MatchRequest {
  id?: number;
  requester_id: number;
  meal_type: 'lunch' | 'dinner';
  request_date: string; // YYYY-MM-DD 형식
  preferred_time_start: string; // HH:MM 형식
  preferred_time_end: string; // HH:MM 형식
  preferred_location?: string;
  message?: string;
  status?: 'active' | 'matched' | 'cancelled';
  created_at?: string;
  updated_at?: string;
}

export interface CreateMatchRequest {
  requester_id: number;
  meal_type: 'lunch' | 'dinner';
  request_date: string;
  preferred_time_start: string;
  preferred_time_end: string;
  preferred_location?: string;
  message?: string;
}

export interface Match {
  id: number;
  request_id: number;
  user1_id: number;
  user2_id: number;
  meal_type: 'lunch' | 'dinner';
  meal_date: string;
  meal_time: string;
  location?: string;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  created_at: string;
  updated_at: string;
  // 조인된 사용자 정보
  user1_name?: string;
  user1_email?: string;
  user1_phone?: string;
  user2_name?: string;
  user2_email?: string;
  user2_phone?: string;
  preferred_location?: string;
  message?: string;
}

// API Response types
export interface ApiResponse<T> {
  success?: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// Meal preference types
export interface MealPreference {
  id?: number;
  user_id: number;
  meal_type: 'lunch' | 'dinner';
  preferred_time: string;
  preferred_location?: string;
  dietary_restrictions?: string; // JSON 형태
  created_at?: string;
  updated_at?: string;
}

// UI State types
export interface AuthState {
  user: User | null;
  isLoading: boolean;
  error: string | null;
}

export interface TimetableState {
  timetables: Timetable[];
  isLoading: boolean;
  error: string | null;
}

export interface MatchState {
  matches: Match[];
  isLoading: boolean;
  error: string | null;
}

// Form types
export interface LoginFormData {
  email: string;
  name: string;
  phone: string;
  university: string;
}

export interface TimetableUploadFormData {
  semester: string;
  image: File | null;
}

export interface MatchRequestFormData {
  meal_type: 'lunch' | 'dinner';
  request_date: string;
  preferred_time_start: string;
  preferred_time_end: string;
  preferred_location: string;
  message: string;
}

// Utility types
export type DayOfWeek = 0 | 1 | 2 | 3 | 4 | 5 | 6;

export interface DayNames {
  [key: number]: string;
}

export const DAY_NAMES: DayNames = {
  0: '일',
  1: '월',
  2: '화',
  3: '수',
  4: '목',
  5: '금',
  6: '토'
};

export const MEAL_TYPE_NAMES = {
  lunch: '점심',
  dinner: '저녁'
} as const;

export const MATCH_STATUS_NAMES = {
  pending: '대기중',
  confirmed: '확정',
  cancelled: '취소됨',
  completed: '완료'
} as const;