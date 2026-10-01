import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Exam, ChoiceKey, ExamResult } from '../types';
import { useAuth } from '../context/AuthContext';
import { 
  Clock, 
  Flag, 
  CheckCircle2, 
  AlertTriangle, 
  ChevronLeft, 
  ChevronRight, 
  Send, 
  RotateCcw,
  HelpCircle,
  Volume2,
  VolumeX
} from 'lucide-react';

interface ExamTakingViewProps {
  exam: Exam;
  onFinishExam: (result: ExamResult) => void;
  onCancelExam: () => void;
}

export const ExamTakingView: React.FC<ExamTakingViewProps> = ({ 
  exam, 
  onFinishExam, 
  onCancelExam 
}) => {
  const { currentUser } = useAuth();
  
  // Total duration in seconds
  const totalSeconds = exam.durationMinutes * 60;
  const [secondsRemaining, setSecondsRemaining] = useState<number>(totalSeconds);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [userAnswers, setUserAnswers] = useState<Record<number, ChoiceKey>>({});
  const [flaggedQuestions, setFlaggedQuestions] = useState<number[]>([]);
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState<boolean>(false);
  const [isTimeUpAlert, setIsTimeUpAlert] = useState<boolean>(false);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);

  // Auto scroll top when changing question
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentQuestionIndex]);

  // Submit test handler
  const handleSubmitExam = useCallback(() => {
    const timeSpent = totalSeconds - secondsRemaining;
    let correctCount = 0;
    let incorrectCount = 0;
    let unansweredCount = 0;

    exam.questions.forEach((q) => {
      const studentAns = userAnswers[q.id];
      if (!studentAns) {
        unansweredCount += 1;
      } else if (studentAns === q.correctAnswer) {
        correctCount += 1;
      } else {
        incorrectCount += 1;
      }
    });

    // Score on 10.0 scale
    const rawScore = (correctCount / exam.questions.length) * 10;
    const finalScore = Math.round(rawScore * 10) / 10;
    const scorePercentage = Math.round((correctCount / exam.questions.length) * 100);

    const result: ExamResult = {
      id: 'result-' + Date.now(),
      examId: exam.id,
      examTitle: exam.title,
      subject: exam.subject,
      grade: exam.grade,
      userId: currentUser?.id || 'guest',
      userName: currentUser?.name || 'Khách học tập',
      score: finalScore,
      scorePercentage,
      totalQuestions: exam.questions.length,
      correctCount,
      incorrectCount,
      unansweredCount,
      timeSpentSeconds: timeSpent,
      submittedAt: new Date().toLocaleTimeString('vi-VN', { 
        hour: '2-digit', 
        minute: '2-digit',
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      }),
      userAnswers,
      questions: exam.questions
    };

    onFinishExam(result);
  }, [exam, secondsRemaining, totalSeconds, userAnswers, currentUser, onFinishExam]);

  // Countdown Timer
  useEffect(() => {
    const timer = setInterval(() => {
      setSecondsRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setIsTimeUpAlert(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Handle time up trigger
  useEffect(() => {
    if (isTimeUpAlert && secondsRemaining === 0) {
      setTimeout(() => {
        handleSubmitExam();
      }, 1500);
    }
  }, [isTimeUpAlert, secondsRemaining, handleSubmitExam]);

  // Format seconds into MM:SS
  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  // Keyboard navigation & shortcuts (A, B, C, D, Arrows)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger if modal is open or focusing an input
      if (isSubmitModalOpen || isTimeUpAlert) return;
      const target = e.target as HTMLElement;
      if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA') return;

      const key = e.key.toUpperCase();
      if (['A', 'B', 'C', 'D'].includes(key)) {
        const currentQ = exam.questions[currentQuestionIndex];
        if (currentQ) {
          setUserAnswers(prev => ({
            ...prev,
            [currentQ.id]: key as ChoiceKey
          }));
        }
      } else if (e.key === 'ArrowRight') {
        if (currentQuestionIndex < exam.questions.length - 1) {
          setCurrentQuestionIndex(prev => prev + 1);
        }
      } else if (e.key === 'ArrowLeft') {
        if (currentQuestionIndex > 0) {
          setCurrentQuestionIndex(prev => prev - 1);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentQuestionIndex, exam.questions, isSubmitModalOpen, isTimeUpAlert]);

  const currentQuestion = exam.questions[currentQuestionIndex];
  const selectedOption = userAnswers[currentQuestion.id];
  const isFlagged = flaggedQuestions.includes(currentQuestion.id);

  const toggleFlag = (qId: number) => {
    setFlaggedQuestions(prev => 
      prev.includes(qId) ? prev.filter(id => id !== qId) : [...prev, qId]
    );
  };

  const selectOption = (optKey: ChoiceKey) => {
    setUserAnswers(prev => ({
      ...prev,
      [currentQuestion.id]: optKey
    }));
  };

  const answeredCount = Object.keys(userAnswers).length;
  const remainingCount = exam.questions.length - answeredCount;

  // Warning thresholds
  const isLowTime = secondsRemaining <= 300; // < 5 minutes
  const isCriticalTime = secondsRemaining <= 60; // < 1 minute

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col pb-12">
      
      {/* Sticky Test Header Bar */}
      <header className="sticky top-0 z-40 bg-white border-b border-slate-200 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          
          {/* Exam Title & Subject */}
          <div className="flex items-center gap-3 min-w-0">
            <button
              onClick={() => {
                if (window.confirm('Bạn có chắc chắn muốn thoát khỏi bài thi? Kết quả hiện tại sẽ không được lưu.')) {
                  onCancelExam();
                }
              }}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
              title="Thoát khỏi bài thi"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <div className="min-w-0">
              <h2 className="text-sm sm:text-base font-bold text-slate-900 truncate font-heading">
                {exam.title}
              </h2>
              <div className="flex items-center gap-2 text-xs text-slate-500">
                <span>{exam.subject}</span>
                <span aria-hidden="true">·</span>
                <span>{exam.grade}</span>
                <span aria-hidden="true">·</span>
                <span>Câu {currentQuestionIndex + 1}/{exam.questions.length}</span>
              </div>
            </div>
          </div>

          {/* Countdown Clock & Actions */}
          <div className="flex items-center gap-3 shrink-0">
            
            {/* Live Countdown Timer */}
            <div 
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl border font-mono font-bold text-sm sm:text-base transition-colors ${
                isCriticalTime
                  ? 'bg-rose-50 border-rose-300 text-rose-700 animate-pulse'
                  : isLowTime
                  ? 'bg-amber-50 border-amber-300 text-amber-800'
                  : 'bg-slate-50 border-slate-200 text-slate-800'
              }`}
            >
              <Clock className={`w-4 h-4 ${isCriticalTime ? 'text-rose-600' : isLowTime ? 'text-amber-600' : 'text-slate-500'}`} />
              <span className="tabular-nums tracking-wider">{formatTime(secondsRemaining)}</span>
            </div>

            {/* Submit Button */}
            <button
              onClick={() => setIsSubmitModalOpen(true)}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs sm:text-sm rounded-lg shadow-xs flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Send className="w-4 h-4" />
              <span>Nộp bài</span>
            </button>
          </div>

        </div>

        {/* Progress bar based on answered questions */}
        <div className="w-full bg-slate-200 h-1">
          <div 
            className="bg-sky-600 h-1 transition-all duration-300"
            style={{ width: `${(answeredCount / exam.questions.length) * 100}%` }}
          />
        </div>
      </header>

      {/* Main Testing Layout */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 flex-1 w-full grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Area: Current Question Card (8 Cols on Desktop) */}
        <div className="lg:col-span-8 space-y-4">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 sm:p-8 space-y-6">
            
            {/* Question Header & Flag control */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-1 rounded-md bg-sky-100 text-sky-800 font-bold text-xs font-mono">
                  CÂU {currentQuestionIndex + 1}
                </span>
                {currentQuestion.topic && (
                  <span className="text-xs text-slate-400 hidden sm:inline">
                    Chuyên đề: {currentQuestion.topic}
                  </span>
                )}
              </div>

              <button
                onClick={() => toggleFlag(currentQuestion.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors cursor-pointer ${
                  isFlagged
                    ? 'bg-amber-50 border-amber-300 text-amber-800 font-semibold'
                    : 'border-slate-200 text-slate-500 hover:text-slate-800 hover:bg-slate-50'
                }`}
              >
                <Flag className={`w-3.5 h-3.5 ${isFlagged ? 'fill-amber-500 text-amber-500' : ''}`} />
                <span>{isFlagged ? 'Đã đánh dấu cờ' : 'Đánh dấu xem lại'}</span>
              </button>
            </div>

            {/* Question Text */}
            <div className="text-base sm:text-lg font-medium text-slate-900 leading-relaxed">
              {currentQuestion.text}
            </div>

            {/* Options A, B, C, D */}
            <div className="space-y-3 pt-2">
              {currentQuestion.options.map((option) => {
                const isSelected = selectedOption === option.key;

                return (
                  <button
                    key={option.key}
                    onClick={() => selectOption(option.key)}
                    className={`w-full text-left p-4 rounded-xl border transition-all flex items-start gap-3.5 cursor-pointer ${
                      isSelected
                        ? 'bg-sky-50/80 border-sky-600 shadow-2xs text-slate-900 ring-1 ring-sky-600'
                        : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50/60 text-slate-700'
                    }`}
                  >
                    <div 
                      className={`w-7 h-7 rounded-lg flex items-center justify-center font-bold text-xs shrink-0 transition-colors ${
                        isSelected 
                          ? 'bg-sky-700 text-white shadow-2xs' 
                          : 'bg-slate-100 text-slate-600 border border-slate-200'
                      }`}
                    >
                      {option.key}
                    </div>
                    <div className="text-sm sm:text-base font-normal pt-0.5 leading-snug flex-1">
                      {option.label}
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Bottom Nav inside question card: Prev / Next */}
            <div className="flex items-center justify-between pt-6 border-t border-slate-100">
              <button
                onClick={() => setCurrentQuestionIndex(prev => Math.max(0, prev - 1))}
                disabled={currentQuestionIndex === 0}
                className="px-4 py-2 rounded-lg border border-slate-200 text-xs sm:text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:pointer-events-none flex items-center gap-1 transition-colors cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Câu trước</span>
              </button>

              <span className="text-xs text-slate-400 hidden sm:inline">
                Dùng phím <kbd className="px-1.5 py-0.5 bg-slate-100 border border-slate-200 rounded font-mono text-[10px]">A</kbd> <kbd className="px-1.5 py-0.5 bg-slate-100 border border-slate-200 rounded font-mono text-[10px]">B</kbd> <kbd className="px-1.5 py-0.5 bg-slate-100 border border-slate-200 rounded font-mono text-[10px]">C</kbd> <kbd className="px-1.5 py-0.5 bg-slate-100 border border-slate-200 rounded font-mono text-[10px]">D</kbd> để chọn nhanh
              </span>

              {currentQuestionIndex < exam.questions.length - 1 ? (
                <button
                  onClick={() => setCurrentQuestionIndex(prev => Math.min(exam.questions.length - 1, prev + 1))}
                  className="px-4 py-2 rounded-lg bg-sky-700 hover:bg-sky-800 text-white text-xs sm:text-sm font-semibold flex items-center gap-1 shadow-2xs transition-colors cursor-pointer"
                >
                  <span>Câu kế tiếp</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              ) : (
                <button
                  onClick={() => setIsSubmitModalOpen(true)}
                  className="px-5 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs sm:text-sm font-semibold flex items-center gap-1 shadow-2xs transition-colors cursor-pointer"
                >
                  <span>Hoàn thành &amp; Nộp bài</span>
                  <Send className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

          </div>
        </div>

        {/* Right Area: Question Navigation Matrix (4 Cols on Desktop) */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-5 space-y-4 sticky top-24">
            
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-sm font-bold text-slate-900 font-heading">
                Bảng danh sách câu hỏi
              </h3>
              <div className="text-xs font-mono font-semibold text-slate-600">
                {answeredCount}/{exam.questions.length} đã làm
              </div>
            </div>

            {/* Status Legend */}
            <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-500 pb-2">
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded bg-sky-700"></span>
                <span>Đã chọn đáp án</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded bg-white border border-slate-300"></span>
                <span>Chưa trả lời</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded bg-amber-100 border border-amber-400"></span>
                <span>Đã gắn cờ</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded ring-2 ring-sky-600"></span>
                <span>Đang xem</span>
              </div>
            </div>

            {/* Question Grid Buttons */}
            <div className="grid grid-cols-5 gap-2 max-h-72 overflow-y-auto pr-1">
              {exam.questions.map((q, idx) => {
                const isAnswered = Boolean(userAnswers[q.id]);
                const isCurrent = currentQuestionIndex === idx;
                const isFlag = flaggedQuestions.includes(q.id);

                return (
                  <button
                    key={q.id}
                    onClick={() => setCurrentQuestionIndex(idx)}
                    className={`relative h-10 rounded-lg font-mono text-xs font-bold transition-all flex items-center justify-center cursor-pointer ${
                      isCurrent
                        ? 'ring-2 ring-sky-600 ring-offset-1'
                        : ''
                    } ${
                      isAnswered
                        ? 'bg-sky-700 text-white shadow-2xs hover:bg-sky-800'
                        : 'bg-white border border-slate-200 text-slate-700 hover:border-slate-300 hover:bg-slate-50'
                    }`}
                  >
                    <span>{idx + 1}</span>
                    {isFlag && (
                      <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-amber-500 rounded-full border border-white" />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Quick summary stats */}
            <div className="pt-3 border-t border-slate-100 text-xs text-slate-600 space-y-1">
              <div className="flex justify-between">
                <span>Số câu đã làm:</span>
                <strong className="text-slate-900">{answeredCount} câu</strong>
              </div>
              <div className="flex justify-between">
                <span>Số câu còn lại:</span>
                <strong className={remainingCount > 0 ? 'text-amber-600' : 'text-emerald-600'}>
                  {remainingCount} câu
                </strong>
              </div>
              {flaggedQuestions.length > 0 && (
                <div className="flex justify-between text-amber-700">
                  <span>Cần xem lại:</span>
                  <strong>{flaggedQuestions.length} câu</strong>
                </div>
              )}
            </div>

            {/* Submit CTA button */}
            <button
              onClick={() => setIsSubmitModalOpen(true)}
              className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs sm:text-sm rounded-xl shadow-xs transition-colors cursor-pointer flex items-center justify-center gap-2"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Nộp bài &amp; Xem kết quả</span>
            </button>

          </div>
        </div>

      </main>

      {/* Confirmation Modal Before Submission */}
      {isSubmitModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div 
            className="w-full max-w-md bg-white rounded-2xl shadow-2xl border border-slate-200 p-6 space-y-5 animate-in fade-in zoom-in-95 duration-150"
            role="dialog"
            aria-modal="true"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                <Send className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900 font-heading">
                  Xác nhận nộp bài kiểm tra?
                </h3>
                <p className="text-xs text-slate-500">
                  {exam.title}
                </p>
              </div>
            </div>

            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200/80 space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-600">Tổng số câu hỏi:</span>
                <strong className="text-slate-900">{exam.questions.length} câu</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">Số câu đã hoàn thành:</span>
                <strong className="text-emerald-700">{answeredCount} câu</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">Số câu chưa làm:</span>
                <strong className={remainingCount > 0 ? 'text-rose-600' : 'text-slate-500'}>
                  {remainingCount} câu
                </strong>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">Thời gian làm bài còn:</span>
                <strong className="font-mono text-slate-900">{formatTime(secondsRemaining)}</strong>
              </div>
            </div>

            {remainingCount > 0 && (
              <div className="flex items-start gap-2 p-3 bg-amber-50 rounded-lg text-xs text-amber-800 border border-amber-200">
                <AlertTriangle className="w-4 h-4 shrink-0 text-amber-600 mt-0.5" />
                <span>
                  Bạn còn <strong>{remainingCount}</strong> câu chưa chọn đáp án. Các câu chưa làm sẽ được tính là 0 điểm.
                </span>
              </div>
            )}

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setIsSubmitModalOpen(false)}
                className="px-4 py-2 rounded-lg border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer"
              >
                Tiếp tục làm bài
              </button>
              <button
                onClick={() => {
                  setIsSubmitModalOpen(false);
                  handleSubmitExam();
                }}
                className="px-5 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-xs transition-colors cursor-pointer"
              >
                Xác nhận nộp bài
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Auto Submit When Time Runs Out Alert */}
      {isTimeUpAlert && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-xs">
          <div className="w-full max-w-sm bg-white rounded-2xl p-6 text-center space-y-4 shadow-2xl border border-slate-200 animate-in zoom-in-95 duration-200">
            <div className="w-14 h-14 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mx-auto">
              <Clock className="w-8 h-8" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900 font-heading">
                Đã hết thời gian làm bài!
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Hệ thống đang tiến hành chấm điểm và lưu kết quả của bạn...
              </p>
            </div>
            <div className="w-8 h-8 border-3 border-sky-600 border-t-transparent rounded-full animate-spin mx-auto" />
          </div>
        </div>
      )}

    </div>
  );
};
