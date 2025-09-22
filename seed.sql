-- 테스트 사용자 데이터
INSERT OR IGNORE INTO users (name, email, phone, university) VALUES 
  ('김철수', 'chulsu@university.ac.kr', '010-1234-5678', '서울대학교'),
  ('이영희', 'younghee@university.ac.kr', '010-9876-5432', '서울대학교'),
  ('박민수', 'minsu@university.ac.kr', '010-5555-1234', '서울대학교'),
  ('최지원', 'jiwon@university.ac.kr', '010-7777-9999', '서울대학교');

-- 테스트 시간표 데이터
INSERT OR IGNORE INTO timetables (user_id, semester) VALUES 
  (1, '2024-2'),
  (2, '2024-2'),
  (3, '2024-2'),
  (4, '2024-2');

-- 테스트 수업 데이터 (김철수 - user_id: 1)
INSERT OR IGNORE INTO courses (timetable_id, course_name, professor, day_of_week, start_time, end_time, location) VALUES 
  (1, '데이터구조', '김교수', 1, '09:00', '10:30', '공학관 101'),
  (1, '컴퓨터네트워크', '이교수', 1, '13:00', '14:30', '공학관 201'),
  (1, '알고리즘', '박교수', 3, '10:00', '11:30', '공학관 301'),
  (1, '데이터베이스', '최교수', 5, '14:00', '15:30', '공학관 401');

-- 테스트 수업 데이터 (이영희 - user_id: 2)
INSERT OR IGNORE INTO courses (timetable_id, course_name, professor, day_of_week, start_time, end_time, location) VALUES 
  (2, '웹프로그래밍', '정교수', 1, '10:00', '11:30', '공학관 102'),
  (2, '소프트웨어공학', '한교수', 2, '13:00', '14:30', '공학관 202'),
  (2, '인공지능', '강교수', 3, '09:00', '10:30', '공학관 302'),
  (2, '머신러닝', '윤교수', 4, '15:00', '16:30', '공학관 402');

-- 테스트 수업 데이터 (박민수 - user_id: 3)
INSERT OR IGNORE INTO courses (timetable_id, course_name, professor, day_of_week, start_time, end_time, location) VALUES 
  (3, '운영체제', '서교수', 1, '11:00', '12:30', '공학관 103'),
  (3, '컴퓨터구조', '조교수', 2, '14:00', '15:30', '공학관 203'),
  (3, '프로그래밍언어론', '임교수', 4, '10:00', '11:30', '공학관 303'),
  (3, '소프트웨어보안', '신교수', 5, '13:00', '14:30', '공학관 403');

-- 테스트 수업 데이터 (최지원 - user_id: 4)
INSERT OR IGNORE INTO courses (timetable_id, course_name, professor, day_of_week, start_time, end_time, location) VALUES 
  (4, '모바일프로그래밍', '오교수', 2, '09:00', '10:30', '공학관 104'),
  (4, '클라우드컴퓨팅', '유교수', 2, '11:00', '12:30', '공학관 204'),
  (4, '빅데이터처리', '권교수', 3, '13:00', '14:30', '공학관 304'),
  (4, '정보보안', '전교수', 4, '14:00', '15:30', '공학관 404');

-- 테스트 식사 선호도 데이터
INSERT OR IGNORE INTO meal_preferences (user_id, meal_type, preferred_time, preferred_location, dietary_restrictions) VALUES 
  (1, 'lunch', '12:00', '학생회관 식당', '{"vegetarian": false, "allergies": []}'),
  (1, 'dinner', '18:00', '기숙사 식당', '{"vegetarian": false, "allergies": []}'),
  (2, 'lunch', '12:30', '공대 식당', '{"vegetarian": true, "allergies": ["nuts"]}'),
  (2, 'dinner', '17:30', '학생회관 식당', '{"vegetarian": true, "allergies": ["nuts"]}'),
  (3, 'lunch', '11:30', '중앙도서관 카페', '{"vegetarian": false, "allergies": ["seafood"]}'),
  (4, 'lunch', '12:00', '학생회관 식당', '{"vegetarian": false, "allergies": []}'),
  (4, 'dinner', '18:30', '기숙사 식당', '{"vegetarian": false, "allergies": []}');

-- 테스트 매칭 요청 데이터
INSERT OR IGNORE INTO match_requests (requester_id, meal_type, request_date, preferred_time_start, preferred_time_end, preferred_location, message, status) VALUES 
  (1, 'lunch', '2024-09-23', '12:00', '13:00', '학생회관 식당', '같이 점심 드실 분 구해요!', 'active'),
  (2, 'lunch', '2024-09-23', '12:30', '13:30', '공대 식당', '채식주의자 친구 구합니다', 'active'),
  (3, 'dinner', '2024-09-23', '17:00', '18:00', '중앙도서관 카페', '저녁 먹으면서 공부 이야기 해요', 'active'),
  (4, 'lunch', '2024-09-24', '12:00', '13:00', '학생회관 식당', '내일 점심 같이 드실 분!', 'active');