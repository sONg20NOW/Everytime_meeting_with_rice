// 전역 변수
let currentUser = null;

// 페이지 로드시 초기화
document.addEventListener('DOMContentLoaded', function() {
    // 오늘 날짜를 기본값으로 설정
    const today = new Date().toISOString().split('T')[0];
    const mealDateInput = document.getElementById('meal-date');
    if (mealDateInput) {
        mealDateInput.value = today;
        mealDateInput.min = today;
    }

    // 기본 시간 설정
    const mealStartTime = document.getElementById('meal-start-time');
    const mealEndTime = document.getElementById('meal-end-time');
    if (mealStartTime && mealEndTime) {
        mealStartTime.value = '12:00';
        mealEndTime.value = '13:00';
    }

    // 로컬 스토리지에서 사용자 정보 확인
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
        currentUser = JSON.parse(savedUser);
        showDashboard();
        loadUserTimetables();
        loadUserMatches();
    }
});

// 로딩 모달 표시/숨김
function showLoading() {
    document.getElementById('loading-modal').classList.remove('hidden');
}

function hideLoading() {
    document.getElementById('loading-modal').classList.add('hidden');
}

// 사용자 로그인/등록
async function loginUser() {
    const email = document.getElementById('login-email').value;
    const name = document.getElementById('login-name').value;
    const phone = document.getElementById('login-phone').value;
    const university = document.getElementById('login-university').value;

    if (!email || !name || !university) {
        alert('이메일, 이름, 대학교는 필수 입력 사항입니다.');
        return;
    }

    showLoading();

    try {
        const response = await axios.post('/api/users', {
            name: name,
            email: email,
            phone: phone,
            university: university
        });

        currentUser = response.data;
        localStorage.setItem('currentUser', JSON.stringify(currentUser));
        
        showDashboard();
        loadUserTimetables();
        loadUserMatches();
        
        hideLoading();
    } catch (error) {
        console.error('Login error:', error);
        alert('로그인 중 오류가 발생했습니다.');
        hideLoading();
    }
}

// 대시보드 표시
function showDashboard() {
    document.getElementById('auth-section').classList.add('hidden');
    document.getElementById('dashboard').classList.remove('hidden');
    
    // 사용자 상태 표시
    document.getElementById('user-status').innerHTML = `
        <div class="bg-white rounded-lg shadow-lg p-4 text-center">
            <div class="flex items-center justify-center space-x-4">
                <div>
                    <i class="fas fa-user-circle text-2xl text-indigo-600"></i>
                    <span class="ml-2 font-medium">${currentUser.name}</span>
                    <span class="text-gray-500">(${currentUser.university})</span>
                </div>
                <button onclick="logout()" class="bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600">
                    로그아웃
                </button>
            </div>
        </div>
    `;
}

// 로그아웃
function logout() {
    currentUser = null;
    localStorage.removeItem('currentUser');
    location.reload();
}

// 이미지 미리보기
function previewImage(input) {
    if (input.files && input.files[0]) {
        const reader = new FileReader();
        reader.onload = function(e) {
            document.getElementById('preview-img').src = e.target.result;
            document.getElementById('image-preview').classList.remove('hidden');
            document.getElementById('upload-area').classList.add('hidden');
        };
        reader.readAsDataURL(input.files[0]);
    }
}

// 시간표 업로드 및 분석
async function uploadTimetable() {
    const imageFile = document.getElementById('timetable-image').files[0];
    const semester = document.getElementById('semester').value;

    if (!imageFile) {
        alert('시간표 이미지를 선택해주세요.');
        return;
    }

    if (!currentUser) {
        alert('로그인이 필요합니다.');
        return;
    }

    showLoading();

    try {
        const formData = new FormData();
        formData.append('image', imageFile);
        formData.append('userId', currentUser.id.toString());
        formData.append('semester', semester);

        const response = await axios.post('/api/timetables/analyze', formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });

        if (response.data.success) {
            alert('시간표가 성공적으로 분석되고 저장되었습니다!');
            loadUserTimetables();
            
            // 업로드 영역 초기화
            document.getElementById('timetable-image').value = '';
            document.getElementById('image-preview').classList.add('hidden');
            document.getElementById('upload-area').classList.remove('hidden');
        } else {
            alert('시간표 분석에 실패했습니다.');
        }

        hideLoading();
    } catch (error) {
        console.error('Upload error:', error);
        alert('시간표 업로드 중 오류가 발생했습니다.');
        hideLoading();
    }
}

// 사용자 시간표 로드
async function loadUserTimetables() {
    if (!currentUser) return;

    try {
        const response = await axios.get(`/api/users/${currentUser.id}/timetables`);
        const timetables = response.data;

        const timetableDiv = document.getElementById('current-timetable');
        
        if (timetables.length === 0) {
            timetableDiv.innerHTML = `
                <div class="text-center text-gray-500 py-4">
                    <i class="fas fa-calendar-times text-4xl mb-2"></i>
                    <p>등록된 시간표가 없습니다.</p>
                </div>
            `;
            return;
        }

        const latestTimetable = timetables[0];
        
        let coursesHtml = '';
        if (latestTimetable.courses && latestTimetable.courses.length > 0) {
            const dayNames = ['일', '월', '화', '수', '목', '금', '토'];
            coursesHtml = latestTimetable.courses.map(course => `
                <div class="bg-gray-50 p-3 rounded border-l-4 border-indigo-500">
                    <div class="font-medium">${course.course_name}</div>
                    <div class="text-sm text-gray-600">
                        ${dayNames[course.day_of_week]} ${course.start_time}-${course.end_time}
                        ${course.location ? `(${course.location})` : ''}
                    </div>
                    ${course.professor ? `<div class="text-sm text-gray-500">${course.professor}</div>` : ''}
                </div>
            `).join('');
        }

        timetableDiv.innerHTML = `
            <div class="border-t pt-4">
                <h3 class="font-bold text-lg mb-3">${latestTimetable.semester} 시간표</h3>
                ${latestTimetable.image_url ? `
                    <div class="mb-4">
                        <img src="${latestTimetable.image_url}" alt="시간표" class="max-w-full h-auto rounded-lg border">
                    </div>
                ` : ''}
                <div class="space-y-2">
                    ${coursesHtml || '<p class="text-gray-500">수업 정보가 없습니다.</p>'}
                </div>
            </div>
        `;
    } catch (error) {
        console.error('Error loading timetables:', error);
    }
}

// 매칭 요청 생성
async function createMatchRequest() {
    if (!currentUser) {
        alert('로그인이 필요합니다.');
        return;
    }

    const mealType = document.getElementById('meal-type').value;
    const mealDate = document.getElementById('meal-date').value;
    const startTime = document.getElementById('meal-start-time').value;
    const endTime = document.getElementById('meal-end-time').value;
    const location = document.getElementById('meal-location').value;
    const message = document.getElementById('meal-message').value;

    if (!mealDate || !startTime || !endTime) {
        alert('날짜와 시간을 모두 선택해주세요.');
        return;
    }

    if (startTime >= endTime) {
        alert('종료 시간은 시작 시간보다 늦어야 합니다.');
        return;
    }

    showLoading();

    try {
        const response = await axios.post('/api/match-requests', {
            requester_id: currentUser.id,
            meal_type: mealType,
            request_date: mealDate,
            preferred_time_start: startTime,
            preferred_time_end: endTime,
            preferred_location: location,
            message: message
        });

        if (response.data.matches && response.data.matches.length > 0) {
            alert(`매칭 완료! ${response.data.matches.length}명의 밥친구를 찾았습니다.`);
        } else {
            alert('현재 조건에 맞는 밥친구를 찾을 수 없습니다. 다른 시간대로 다시 시도해보세요.');
        }

        loadUserMatches();
        
        // 폼 초기화
        document.getElementById('meal-message').value = '';
        
        hideLoading();
    } catch (error) {
        console.error('Match request error:', error);
        alert('매칭 요청 중 오류가 발생했습니다.');
        hideLoading();
    }
}

// 사용자 매칭 결과 로드
async function loadUserMatches() {
    if (!currentUser) return;

    try {
        const response = await axios.get(`/api/users/${currentUser.id}/matches`);
        const matches = response.data;

        const matchesDiv = document.getElementById('matches-list');
        
        if (matches.length === 0) {
            matchesDiv.innerHTML = `
                <div class="text-center text-gray-500 py-8">
                    <i class="fas fa-heart-broken text-4xl mb-2"></i>
                    <p>아직 매칭된 밥약이 없습니다.</p>
                    <p class="text-sm">시간표를 등록하고 매칭 요청을 보내보세요!</p>
                </div>
            `;
            return;
        }

        const matchesHtml = matches.map(match => {
            const partner = match.user1_id === currentUser.id ? 
                { name: match.user2_name, email: match.user2_email, phone: match.user2_phone } :
                { name: match.user1_name, email: match.user1_email, phone: match.user1_phone };
            
            const statusColors = {
                'pending': 'bg-yellow-100 text-yellow-800',
                'confirmed': 'bg-green-100 text-green-800', 
                'cancelled': 'bg-red-100 text-red-800',
                'completed': 'bg-blue-100 text-blue-800'
            };
            
            const statusNames = {
                'pending': '대기중',
                'confirmed': '확정',
                'cancelled': '취소됨',
                'completed': '완료'
            };

            const mealTypeNames = {
                'lunch': '점심',
                'dinner': '저녁'
            };

            return `
                <div class="bg-white border rounded-lg p-4 shadow-sm">
                    <div class="flex items-center justify-between mb-3">
                        <div class="flex items-center space-x-2">
                            <i class="fas fa-user-friends text-indigo-600"></i>
                            <span class="font-medium">${partner.name}</span>
                            <span class="px-2 py-1 rounded-full text-xs ${statusColors[match.status] || 'bg-gray-100 text-gray-800'}">
                                ${statusNames[match.status] || match.status}
                            </span>
                        </div>
                        <div class="text-sm text-gray-500">
                            ${match.meal_date} ${match.meal_time}
                        </div>
                    </div>
                    
                    <div class="grid grid-cols-2 gap-4 text-sm">
                        <div>
                            <span class="text-gray-600">식사:</span> ${mealTypeNames[match.meal_type] || match.meal_type}
                        </div>
                        <div>
                            <span class="text-gray-600">장소:</span> ${match.location || '미정'}
                        </div>
                    </div>
                    
                    ${match.message ? `
                        <div class="mt-3 p-2 bg-gray-50 rounded text-sm">
                            <i class="fas fa-comment text-gray-500 mr-1"></i>
                            ${match.message}
                        </div>
                    ` : ''}
                    
                    <div class="mt-3 flex items-center justify-between">
                        <div class="text-sm text-gray-600">
                            ${partner.email}
                            ${partner.phone ? ` • ${partner.phone}` : ''}
                        </div>
                        
                        ${match.status === 'pending' ? `
                            <div class="space-x-2">
                                <button onclick="confirmMatch(${match.id})" 
                                        class="bg-green-500 text-white px-3 py-1 rounded text-sm hover:bg-green-600">
                                    <i class="fas fa-check mr-1"></i>확정
                                </button>
                                <button onclick="cancelMatch(${match.id})" 
                                        class="bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600">
                                    <i class="fas fa-times mr-1"></i>취소
                                </button>
                            </div>
                        ` : ''}
                    </div>
                </div>
            `;
        }).join('');

        matchesDiv.innerHTML = matchesHtml;
    } catch (error) {
        console.error('Error loading matches:', error);
    }
}

// 매칭 확정
async function confirmMatch(matchId) {
    try {
        await axios.patch(`/api/matches/${matchId}`, { status: 'confirmed' });
        alert('매칭이 확정되었습니다!');
        loadUserMatches();
    } catch (error) {
        console.error('Error confirming match:', error);
        alert('매칭 확정 중 오류가 발생했습니다.');
    }
}

// 매칭 취소
async function cancelMatch(matchId) {
    if (confirm('정말로 이 매칭을 취소하시겠습니까?')) {
        try {
            await axios.patch(`/api/matches/${matchId}`, { status: 'cancelled' });
            alert('매칭이 취소되었습니다.');
            loadUserMatches();
        } catch (error) {
            console.error('Error cancelling match:', error);
            alert('매칭 취소 중 오류가 발생했습니다.');
        }
    }
}

// 유틸리티 함수들
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('ko-KR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        weekday: 'long'
    });
}

function formatTime(timeString) {
    const [hours, minutes] = timeString.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? '오후' : '오전';
    const displayHour = hour > 12 ? hour - 12 : (hour === 0 ? 12 : hour);
    return `${ampm} ${displayHour}:${minutes}`;
}