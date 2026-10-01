import React, { useState, useMemo } from 'react';
import { Exam, Subject, GradeLevel } from '../types';
import { useAuth } from '../context/AuthContext';
import { 
  Clock, 
  HelpCircle, 
  Award, 
  Play, 
  CheckCircle2, 
  Filter, 
  Search,
  BookCheck,
  ChevronRight,
  TrendingUp
} from 'lucide-react';

interface ExamListProps {
  exams: Exam[];
  onStartExam: (exam: Exam) => void;
  onViewPreviousResult: (examId: string) => void;
}

const SUBJECT_OPTIONS: Subject[] = [
  'Tất cả môn',
  'Toán học',
  'Tiếng Anh',
  'Vật lý',
  'Hóa học'
];

const GRADE_OPTIONS: GradeLevel[] = [
  'Tất cả lớp',
  'Lớp 11',
  'Lớp 12'
];

export const ExamList: React.FC<ExamListProps> = ({ 
  exams, 
  onStartExam, 
  onViewPreviousResult 
}) => {
  const { examHistory } = useAuth();
  const [selectedSubject, setSelectedSubject] = useState<Subject>('Tất cả môn');
  const [selectedGrade, setSelectedGrade] = useState<GradeLevel>('Tất cả lớp');
  const [searchQuery, setSearchQuery] = useState('');

  // Map highest score per examId
  const examStats = useMemo(() => {
    const stats: Record<string, { attempts: number; maxScore: number; lastScore: number }> = {};
    examHistory.forEach(h => {
      if (!stats[h.examId]) {
        stats[h.examId] = { attempts: 1, maxScore: h.score, lastScore: h.score };
      } else {
        stats[h.examId].attempts += 1;
        stats[h.examId].maxScore = Math.max(stats[h.examId].maxScore, h.score);
        stats[h.examId].lastScore = h.score;
      }
    });
    return stats;
  }, [examHistory]);

  const filteredExams = useMemo(() => {
    return exams.filter(exam => {
      const matchesSearch = 
        exam.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        exam.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesSubject = selectedSubject === 'Tất cả môn' || exam.subject === selectedSubject;
      const matchesGrade = selectedGrade === 'Tất cả lớp' || exam.grade === selectedGrade;

      return matchesSearch && matchesSubject && matchesGrade;
    });
  }, [exams, searchQuery, selectedSubject, selectedGrade]);

  return (
    <div className="space-y-6">

      {/* Top Banner Overview */}
      <div className="bg-gradient-to-r from-sky-900 to-indigo-950 rounded-2xl p-6 sm:p-8 text-white relative overflow-hidden shadow-sm">
        <div className="relative z-10 max-w-2xl space-y-3">
          <div className="flex items-center gap-2 text-xs font-semibold text-sky-200">
            <BookCheck className="w-4 h-4" />
            <span>HỆ THỐNG THI TRẮC NGHIỆM TRỰC TUYẾN</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold font-heading leading-tight">
            Phòng Luyện Thi Trắc Nghiệm Bấm Giờ
          </h1>
          <p className="text-xs sm:text-sm text-sky-100/90 leading-relaxed">
            Mỗi đề thi được thiết kế bám sát ma trận kiến thức, có đồng hồ bấm giờ chuẩn xác, 
            tự động chấm điểm và cung cấp lời giải thích chi tiết cho từng câu hỏi sau khi hoàn thành.
          </p>
        </div>
        <div className="absolute right-0 bottom-0 translate-x-12 translate-y-12 opacity-10 pointer-events-none">
          <BookCheck className="w-72 h-72 text-white" />
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-xl p-4 sm:p-5 border border-slate-200 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Tìm kiếm bài kiểm tra theo tên đề thi, chuyên đề..."
              className="w-full pl-10 pr-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-600 focus:bg-white transition-all"
            />
          </div>

          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg shrink-0">
            {GRADE_OPTIONS.map((grade) => (
              <button
                key={grade}
                onClick={() => setSelectedGrade(grade)}
                className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer whitespace-nowrap ${
                  selectedGrade === grade
                    ? 'bg-white text-slate-900 shadow-xs font-semibold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {grade}
              </button>
            ))}
          </div>
        </div>

        {/* Subject filter tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
          <span className="text-slate-400 font-medium mr-1 shrink-0 flex items-center gap-1">
            <Filter className="w-3.5 h-3.5" /> Môn thi:
          </span>
          {SUBJECT_OPTIONS.map((sub) => (
            <button
              key={sub}
              onClick={() => setSelectedSubject(sub)}
              className={`px-3 py-1.5 rounded-lg font-medium transition-colors whitespace-nowrap cursor-pointer ${
                selectedSubject === sub
                  ? 'bg-sky-700 text-white font-semibold shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200/80 hover:text-slate-900'
              }`}
            >
              {sub}
            </button>
          ))}
        </div>
      </div>

      {/* Exam List Cards */}
      <div className="space-y-4">
        {filteredExams.map((exam) => {
          const stats = examStats[exam.id];
          const hasTaken = Boolean(stats);

          return (
            <div
              key={exam.id}
              className="bg-white rounded-xl border border-slate-200 hover:border-slate-300 shadow-xs hover:shadow-sm transition-all p-5 sm:p-6 flex flex-col md:flex-row md:items-center justify-between gap-5"
            >
              {/* Exam Info */}
              <div className="space-y-2 flex-1">
                {/* Zero-pill unboxed metadata */}
                <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500">
                  <span className="font-semibold text-sky-800">{exam.subject}</span>
                  <span aria-hidden="true">·</span>
                  <span>{exam.grade}</span>
                  <span aria-hidden="true">·</span>
                  <span>Độ khó: {exam.difficulty}</span>
                  <span aria-hidden="true">·</span>
                  <span>Biên soạn: {exam.author}</span>
                </div>

                <h3 className="text-lg font-bold text-slate-900 font-heading">
                  {exam.title}
                </h3>

                <p className="text-xs sm:text-sm text-slate-600 line-clamp-2">
                  {exam.description}
                </p>

                {/* Exam Key Metrics */}
                <div className="flex flex-wrap items-center gap-4 pt-1 text-xs text-slate-600">
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-4 h-4 text-amber-600" />
                    <span>Thời gian: <strong>{exam.durationMinutes} phút</strong></span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <HelpCircle className="w-4 h-4 text-sky-600" />
                    <span>Số lượng: <strong>{exam.questions.length} câu hỏi</strong></span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <TrendingUp className="w-4 h-4 text-slate-400" />
                    <span>Lượt làm: <strong>{exam.attemptsCount.toLocaleString()}</strong></span>
                  </div>
                </div>
              </div>

              {/* Status & CTA Action */}
              <div className="flex flex-col sm:flex-row md:flex-col items-start md:items-end justify-between gap-3 pt-3 md:pt-0 border-t md:border-t-0 border-slate-100 shrink-0">
                {hasTaken ? (
                  <div className="text-left md:text-right">
                    <div className="flex items-center gap-1 text-xs text-emerald-700 font-semibold">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      <span>Đã làm ({stats.attempts} lần)</span>
                    </div>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Điểm cao nhất: <strong className="text-slate-900 font-mono text-sm">{stats.maxScore.toFixed(1)}/10</strong>
                    </p>
                  </div>
                ) : (
                  <div className="text-xs text-slate-400">
                    Chưa làm bài thi này
                  </div>
                )}

                <div className="flex items-center gap-2 w-full sm:w-auto">
                  {hasTaken && (
                    <button
                      onClick={() => onViewPreviousResult(exam.id)}
                      className="px-3.5 py-2 rounded-lg border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer"
                    >
                      Xem lại kết quả
                    </button>
                  )}

                  <button
                    onClick={() => onStartExam(exam)}
                    className="flex-1 sm:flex-none px-5 py-2.5 rounded-lg bg-sky-700 hover:bg-sky-800 text-white text-xs font-semibold flex items-center justify-center gap-2 shadow-xs transition-colors cursor-pointer whitespace-nowrap"
                  >
                    <Play className="w-3.5 h-3.5 fill-white" />
                    <span>{hasTaken ? 'Làm lại bài thi' : 'Bắt đầu làm bài'}</span>
                  </button>
                </div>
              </div>

            </div>
          );
        })}
      </div>

    </div>
  );
};
