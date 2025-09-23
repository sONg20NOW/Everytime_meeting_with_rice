import React from 'react';
import { useAuth } from './hooks/useAuth';
import { useTimetable } from './hooks/useTimetable';
import { useMatches } from './hooks/useMatches';
import { AuthForm } from './components/AuthForm';
import { UserStatus } from './components/UserStatus';
import { TimetableUpload } from './components/TimetableUpload';
import { MatchingForm } from './components/MatchingForm';
import { MatchList } from './components/MatchList';
import { LoadingModal } from './components/LoadingModal';

const App: React.FC = () => {
  const {
    user,
    isLoading: authLoading,
    error: authError,
    login,
    logout,
    clearError: clearAuthError,
    isAuthenticated
  } = useAuth();

  const {
    timetables,
    isLoading: timetableLoading,
    error: timetableError,
    uploadTimetable,
    clearError: clearTimetableError,
    getLatestTimetable
  } = useTimetable(user?.id || null);

  const {
    matches,
    isLoading: matchLoading,
    error: matchError,
    createMatchRequest,
    updateMatchStatus,
    clearError: clearMatchError,
    getPartnerInfo
  } = useMatches(user?.id || null);

  const handleTimetableUpload = async (image: File, semester: string) => {
    try {
      const result = await uploadTimetable(image, semester);
      const message = result.message || '시간표가 성공적으로 분석되고 저장되었습니다!';
      const courseCount = result.courses ? result.courses.length : 0;
      alert(`${message}\n분석된 수업 개수: ${courseCount}개`);
    } catch (error) {
      // 에러는 hook에서 처리됨
    }
  };

  const handleMatchRequest = async (matchData: any) => {
    try {
      const result = await createMatchRequest(matchData);
      if (result.matches && result.matches.length > 0) {
        alert(`매칭 완료! ${result.matches.length}명의 밥친구를 찾았습니다.`);
      } else {
        alert('현재 조건에 맞는 밥친구를 찾을 수 없습니다. 다른 시간대로 다시 시도해보세요.');
      }
    } catch (error) {
      // 에러는 hook에서 처리됨
    }
  };

  const handleConfirmMatch = async (matchId: number) => {
    await updateMatchStatus(matchId, 'confirmed');
  };

  const handleCancelMatch = async (matchId: number) => {
    await updateMatchStatus(matchId, 'cancelled');
  };

  const isAnyLoading = authLoading || timetableLoading || matchLoading;
  const latestTimetable = getLatestTimetable();

  return (
    <div className="bg-gradient-to-br from-blue-50 to-indigo-100 min-h-screen">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* 헤더 */}
        <header className="text-center mb-12">
          <h1 className="text-4xl font-bold text-indigo-800 mb-4">
            <i className="fas fa-utensils mr-3"></i>
            MealMate
          </h1>
          <p className="text-xl text-gray-600 mb-6">에브리타임 시간표로 찾는 완벽한 밥약 파트너</p>
          <div className="bg-white rounded-lg shadow-lg p-6 max-w-2xl mx-auto">
            <p className="text-gray-700">시간표 이미지를 업로드하면 AI가 자동으로 분석하여 같은 시간대에 비어있는 친구들과 매칭해드립니다!</p>
          </div>
        </header>

        {/* 사용자 상태 표시 */}
        {isAuthenticated && user && (
          <UserStatus user={user} onLogout={logout} />
        )}

        {/* 메인 콘텐츠 */}
        <div>
          {!isAuthenticated ? (
            /* 로그인/회원가입 섹션 */
            <AuthForm
              onLogin={login}
              isLoading={authLoading}
              error={authError}
            />
          ) : (
            /* 메인 대시보드 */
            <div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* 시간표 업로드 섹션 */}
                <TimetableUpload
                  onUpload={handleTimetableUpload}
                  isLoading={timetableLoading}
                  error={timetableError}
                  latestTimetable={latestTimetable}
                />

                {/* 밥약 매칭 섹션 */}
                <MatchingForm
                  onCreateMatch={handleMatchRequest}
                  isLoading={matchLoading}
                  error={matchError}
                  userId={user!.id}
                />
              </div>

              {/* 매칭 결과 섹션 */}
              <div className="mt-8">
                <MatchList
                  matches={matches}
                  currentUserId={user!.id}
                  onConfirmMatch={handleConfirmMatch}
                  onCancelMatch={handleCancelMatch}
                  isLoading={matchLoading}
                  getPartnerInfo={getPartnerInfo}
                />
              </div>
            </div>
          )}
        </div>

        {/* 로딩 모달 */}
        <LoadingModal isVisible={isAnyLoading} />
      </div>
    </div>
  );
};

export default App;