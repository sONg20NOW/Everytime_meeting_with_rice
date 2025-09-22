-- Users 테이블: 사용자 정보 관리
CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  phone TEXT,
  university TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Timetables 테이블: 시간표 정보 관리
CREATE TABLE IF NOT EXISTS timetables (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  semester TEXT NOT NULL, -- 예: 2024-1, 2024-2
  image_url TEXT, -- 시간표 이미지 URL (R2 스토리지)
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Courses 테이블: 수업 정보 관리
CREATE TABLE IF NOT EXISTS courses (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  timetable_id INTEGER NOT NULL,
  course_name TEXT NOT NULL,
  professor TEXT,
  day_of_week INTEGER NOT NULL, -- 0=일요일, 1=월요일, ..., 6=토요일
  start_time TEXT NOT NULL, -- HH:MM 형식 (예: 09:00)
  end_time TEXT NOT NULL, -- HH:MM 형식 (예: 10:30)
  location TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (timetable_id) REFERENCES timetables(id) ON DELETE CASCADE
);

-- Meal_preferences 테이블: 식사 선호도 관리
CREATE TABLE IF NOT EXISTS meal_preferences (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  meal_type TEXT NOT NULL, -- 'lunch' 또는 'dinner'
  preferred_time TEXT NOT NULL, -- HH:MM 형식
  preferred_location TEXT, -- 선호하는 식당/지역
  dietary_restrictions TEXT, -- 식단 제한사항 (JSON 형태)
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Match_requests 테이블: 밥약 매칭 요청 관리
CREATE TABLE IF NOT EXISTS match_requests (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  requester_id INTEGER NOT NULL,
  meal_type TEXT NOT NULL, -- 'lunch' 또는 'dinner'
  request_date DATE NOT NULL, -- YYYY-MM-DD 형식
  preferred_time_start TEXT NOT NULL, -- HH:MM 형식
  preferred_time_end TEXT NOT NULL, -- HH:MM 형식
  preferred_location TEXT,
  message TEXT,
  status TEXT DEFAULT 'active', -- 'active', 'matched', 'cancelled'
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (requester_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Matches 테이블: 매칭된 밥약 관리
CREATE TABLE IF NOT EXISTS matches (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  request_id INTEGER NOT NULL,
  user1_id INTEGER NOT NULL,
  user2_id INTEGER NOT NULL,
  meal_type TEXT NOT NULL,
  meal_date DATE NOT NULL,
  meal_time TEXT NOT NULL, -- HH:MM 형식
  location TEXT,
  status TEXT DEFAULT 'pending', -- 'pending', 'confirmed', 'cancelled', 'completed'
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (request_id) REFERENCES match_requests(id) ON DELETE CASCADE,
  FOREIGN KEY (user1_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (user2_id) REFERENCES users(id) ON DELETE CASCADE
);

-- 인덱스 생성
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_timetables_user_id ON timetables(user_id);
CREATE INDEX IF NOT EXISTS idx_courses_timetable_id ON courses(timetable_id);
CREATE INDEX IF NOT EXISTS idx_courses_day_time ON courses(day_of_week, start_time, end_time);
CREATE INDEX IF NOT EXISTS idx_meal_preferences_user_id ON meal_preferences(user_id);
CREATE INDEX IF NOT EXISTS idx_match_requests_status ON match_requests(status);
CREATE INDEX IF NOT EXISTS idx_match_requests_date ON match_requests(request_date);
CREATE INDEX IF NOT EXISTS idx_matches_users ON matches(user1_id, user2_id);
CREATE INDEX IF NOT EXISTS idx_matches_status ON matches(status);