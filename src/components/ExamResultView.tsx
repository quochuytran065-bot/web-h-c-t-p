import React, { useState } from 'react';
import { ExamResult, ChoiceKey } from '../types';
import { 
  Award, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  RotateCcw, 
  ArrowLeft, 
  HelpCircle, 
  ChevronDown, 
  ChevronUp, 
  Filter, 
  Share2,
  BookOpen
} from 'lucide-react';

interface ExamResultViewProps {
  result: ExamResult;
  onRetake: () => void;
  onBackToList: () => void;
  onGoToDocuments: () => void;
}

export const ExamResultView: React.FC<ExamResultViewProps> = ({ 
  result, 
  onRetake, 
  onBackToList,
  onGoToDocuments
}) => {
  const [filterMode, setFilterMode] = useState<'all' | 'incorrect' | 'correct'>('all');
  const [expandedExplanations, setExpandedExplanations] = useState<Record<number, boolean>>({});

  // Toggle explanation expansion
  const toggleExplanation = (qId: number) => {
    setExpandedExplanations(prev => ({
      ...prev,
      [qId]: !prev[qId]
    }));
  };

  // Expand all / collapse all
  const expandAll = () => {
    const all: Record<number, boolean> = {};
    result.questions.forEach(q => { all[q.id] = true; });
    setExpandedExplanations(all);
  };

  const collapseAll = () => {
    setExpandedExplanations({});
  };

  // Format time spent into mm phút ss giây
  const formatTimeSpent = (totalSeconds: number) => {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    if (minutes === 0) return `${seconds} giây`;
    return `${minutes} phút ${seconds} giây`;
  };

  // Evaluation text based on score
  const getRankInfo = (score: number) => {
    if (score >= 9.0) return { label: 'Xuất sắc', color: 'text-emerald-700 bg-emerald-50 border-emerald-200', desc: 'Kiến thức rất vững vàng, tư duy nhanh nhạy!' };
    if (score >= 8.0) return { label: 'Giỏi', color: 'text-sky-700 bg-sky-50 border-sky-200', desc: 'Nắm chắc kiến thức trọng tâm, tiếp tục phát huy!' };
    if (score >= 6.5) return { label: 'Khá', color: 'text-blue-700 bg-blue-50 border-blue-200', desc: 'Cần chú ý ôn lại một số câu lý thuyết và mẹo tính nhanh.' };
    if (score >= 5.0) return { label: 'Trung bình', color: 'text-amber-700 bg-amber-50 border-amber-200', desc: 'Cần dành thêm thời gian đọc lại tài liệu và làm lại đề thi.' };
    return { label: 'Cần cố gắng', color: 'text-rose-700 bg-rose-50 border-rose-200', desc: 'Hãy xem lại lời giải chi tiết và ôn kỹ từng chuyên đề.' };
  };

  const rank = getRankInfo(result.score);

  // Filter questions
  const displayedQuestions = result.questions.filter(q => {
    const studentAns = result.userAnswers[q.id];
    const isCorrect = studentAns === q.correctAnswer;
    if (filterMode === 'correct') return isCorrect;
    if (filterMode === 'incorrect') return !isCorrect;
    return true;
  });

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-16">
      
      {/* Back Button */}
      <div>
        <button
          onClick={onBackToList}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Quay lại danh sách bài kiểm tra</span>
        </button>
      </div>

      {/* Main Score & Summary Card */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        
        {/* Top Header of Card */}
        <div className="bg-gradient-to-r from-slate-900 to-sky-950 p-6 sm:p-8 text-white">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-xs text-sky-200 font-semibold">
                <span>{result.subject}</span>
                <span>·</span>
                <span>{result.grade}</span>
                <span>·</span>
                <span>Nộp lúc: {result.submittedAt}</span>
              </div>
              <h1 className="text-xl sm:text-2xl font-bold font-heading">
                {result.examTitle}
              </h1>
              <p className="text-xs text-slate-300">
                Thí sinh: <strong>{result.userName}</strong>
              </p>
            </div>

            {/* Score Badge */}
            <div className="flex items-center sm:flex-col items-end sm:items-center justify-between sm:justify-center bg-white/10 backdrop-blur-md px-6 py-4 rounded-xl border border-white/20 shrink-0">
              <span className="text-xs uppercase tracking-wider text-sky-200 font-medium sm:mb-1">
                Điểm số đạt được
              </span>
              <div className="flex items-baseline gap-1">
                <span className="text-3xl sm:text-4xl font-extrabold font-mono text-white tracking-tight">
                  {result.score.toFixed(1)}
                </span>
                <span className="text-sm font-semibold text-sky-300">/ 10</span>
              </div>
              <span className="text-xs font-mono text-sky-200 mt-0.5">
                ({result.scorePercentage}%)
              </span>
            </div>
          </div>
        </div>

        {/* Breakdown Metric Tiles */}
        <div className="grid grid-cols-2 sm:grid-cols-4 divide-x divide-y sm:divide-y-0 divide-slate-100 border-b border-slate-200">
          
          <div className="p-4 sm:p-5 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-slate-500 font-medium">Số câu đúng</p>
              <p className="text-lg font-bold text-slate-900 font-mono">
                {result.correctCount} / {result.totalQuestions}
              </p>
            </div>
          </div>

          <div className="p-4 sm:p-5 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center shrink-0">
              <XCircle className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-slate-500 font-medium">Số câu sai / bỏ</p>
              <p className="text-lg font-bold text-slate-900 font-mono">
                {result.incorrectCount + result.unansweredCount} câu
              </p>
            </div>
          </div>

          <div className="p-4 sm:p-5 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-slate-500 font-medium">Thời gian làm</p>
              <p className="text-sm sm:text-base font-bold text-slate-900">
                {formatTimeSpent(result.timeSpentSeconds)}
              </p>
            </div>
          </div>

          <div className="p-4 sm:p-5 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-sky-50 text-sky-700 flex items-center justify-center shrink-0">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-slate-500 font-medium">Xếp loại kết quả</p>
              <p className="text-sm sm:text-base font-bold text-slate-900">
                {rank.label}
              </p>
            </div>
          </div>

        </div>

        {/* Action buttons inside card */}
        <div className="p-5 bg-slate-50/70 flex flex-wrap items-center justify-between gap-3">
          <p className="text-xs text-slate-600">
            {rank.desc}
          </p>

          <div className="flex items-center gap-2">
            <button
              onClick={onGoToDocuments}
              className="px-3.5 py-2 rounded-lg border border-slate-200 bg-white text-xs font-semibold text-slate-700 hover:bg-slate-50 flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>Đọc tài liệu ôn tập</span>
            </button>
            <button
              onClick={onRetake}
              className="px-4 py-2 rounded-lg bg-sky-700 hover:bg-sky-800 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer shadow-2xs"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Làm lại bài thi</span>
            </button>
          </div>
        </div>

      </div>

      {/* Answer Review Section */}
      <div className="space-y-4">
        
        {/* Controls Bar for Review */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-xl border border-slate-200">
          <div>
            <h2 className="text-base font-bold text-slate-900 font-heading">
              Xem Lại Đáp Án &amp; Lời Giải Chi Tiết
            </h2>
            <p className="text-xs text-slate-500">
              Đối chiếu đáp án của bạn với đáp án chính xác và phương pháp giải từng bước.
            </p>
          </div>

          <div className="flex items-center gap-2">
            {/* Filter buttons */}
            <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg text-xs">
              <button
                onClick={() => setFilterMode('all')}
                className={`px-3 py-1.5 rounded-md font-medium transition-colors cursor-pointer ${
                  filterMode === 'all'
                    ? 'bg-white text-slate-900 shadow-2xs font-semibold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Tất cả ({result.questions.length})
              </button>
              <button
                onClick={() => setFilterMode('incorrect')}
                className={`px-3 py-1.5 rounded-md font-medium transition-colors cursor-pointer ${
                  filterMode === 'incorrect'
                    ? 'bg-white text-rose-700 shadow-2xs font-semibold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Câu sai / bỏ ({result.incorrectCount + result.unansweredCount})
              </button>
              <button
                onClick={() => setFilterMode('correct')}
                className={`px-3 py-1.5 rounded-md font-medium transition-colors cursor-pointer ${
                  filterMode === 'correct'
                    ? 'bg-white text-emerald-700 shadow-2xs font-semibold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Câu đúng ({result.correctCount})
              </button>
            </div>

            <button
              onClick={expandAll}
              className="text-xs text-sky-700 hover:underline font-medium ml-2 cursor-pointer hidden md:inline"
            >
              Mở hết lời giải
            </button>
          </div>
        </div>

        {/* Questions Detailed Review List */}
        <div className="space-y-4">
          {displayedQuestions.map((q) => {
            const studentAns = result.userAnswers[q.id];
            const isCorrect = studentAns === q.correctAnswer;
            const isUnanswered = !studentAns;
            const isExpanded = expandedExplanations[q.id] ?? true; // expanded by default for best learning

            return (
              <div
                key={q.id}
                className={`bg-white rounded-xl border p-5 sm:p-6 transition-all ${
                  isCorrect
                    ? 'border-emerald-200/90 shadow-2xs'
                    : 'border-rose-200/90 shadow-2xs'
                }`}
              >
                {/* Question Status Banner */}
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-slate-800">
                      Câu {q.id}
                    </span>
                    <span className="text-slate-300">·</span>
                    {isCorrect ? (
                      <span className="text-xs font-semibold text-emerald-700 flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        Chính xác (+{(10 / result.totalQuestions).toFixed(2)} đ)
                      </span>
                    ) : isUnanswered ? (
                      <span className="text-xs font-semibold text-amber-700 flex items-center gap-1">
                        <HelpCircle className="w-3.5 h-3.5 text-amber-600" />
                        Chưa chọn đáp án (0 đ)
                      </span>
                    ) : (
                      <span className="text-xs font-semibold text-rose-700 flex items-center gap-1">
                        <XCircle className="w-3.5 h-3.5 text-rose-600" />
                        Chưa chính xác (0 đ)
                      </span>
                    )}
                  </div>

                  <div className="text-xs text-slate-500 font-medium">
                    Đáp án đúng: <strong className="text-emerald-700 font-mono text-sm">{q.correctAnswer}</strong>
                  </div>
                </div>

                {/* Question Text */}
                <div className="text-sm sm:text-base font-semibold text-slate-900 pt-3 leading-relaxed">
                  {q.text}
                </div>

                {/* Options Review Matrix */}
                <div className="grid grid-cols-1 gap-2 pt-3">
                  {q.options.map((opt) => {
                    const isUserChoice = studentAns === opt.key;
                    const isSystemCorrect = q.correctAnswer === opt.key;

                    let optionStyle = 'bg-slate-50/60 border-slate-200 text-slate-700';
                    let badgeStyle = 'bg-slate-100 text-slate-600 border border-slate-200';

                    if (isSystemCorrect) {
                      optionStyle = 'bg-emerald-50/80 border-emerald-400 text-emerald-950 font-medium';
                      badgeStyle = 'bg-emerald-600 text-white font-bold';
                    } else if (isUserChoice && !isSystemCorrect) {
                      optionStyle = 'bg-rose-50/80 border-rose-300 text-rose-950 line-through opacity-85';
                      badgeStyle = 'bg-rose-600 text-white font-bold';
                    }

                    return (
                      <div
                        key={opt.key}
                        className={`p-3 rounded-xl border text-xs sm:text-sm flex items-center justify-between gap-3 ${optionStyle}`}
                      >
                        <div className="flex items-center gap-3">
                          <span className={`w-6 h-6 rounded-md flex items-center justify-center text-xs shrink-0 ${badgeStyle}`}>
                            {opt.key}
                          </span>
                          <span className="leading-snug">{opt.label}</span>
                        </div>

                        {/* Badges on option row */}
                        <div className="text-xs shrink-0 font-medium">
                          {isSystemCorrect && (
                            <span className="text-emerald-700 font-semibold flex items-center gap-1">
                              <CheckCircle2 className="w-3.5 h-3.5" /> Đáp án đúng
                            </span>
                          )}
                          {isUserChoice && !isSystemCorrect && (
                            <span className="text-rose-600 font-semibold flex items-center gap-1">
                              <XCircle className="w-3.5 h-3.5" /> Lựa chọn của bạn
                            </span>
                          )}
                          {isUserChoice && isSystemCorrect && (
                            <span className="text-emerald-800 font-semibold">
                              (Bạn đã chọn đúng)
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Explanation Dropdown / Section */}
                <div className="mt-4 pt-3 border-t border-slate-100">
                  <button
                    onClick={() => toggleExplanation(q.id)}
                    className="flex items-center justify-between w-full text-left text-xs font-semibold text-slate-700 hover:text-sky-700 py-1 cursor-pointer"
                  >
                    <span className="flex items-center gap-1.5 text-sky-800">
                      <span>💡 Lời giải thích chi tiết:</span>
                    </span>
                    {isExpanded ? (
                      <ChevronUp className="w-4 h-4 text-slate-400" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-slate-400" />
                    )}
                  </button>

                  {isExpanded && (
                    <div className="mt-2 p-4 rounded-xl bg-slate-50 border border-slate-200/80 text-xs sm:text-sm text-slate-700 leading-relaxed space-y-1">
                      <p>{q.explanation}</p>
                      {q.topic && (
                        <p className="text-[11px] text-slate-400 pt-1">
                          Phân loại chuyên đề: {q.topic}
                        </p>
                      )}
                    </div>
                  )}
                </div>

              </div>
            );
          })}
        </div>

      </div>

    </div>
  );
};
