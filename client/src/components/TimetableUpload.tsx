import React, { useState, useRef } from 'react';
import type { TimetableUploadFormData, Timetable } from '../types';
import { DAY_NAMES } from '../types';

interface TimetableUploadProps {
  onUpload: (image: File, semester: string) => Promise<void>;
  isLoading: boolean;
  error: string | null;
  latestTimetable: Timetable | null;
}

export const TimetableUpload: React.FC<TimetableUploadProps> = ({
  onUpload,
  isLoading,
  error,
  latestTimetable
}) => {
  const [formData, setFormData] = useState<TimetableUploadFormData>({
    semester: '2024-2',
    image: null
  });
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData(prev => ({ ...prev, image: file }));
      
      // 이미지 미리보기 설정
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreviewUrl(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUploadAreaClick = () => {
    fileInputRef.current?.click();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.image) {
      alert('시간표 이미지를 선택해주세요.');
      return;
    }

    try {
      await onUpload(formData.image, formData.semester);
      
      // 성공 시 폼 초기화
      setFormData({ semester: formData.semester, image: null });
      setPreviewUrl(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (error) {
      // 에러는 상위 컴포넌트에서 처리
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">
        <i className="fas fa-calendar-alt mr-2"></i>
        시간표 등록
      </h2>
      
      {error && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-4 mb-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">학기</label>
          <select
            value={formData.semester}
            onChange={(e) => setFormData(prev => ({ ...prev, semester: e.target.value }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            disabled={isLoading}
          >
            <option value="2024-2">2024년 2학기</option>
            <option value="2025-1">2025년 1학기</option>
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            에브리타임 시간표 이미지
          </label>
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageSelect}
              className="hidden"
              disabled={isLoading}
            />
            
            {!previewUrl ? (
              <div
                onClick={handleUploadAreaClick}
                className="cursor-pointer hover:border-indigo-500 transition-colors"
              >
                <i className="fas fa-cloud-upload-alt text-4xl text-gray-400 mb-4"></i>
                <p className="text-gray-500">클릭하여 이미지 업로드</p>
                <p className="text-sm text-gray-400 mt-2">PNG, JPG 파일만 가능</p>
              </div>
            ) : (
              <div className="mt-4">
                <img
                  src={previewUrl}
                  alt="시간표 미리보기"
                  className="max-w-full h-auto rounded-lg mx-auto mb-4"
                />
                <button
                  type="button"
                  onClick={handleUploadAreaClick}
                  className="text-indigo-600 hover:text-indigo-800 text-sm"
                  disabled={isLoading}
                >
                  다른 이미지 선택
                </button>
              </div>
            )}
          </div>
        </div>
        
        <button
          type="submit"
          disabled={isLoading || !formData.image}
          className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <i className="fas fa-upload mr-2"></i>
          {isLoading ? '분석 중...' : '시간표 분석 및 저장'}
        </button>
      </form>

      {/* 현재 시간표 표시 */}
      {latestTimetable && (
        <div className="border-t pt-4">
          <h3 className="font-bold text-lg mb-3">{latestTimetable.semester} 시간표</h3>
          
          {latestTimetable.image_url && (
            <div className="mb-4">
              <img
                src={latestTimetable.image_url}
                alt="시간표"
                className="max-w-full h-auto rounded-lg border"
              />
            </div>
          )}
          
          <div className="space-y-2">
            {latestTimetable.courses.length > 0 ? (
              latestTimetable.courses.map((course, index) => (
                <div key={index} className="bg-gray-50 p-3 rounded border-l-4 border-indigo-500">
                  <div className="font-medium">{course.course_name}</div>
                  <div className="text-sm text-gray-600">
                    {DAY_NAMES[course.day_of_week]} {course.start_time}-{course.end_time}
                    {course.location && ` (${course.location})`}
                  </div>
                  {course.professor && (
                    <div className="text-sm text-gray-500">{course.professor}</div>
                  )}
                </div>
              ))
            ) : (
              <p className="text-gray-500">수업 정보가 없습니다.</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};