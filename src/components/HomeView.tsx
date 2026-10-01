import React from 'react';
import { DocumentItem, Exam } from '../types';
import { useAuth } from '../context/AuthContext';
import { 
  BookOpen, 
  Clock, 
  Award, 
  CheckCircle2, 
  ArrowRight, 
  FileText, 
  Play, 
  BookCheck,
  TrendingUp,
  Sparkles,
  Users
} from 'lucide-react';
import { HERO_IMAGE } from '../data/mockData';

interface HomeViewProps {
  documents: DocumentItem[];
  exams: Exam[];
  onSelectTab: (tab: 'home' | 'documents' | 'exams' | 'history') => void;
  onSelectDocument: (doc: DocumentItem) => void;
  onStartExam: (exam: Exam) => void;
}

export const HomeView: React.FC<HomeViewProps> = ({
  documents,
  exams,
  onSelectTab,
  onSelectDocument,
  onStartExam
}) => {
  const { currentUser, openAuthModal } = useAuth();

  const featuredDocs = documents.slice(0, 3);
  const featuredExams = exams.slice(0, 3);

  return (
    <div className="space-y-16 pb-12">
      
      {/* Hero Section */}
      <section className="relative rounded-3xl bg-slate-900 text-white overflow-hidden shadow-lg border border-slate-800">
        <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[460px]">
          
          {/* Hero Left Content */}
          <div className="lg:col-span-7 p-8 sm:p-12 lg:p-16 flex flex-col justify-center space-y-6 z-10">
            <div className="space-y-3">
              {/* Unboxed kicker (zero-pill discipline) */}
              <div className="flex items-center gap-2 text-xs font-semibold text-sky-400 tracking-wide uppercase">
                <Sparkles className="w-4 h-4" />
                <span>NỀN TẢNG HỌC TẬP &amp; LUYỆN THI TRỰC TUYẾN 2026</span>
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold font-heading leading-tight tracking-tight text-white">
                Chinh Phục Điểm Số <br className="hidden sm:inline" />
                <span className="text-sky-400">Với Lộ Trình Chuẩn Hóa</span>
              </h1>

              <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-xl">
                Hệ thống tài liệu học tập toàn diện phân loại theo môn &amp; khối lớp, kết hợp cùng 
                ngân hàng đề thi trắc nghiệm bấm giờ tự động và lời giải chi tiết cho từng câu hỏi.
              </p>
            </div>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={() => onSelectTab('exams')}
                className="px-6 py-3 bg-sky-600 hover:bg-sky-500 text-white font-semibold text-sm rounded-xl shadow-md flex items-center gap-2 transition-all cursor-pointer hover:shadow-sky-500/20"
              >
                <Play className="w-4 h-4 fill-white" />
                <span>Làm bài kiểm tra ngay</span>
              </button>

              <button
                onClick={() => onSelectTab('documents')}
                className="px-5 py-3 bg-slate-800/90 hover:bg-slate-700/90 text-slate-100 font-semibold text-sm rounded-xl border border-slate-700 flex items-center gap-2 transition-all cursor-pointer"
              >
                <BookOpen className="w-4 h-4 text-sky-300" />
                <span>Xem kho tài liệu</span>
              </button>
            </div>

            {/* Adjacency proof indicators */}
            <div className="pt-4 border-t border-slate-800/80 flex flex-wrap items-center gap-6 text-xs text-slate-400">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Chương trình GDPT mới nhất</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-sky-400" />
                <span>Đồng hồ đếm ngược chuẩn xác</span>
              </div>
              <div className="flex items-center gap-2">
                <Award className="w-4 h-4 text-amber-400" />
                <span>Chấm điểm &amp; giải thích tức thì</span>
              </div>
            </div>
          </div>

          {/* Hero Right Visual Banner */}
          <div className="lg:col-span-5 relative hidden lg:block overflow-hidden">
            <img
              src={HERO_IMAGE}
              alt="Học sinh ôn tập trực tuyến với EduViet"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-slate-900 via-transparent to-transparent" />
            <div className="absolute bottom-6 right-6 bg-slate-950/80 backdrop-blur-md p-4 rounded-xl border border-slate-800 text-xs text-slate-300 max-w-xs space-y-1">
              <p className="font-semibold text-white">Đề thi chuẩn cấu trúc</p>
              <p className="text-[11px] text-slate-400">Cập nhật liên tục các dạng câu hỏi mức độ thông hiểu và vận dụng cao.</p>
            </div>
          </div>

        </div>
      </section>

      {/* 4-Step Learning Journey Section */}
      <section className="space-y-6">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-xs font-bold text-sky-700 tracking-wider uppercase">
            QUY TRÌNH HỌC TẬP HIỆU QUẢ
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 font-heading">
            4 Bước Đơn Giản Để Bứt Phá Điểm Số
          </h2>
          <p className="text-xs sm:text-sm text-slate-500">
            Học tập chủ động kết hợp thực hành bấm giờ mang lại kết quả thi tốt nhất.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-3">
            <div className="w-10 h-10 rounded-xl bg-sky-50 text-sky-800 font-bold font-mono text-sm flex items-center justify-center">
              01
            </div>
            <h3 className="text-base font-bold text-slate-900 font-heading">
              Đăng ký tài khoản
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Tạo hồ sơ học sinh theo khối lớp để hệ thống đề xuất tài liệu và đề thi phù hợp với mục tiêu của bạn.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-800 font-bold font-mono text-sm flex items-center justify-center">
              02
            </div>
            <h3 className="text-base font-bold text-slate-900 font-heading">
              Xem tài liệu ôn tập
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Tra cứu tài liệu Toán, Lý, Hóa, Anh... theo khối lớp với tóm tắt công thức và sơ đồ tư duy trực quan.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-800 font-bold font-mono text-sm flex items-center justify-center">
              03
            </div>
            <h3 className="text-base font-bold text-slate-900 font-heading">
              Làm bài thi bấm giờ
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Luyện đề trắc nghiệm A/B/C/D với đồng hồ đếm ngược chân thực, rèn luyện kỹ năng phân bổ thời gian.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-3">
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-800 font-bold font-mono text-sm flex items-center justify-center">
              04
            </div>
            <h3 className="text-base font-bold text-slate-900 font-heading">
              Xem giải thích chi tiết
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Nhận điểm số ngay lập tức cùng phân tích số câu đúng/sai và lời giải từng bước để khắc phục lỗi sai.
            </p>
          </div>

        </div>
      </section>

      {/* Featured Exams Showcase */}
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-sky-700 tracking-wider uppercase block">
              LUYỆN TẬP TRẮC NGHIỆM
            </span>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 font-heading">
              Bài Kiểm Tra Tiêu Biểu Bấm Giờ
            </h2>
          </div>
          <button
            onClick={() => onSelectTab('exams')}
            className="text-xs font-semibold text-sky-700 hover:text-sky-800 flex items-center gap-1 cursor-pointer"
          >
            <span>Xem tất cả bài thi</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {featuredExams.map((exam) => (
            <div
              key={exam.id}
              className="bg-white rounded-2xl border border-slate-200 shadow-xs hover:shadow-md hover:border-slate-300 transition-all p-6 flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-xs text-slate-500">
                  <span className="font-semibold text-sky-800">{exam.subject}</span>
                  <span aria-hidden="true">·</span>
                  <span>{exam.grade}</span>
                  <span aria-hidden="true">·</span>
                  <span>{exam.difficulty}</span>
                </div>

                <h3 className="text-base font-bold text-slate-900 font-heading line-clamp-2 leading-snug">
                  {exam.title}
                </h3>

                <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                  {exam.description}
                </p>

                <div className="flex items-center gap-4 pt-1 text-xs text-slate-600">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-amber-600" />
                    <strong>{exam.durationMinutes} phút</strong>
                  </span>
                  <span className="flex items-center gap-1">
                    <BookCheck className="w-3.5 h-3.5 text-sky-600" />
                    <strong>{exam.questions.length} câu</strong>
                  </span>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                <span className="text-xs text-slate-400">
                  {exam.attemptsCount.toLocaleString()} lượt làm
                </span>

                <button
                  onClick={() => onStartExam(exam)}
                  className="px-4 py-2 rounded-lg bg-sky-700 hover:bg-sky-800 text-white text-xs font-semibold flex items-center gap-1.5 shadow-2xs transition-colors cursor-pointer"
                >
                  <Play className="w-3.5 h-3.5 fill-white" />
                  <span>Bắt đầu</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Featured Documents Showcase */}
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-sky-700 tracking-wider uppercase block">
              KHO TÀI LIỆU CHỌN LỌC
            </span>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 font-heading">
              Tài Liệu Ôn Thi &amp; Sổ Tay Công Thức
            </h2>
          </div>
          <button
            onClick={() => onSelectTab('documents')}
            className="text-xs font-semibold text-sky-700 hover:text-sky-800 flex items-center gap-1 cursor-pointer"
          >
            <span>Khám phá kho tài liệu</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {featuredDocs.map((doc) => (
            <div
              key={doc.id}
              onClick={() => onSelectDocument(doc)}
              className="group bg-white rounded-2xl border border-slate-200 shadow-xs hover:shadow-md hover:border-slate-300 transition-all p-5 flex flex-col justify-between space-y-4 cursor-pointer"
            >
              <div className="space-y-2.5">
                <div className="flex items-center gap-2 text-xs text-slate-500">
                  <span className="font-semibold text-sky-800">{doc.subject}</span>
                  <span aria-hidden="true">·</span>
                  <span>{doc.grade}</span>
                  <span aria-hidden="true">·</span>
                  <span className="uppercase font-mono text-[11px]">{doc.fileType}</span>
                </div>

                <h3 className="text-base font-bold text-slate-900 group-hover:text-sky-700 transition-colors line-clamp-2 leading-snug font-heading">
                  {doc.title}
                </h3>

                <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                  {doc.description}
                </p>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                <span>{doc.pageCount} trang · {doc.fileSize}</span>
                <span className="text-sky-700 font-semibold group-hover:translate-x-0.5 transition-transform flex items-center gap-1">
                  Đọc ngay <ArrowRight className="w-3 h-3" />
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

    </div>
  );
};
