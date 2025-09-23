import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { serveStatic } from 'hono/cloudflare-workers'

type Bindings = {
  DB: D1Database;
  R2: R2Bucket;
  AI: Ai;
}

const app = new Hono<{ Bindings: Bindings }>()

// CORS 설정
app.use('/api/*', cors())

// 정적 파일 서빙
app.use('/static/*', serveStatic({ root: './public' }))

// 메인 페이지
app.get('/', (c) => {
  return c.html(`
    <!DOCTYPE html>
    <html lang="ko">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>MealMate - 시간표 기반 밥약 매칭</title>
        <script src="https://cdn.tailwindcss.com"></script>
        <link href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css" rel="stylesheet">
        <link href="/static/style.css" rel="stylesheet">
    </head>
    <body class="bg-gradient-to-br from-blue-50 to-indigo-100 min-h-screen">
        <div class="container mx-auto px-4 py-8 max-w-6xl">
            <!-- 헤더 -->
            <header class="text-center mb-12">
                <h1 class="text-4xl font-bold text-indigo-800 mb-4">
                    <i class="fas fa-utensils mr-3"></i>
                    MealMate
                </h1>
                <p class="text-xl text-gray-600 mb-6">에브리타임 시간표로 찾는 완벽한 밥약 파트너</p>
                <div class="bg-white rounded-lg shadow-lg p-6 max-w-2xl mx-auto">
                    <p class="text-gray-700">시간표 이미지를 업로드하면 AI가 자동으로 분석하여 같은 시간대에 비어있는 친구들과 매칭해드립니다!</p>
                </div>
            </header>

            <!-- 로그인 상태 표시 -->
            <div id="user-status" class="mb-8"></div>

            <!-- 메인 콘텐츠 -->
            <div id="main-content">
                <!-- 로그인/회원가입 섹션 -->
                <div id="auth-section" class="max-w-md mx-auto">
                    <div class="bg-white rounded-lg shadow-lg p-6">
                        <h2 class="text-2xl font-bold text-center mb-6 text-gray-800">시작하기</h2>
                        
                        <!-- 로그인 폼 -->
                        <div id="login-form" class="space-y-4">
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-2">이메일</label>
                                <input type="email" id="login-email" 
                                       class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                       placeholder="your@university.ac.kr">
                            </div>
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-2">이름</label>
                                <input type="text" id="login-name" 
                                       class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                       placeholder="홍길동">
                            </div>
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-2">전화번호 (선택)</label>
                                <input type="tel" id="login-phone" 
                                       class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                       placeholder="010-1234-5678">
                            </div>
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-2">대학교</label>
                                <input type="text" id="login-university" 
                                       class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                       placeholder="서울대학교">
                            </div>
                            <button onclick="loginUser()" 
                                    class="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 transition duration-200">
                                <i class="fas fa-sign-in-alt mr-2"></i>
                                로그인/가입
                            </button>
                        </div>
                    </div>
                </div>

                <!-- 메인 대시보드 (로그인 후 표시) -->
                <div id="dashboard" class="hidden">
                    <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        <!-- 시간표 업로드 섹션 -->
                        <div class="bg-white rounded-lg shadow-lg p-6">
                            <h2 class="text-2xl font-bold mb-6 text-gray-800">
                                <i class="fas fa-calendar-alt mr-2"></i>
                                시간표 등록
                            </h2>
                            
                            <div id="timetable-upload" class="space-y-4">
                                <div>
                                    <label class="block text-sm font-medium text-gray-700 mb-2">학기</label>
                                    <select id="semester" class="w-full px-3 py-2 border border-gray-300 rounded-md">
                                        <option value="2024-2">2024년 2학기</option>
                                        <option value="2025-1">2025년 1학기</option>
                                    </select>
                                </div>
                                
                                <div>
                                    <label class="block text-sm font-medium text-gray-700 mb-2">에브리타임 시간표 이미지</label>
                                    <div class="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                                        <input type="file" id="timetable-image" accept="image/*" class="hidden" onchange="previewImage(this)">
                                        <div id="upload-area" onclick="document.getElementById('timetable-image').click()" class="cursor-pointer">
                                            <i class="fas fa-cloud-upload-alt text-4xl text-gray-400 mb-4"></i>
                                            <p class="text-gray-500">클릭하여 이미지 업로드</p>
                                            <p class="text-sm text-gray-400 mt-2">PNG, JPG 파일만 가능</p>
                                        </div>
                                        <div id="image-preview" class="hidden mt-4">
                                            <img id="preview-img" class="max-w-full h-auto rounded-lg mx-auto">
                                        </div>
                                    </div>
                                </div>
                                
                                <button onclick="uploadTimetable()" 
                                        class="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 transition duration-200">
                                    <i class="fas fa-upload mr-2"></i>
                                    시간표 분석 및 저장
                                </button>
                            </div>

                            <!-- 현재 시간표 표시 -->
                            <div id="current-timetable" class="mt-6"></div>
                        </div>

                        <!-- 밥약 매칭 섹션 -->
                        <div class="bg-white rounded-lg shadow-lg p-6">
                            <h2 class="text-2xl font-bold mb-6 text-gray-800">
                                <i class="fas fa-users mr-2"></i>
                                밥약 매칭
                            </h2>
                            
                            <div id="matching-section" class="space-y-4">
                                <div>
                                    <label class="block text-sm font-medium text-gray-700 mb-2">식사 종류</label>
                                    <select id="meal-type" class="w-full px-3 py-2 border border-gray-300 rounded-md">
                                        <option value="lunch">점심</option>
                                        <option value="dinner">저녁</option>
                                    </select>
                                </div>
                                
                                <div>
                                    <label class="block text-sm font-medium text-gray-700 mb-2">희망 날짜</label>
                                    <input type="date" id="meal-date" 
                                           class="w-full px-3 py-2 border border-gray-300 rounded-md"
                                           min="">
                                </div>
                                
                                <div class="grid grid-cols-2 gap-4">
                                    <div>
                                        <label class="block text-sm font-medium text-gray-700 mb-2">시작 시간</label>
                                        <input type="time" id="meal-start-time" 
                                               class="w-full px-3 py-2 border border-gray-300 rounded-md">
                                    </div>
                                    <div>
                                        <label class="block text-sm font-medium text-gray-700 mb-2">종료 시간</label>
                                        <input type="time" id="meal-end-time" 
                                               class="w-full px-3 py-2 border border-gray-300 rounded-md">
                                    </div>
                                </div>
                                
                                <div>
                                    <label class="block text-sm font-medium text-gray-700 mb-2">선호 장소</label>
                                    <input type="text" id="meal-location" 
                                           class="w-full px-3 py-2 border border-gray-300 rounded-md"
                                           placeholder="학생회관 식당, 공대 식당 등">
                                </div>
                                
                                <div>
                                    <label class="block text-sm font-medium text-gray-700 mb-2">메시지 (선택)</label>
                                    <textarea id="meal-message" rows="3" 
                                              class="w-full px-3 py-2 border border-gray-300 rounded-md"
                                              placeholder="같이 밥 드실 분 구해요!"></textarea>
                                </div>
                                
                                <button onclick="createMatchRequest()" 
                                        class="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition duration-200">
                                    <i class="fas fa-search mr-2"></i>
                                    밥친구 찾기
                                </button>
                            </div>
                        </div>
                    </div>

                    <!-- 매칭 결과 섹션 -->
                    <div id="matches-section" class="mt-8 bg-white rounded-lg shadow-lg p-6">
                        <h2 class="text-2xl font-bold mb-6 text-gray-800">
                            <i class="fas fa-heart mr-2"></i>
                            매칭 결과
                        </h2>
                        <div id="matches-list">
                            <p class="text-gray-500 text-center py-8">매칭 요청을 보내면 결과가 여기에 표시됩니다.</p>
                        </div>
                    </div>
                </div>
            </div>

            <!-- 로딩 모달 -->
            <div id="loading-modal" class="hidden fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div class="bg-white rounded-lg p-6 text-center">
                    <i class="fas fa-spinner fa-spin text-4xl text-indigo-600 mb-4"></i>
                    <p class="text-gray-700">처리 중입니다...</p>
                </div>
            </div>
        </div>

        <script src="https://cdn.jsdelivr.net/npm/axios@1.6.0/dist/axios.min.js"></script>
        <script src="/static/app.js"></script>
    </body>
    </html>
  `)
})

// API 라우트들

// 사용자 관련 API - 회원가입
app.post('/api/users/register', async (c) => {
  const { env } = c
  const { email, password } = await c.req.json()

  try {
    // 기존 사용자 확인
    const existingUser = await env.DB.prepare(`
      SELECT * FROM users WHERE email = ?
    `).bind(email).first()

    if (existingUser) {
      return c.json({ error: '이미 존재하는 이메일입니다.' }, 400)
    }

    // 새 사용자 생성 (비밀번호는 실제로는 해시화해야 함)
    const result = await env.DB.prepare(`
      INSERT INTO users (email, name, phone, university) 
      VALUES (?, ?, ?, ?)
    `).bind(email, email.split('@')[0], null, '기본대학교').run()

    const newUser = await env.DB.prepare(`
      SELECT * FROM users WHERE id = ?
    `).bind(result.meta.last_row_id).first()

    return c.json(newUser)
  } catch (error) {
    console.error('Error creating user:', error)
    return c.json({ error: 'Failed to create user' }, 500)
  }
})

// 사용자 관련 API - 로그인
app.post('/api/users/login', async (c) => {
  const { env } = c
  const { email, password } = await c.req.json()

  try {
    // 사용자 확인 (실제로는 비밀번호 해시 비교)
    const user = await env.DB.prepare(`
      SELECT * FROM users WHERE email = ?
    `).bind(email).first()

    if (!user) {
      return c.json({ error: '존재하지 않는 이메일입니다.' }, 401)
    }

    // 간단한 로그인 (실제로는 비밀번호 검증 필요)
    return c.json(user)
  } catch (error) {
    console.error('Error logging in user:', error)
    return c.json({ error: 'Failed to login' }, 500)
  }
})

// 시간표 이미지 업로드 및 분석
app.post('/api/timetables/analyze', async (c) => {
  const { env } = c
  const formData = await c.req.formData()
  const image = formData.get('image') as File
  const userId = formData.get('userId') as string
  const semester = formData.get('semester') as string

  if (!image || !userId || !semester) {
    return c.json({ error: 'Missing required fields' }, 400)
  }

  try {
    // 이미지를 R2에 업로드 (로컬 개발 환경에서는 시뮬레이션)
    const imageKey = `timetables/${userId}/${semester}-${Date.now()}.jpg`
    
    // 로컬 개발 환경에서는 R2 업로드를 건너뜀
    let imageUrl = `https://demo-timetable/${imageKey}`
    
    // AI 분석 (로컬에서는 샘플 데이터 사용)
    let courses = []
    
    try {
      // 프로덕션 환경에서만 AI 실행
      if (env.AI) {
        const imageBuffer = await image.arrayBuffer()
        const aiResult = await env.AI.run('@cf/llava-hf/llava-1.5-7b-hf', {
          image: Array.from(new Uint8Array(imageBuffer)),
          prompt: "이 시간표 이미지를 분석해서 다음 JSON 형식으로 수업 정보를 추출해주세요. 각 수업에 대해 과목명, 교수명(있다면), 요일(월=1,화=2,수=3,목=4,금=5,토=6,일=0), 시작시간(HH:MM), 종료시간(HH:MM), 강의실을 포함해주세요: {\"courses\": [{\"course_name\": \"과목명\", \"professor\": \"교수명\", \"day_of_week\": 1, \"start_time\": \"09:00\", \"end_time\": \"10:30\", \"location\": \"강의실\"}]}"
        })
        
        const aiResponse = JSON.parse(aiResult.response || '{"courses": []}')
        courses = aiResponse.courses || []
        
        // R2 업로드도 프로덕션에서만
        await env.R2.put(imageKey, image.stream())
        imageUrl = `https://your-domain.com/${imageKey}`
      } else {
        // 로컬 개발 환경 - 샘플 시간표 데이터 생성
        console.log('Local development: Using sample timetable data')
        courses = [
          {
            course_name: '웹프로그래밍',
            professor: '김교수',
            day_of_week: 1, // 월요일
            start_time: '09:00',
            end_time: '10:30',
            location: '공학관 301'
          },
          {
            course_name: '데이터베이스',
            professor: '이교수',
            day_of_week: 1, // 월요일
            start_time: '11:00',
            end_time: '12:30',
            location: '공학관 401'
          },
          {
            course_name: '알고리즘',
            professor: '박교수',
            day_of_week: 3, // 수요일
            start_time: '13:00',
            end_time: '14:30',
            location: '공학관 201'
          },
          {
            course_name: '소프트웨어공학',
            professor: '최교수',
            day_of_week: 5, // 금요일
            start_time: '15:00',
            end_time: '16:30',
            location: '공학관 501'
          }
        ]
      }
    } catch (aiError) {
      console.warn('AI analysis failed, using sample data:', aiError.message)
      // AI 실패 시 샘플 데이터 사용
      courses = [
        {
          course_name: '업로드된 시간표',
          professor: '담당교수',
          day_of_week: 1,
          start_time: '09:00', 
          end_time: '10:30',
          location: '강의실'
        },
        {
          course_name: '분석된 수업',
          professor: '지도교수',
          day_of_week: 3,
          start_time: '13:00',
          end_time: '14:30', 
          location: '실습실'
        }
      ]
    }

    // 기존 시간표 삭제
    await env.DB.prepare(`
      DELETE FROM timetables WHERE user_id = ? AND semester = ?
    `).bind(userId, semester).run()

    // 새 시간표 생성
    const timetableResult = await env.DB.prepare(`
      INSERT INTO timetables (user_id, semester, image_url) 
      VALUES (?, ?, ?)
    `).bind(userId, semester, imageUrl).run()

    const timetableId = timetableResult.meta.last_row_id

    // 수업 정보 저장
    for (const course of courses) {
      await env.DB.prepare(`
        INSERT INTO courses (timetable_id, course_name, professor, day_of_week, start_time, end_time, location)
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `).bind(
        timetableId,
        course.course_name || '수업명 미상',
        course.professor || '',
        course.day_of_week || 1,
        course.start_time || '09:00',
        course.end_time || '10:30',
        course.location || ''
      ).run()
    }

    return c.json({ 
      success: true, 
      timetable_id: timetableId,
      courses: courses,
      image_url: imageUrl,
      message: env.AI ? 'AI 분석 완료' : '로컬 개발 환경 - 샘플 데이터 사용'
    })
  } catch (error) {
    console.error('Error analyzing timetable:', error)
    return c.json({ error: 'Failed to analyze timetable' }, 500)
  }
})

// 사용자의 시간표 조회
app.get('/api/users/:userId/timetables', async (c) => {
  const { env } = c
  const userId = c.req.param('userId')

  try {
    const timetables = await env.DB.prepare(`
      SELECT t.*, 
             GROUP_CONCAT(
               c.course_name || '|' || 
               c.professor || '|' || 
               c.day_of_week || '|' || 
               c.start_time || '|' || 
               c.end_time || '|' || 
               c.location
             ) as courses_data
      FROM timetables t
      LEFT JOIN courses c ON t.id = c.timetable_id
      WHERE t.user_id = ?
      GROUP BY t.id
      ORDER BY t.created_at DESC
    `).bind(userId).all()

    const result = timetables.results.map(tt => {
      const courses = []
      if (tt.courses_data) {
        const coursesStr = tt.courses_data.split(',')
        for (const courseStr of coursesStr) {
          const [course_name, professor, day_of_week, start_time, end_time, location] = courseStr.split('|')
          courses.push({
            course_name,
            professor,
            day_of_week: parseInt(day_of_week),
            start_time,
            end_time,
            location
          })
        }
      }
      
      return {
        id: tt.id,
        semester: tt.semester,
        image_url: tt.image_url,
        created_at: tt.created_at,
        courses
      }
    })

    return c.json(result)
  } catch (error) {
    console.error('Error fetching timetables:', error)
    return c.json({ error: 'Failed to fetch timetables' }, 500)
  }
})

// 매칭 요청 생성
app.post('/api/match-requests', async (c) => {
  const { env } = c
  const { 
    requester_id, 
    meal_type, 
    request_date, 
    preferred_time_start, 
    preferred_time_end, 
    preferred_location, 
    message 
  } = await c.req.json()

  try {
    const result = await env.DB.prepare(`
      INSERT INTO match_requests 
      (requester_id, meal_type, request_date, preferred_time_start, preferred_time_end, preferred_location, message)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `).bind(
      requester_id, meal_type, request_date, 
      preferred_time_start, preferred_time_end, 
      preferred_location, message
    ).run()

    // 매칭 알고리즘 실행
    const matches = await findMatches(env.DB, result.meta.last_row_id)

    return c.json({ 
      request_id: result.meta.last_row_id,
      matches: matches
    })
  } catch (error) {
    console.error('Error creating match request:', error)
    return c.json({ error: 'Failed to create match request' }, 500)
  }
})

// 매칭 결과 조회
app.get('/api/users/:userId/matches', async (c) => {
  const { env } = c
  const userId = c.req.param('userId')

  try {
    const matches = await env.DB.prepare(`
      SELECT 
        m.*,
        u1.name as user1_name,
        u1.email as user1_email,
        u1.phone as user1_phone,
        u2.name as user2_name,
        u2.email as user2_email,
        u2.phone as user2_phone,
        mr.preferred_location,
        mr.message
      FROM matches m
      JOIN users u1 ON m.user1_id = u1.id
      JOIN users u2 ON m.user2_id = u2.id
      JOIN match_requests mr ON m.request_id = mr.id
      WHERE m.user1_id = ? OR m.user2_id = ?
      ORDER BY m.created_at DESC
    `).bind(userId, userId).all()

    return c.json(matches.results)
  } catch (error) {
    console.error('Error fetching matches:', error)
    return c.json({ error: 'Failed to fetch matches' }, 500)
  }
})

// 매칭 알고리즘 함수
async function findMatches(db: D1Database, requestId: number) {
  try {
    // 매칭 요청 정보 가져오기
    const request = await db.prepare(`
      SELECT * FROM match_requests WHERE id = ?
    `).bind(requestId).first()

    if (!request) return []

    // 같은 날짜, 같은 식사 시간대에 겹치지 않는 다른 사용자들 찾기
    const requestDayOfWeek = new Date(request.request_date).getDay()
    
    // 요청자의 해당 요일 수업 시간 가져오기
    const requesterCourses = await db.prepare(`
      SELECT c.* FROM courses c
      JOIN timetables t ON c.timetable_id = t.id
      WHERE t.user_id = ? AND c.day_of_week = ?
    `).bind(request.requester_id, requestDayOfWeek).all()

    // 잠재적 매칭 후보들 찾기 (같은 대학, 다른 사용자)
    const candidates = await db.prepare(`
      SELECT DISTINCT t.user_id, u.name, u.email, u.phone, u.university
      FROM timetables t
      JOIN users u ON t.user_id = u.id
      JOIN users requester ON requester.id = ?
      WHERE u.university = requester.university 
        AND u.id != ?
        AND NOT EXISTS (
          SELECT 1 FROM matches m 
          WHERE (m.user1_id = u.id OR m.user2_id = u.id)
            AND m.meal_date = ?
            AND m.meal_type = ?
            AND m.status IN ('pending', 'confirmed')
        )
    `).bind(request.requester_id, request.requester_id, request.request_date, request.meal_type).all()

    const matches = []

    for (const candidate of candidates.results) {
      // 후보자의 해당 요일 수업 시간 가져오기
      const candidateCourses = await db.prepare(`
        SELECT c.* FROM courses c
        JOIN timetables t ON c.timetable_id = t.id
        WHERE t.user_id = ? AND c.day_of_week = ?
      `).bind(candidate.user_id, requestDayOfWeek).all()

      // 시간 충돌 검사
      const hasConflict = checkTimeConflict(
        requesterCourses.results,
        candidateCourses.results,
        request.preferred_time_start,
        request.preferred_time_end
      )

      if (!hasConflict) {
        // 매칭 생성
        const matchResult = await db.prepare(`
          INSERT INTO matches 
          (request_id, user1_id, user2_id, meal_type, meal_date, meal_time, location)
          VALUES (?, ?, ?, ?, ?, ?, ?)
        `).bind(
          requestId,
          request.requester_id,
          candidate.user_id,
          request.meal_type,
          request.request_date,
          request.preferred_time_start,
          request.preferred_location
        ).run()

        matches.push({
          match_id: matchResult.meta.last_row_id,
          candidate: candidate,
          meal_time: request.preferred_time_start,
          location: request.preferred_location
        })
      }
    }

    return matches
  } catch (error) {
    console.error('Error in findMatches:', error)
    return []
  }
}

// 시간 충돌 검사 함수
function checkTimeConflict(courses1: any[], courses2: any[], startTime: string, endTime: string) {
  const allCourses = [...courses1, ...courses2]
  
  for (const course of allCourses) {
    if (timeOverlap(course.start_time, course.end_time, startTime, endTime)) {
      return true // 충돌 있음
    }
  }
  
  return false // 충돌 없음
}

// 시간 겹침 검사 함수
function timeOverlap(start1: string, end1: string, start2: string, end2: string) {
  const parseTime = (timeStr: string) => {
    const [hours, minutes] = timeStr.split(':').map(Number)
    return hours * 60 + minutes
  }
  
  const s1 = parseTime(start1)
  const e1 = parseTime(end1)
  const s2 = parseTime(start2)
  const e2 = parseTime(end2)
  
  return s1 < e2 && s2 < e1
}

// 매칭 상태 업데이트
app.patch('/api/matches/:matchId', async (c) => {
  const { env } = c
  const matchId = c.req.param('matchId')
  const { status } = await c.req.json()

  try {
    await env.DB.prepare(`
      UPDATE matches 
      SET status = ?, updated_at = CURRENT_TIMESTAMP 
      WHERE id = ?
    `).bind(status, matchId).run()

    return c.json({ success: true })
  } catch (error) {
    console.error('Error updating match status:', error)
    return c.json({ error: 'Failed to update match status' }, 500)
  }
})

export default app