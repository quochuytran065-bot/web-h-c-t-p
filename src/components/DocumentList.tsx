import React, { useState, useMemo } from 'react';
import { DocumentItem, Subject, GradeLevel } from '../types';
import { useAuth } from '../context/AuthContext';
import { 
  Search, 
  Filter, 
  FileText, 
  Eye, 
  Bookmark, 
  Download, 
  BookOpen, 
  Sparkles,
  ArrowUpDown
} from 'lucide-react';

interface DocumentListProps {
  documents: DocumentItem[];
  onSelectDocument: (doc: DocumentItem) => void;
}

const SUBJECT_OPTIONS: Subject[] = [
  'Tất cả môn',
  'Toán học',
  'Tiếng Anh',
  'Vật lý',
  'Hóa học',
  'Ngữ văn',
  'Lịch sử'
];

const GRADE_OPTIONS: GradeLevel[] = [
  'Tất cả lớp',
  'Lớp 10',
  'Lớp 11',
  'Lớp 12',
  'Đại học'
];

export const DocumentList: React.FC<DocumentListProps> = ({ documents, onSelectDocument }) => {
  const { isDocumentSaved, toggleSaveDocument } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSubject, setSelectedSubject] = useState<Subject>('Tất cả môn');
  const [selectedGrade, setSelectedGrade] = useState<GradeLevel>('Tất cả lớp');
  const [selectedFileType, setSelectedFileType] = useState<'all' | 'pdf' | 'docx' | 'direct'>('all');
  const [sortBy, setSortBy] = useState<'views' | 'newest'>('views');

  const filteredDocuments = useMemo(() => {
    return documents.filter(doc => {
      // Search
      const matchesSearch = 
        doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        doc.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        doc.author.toLowerCase().includes(searchQuery.toLowerCase());
      
      // Subject
      const matchesSubject = selectedSubject === 'Tất cả môn' || doc.subject === selectedSubject;
      
      // Grade
      const matchesGrade = selectedGrade === 'Tất cả lớp' || doc.grade === selectedGrade;

      // File type
      const matchesFileType = selectedFileType === 'all' || doc.fileType === selectedFileType;

      return matchesSearch && matchesSubject && matchesGrade && matchesFileType;
    }).sort((a, b) => {
      if (sortBy === 'views') return b.views - a.views;
      return b.publishedDate.localeCompare(a.publishedDate);
    });
  }, [documents, searchQuery, selectedSubject, selectedGrade, selectedFileType, sortBy]);

  const resetFilters = () => {
    setSearchQuery('');
    setSelectedSubject('Tất cả môn');
    setSelectedGrade('Tất cả lớp');
    setSelectedFileType('all');
  };

  return (
    <div className="space-y-6">
      
      {/* Search & Main Filter Row */}
      <div className="bg-white rounded-xl p-4 sm:p-5 border border-slate-200 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Search box */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Tìm kiếm tài liệu, chuyên đề, công thức..."
              className="w-full pl-10 pr-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-600 focus:bg-white transition-all"
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                Xóa
              </button>
            )}
          </div>

          {/* Quick grade selector */}
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

        {/* Subject pills / segmented tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
          <span className="text-slate-400 font-medium mr-1 shrink-0 flex items-center gap-1">
            <Filter className="w-3.5 h-3.5" /> Môn học:
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

        {/* Sub-bar: Format filter & Counter */}
        <div className="flex items-center justify-between text-xs text-slate-500 pt-2 border-t border-slate-100">
          <div className="flex items-center gap-3">
            <span>Hiển thị <strong>{filteredDocuments.length}</strong> tài liệu học tập</span>
            <div className="hidden sm:flex items-center gap-2">
              <span className="text-slate-300">|</span>
              <button 
                onClick={() => setSelectedFileType('all')}
                className={`hover:text-slate-900 cursor-pointer ${selectedFileType === 'all' ? 'font-semibold text-slate-900' : ''}`}
              >
                Tất cả định dạng
              </button>
              <button 
                onClick={() => setSelectedFileType('pdf')}
                className={`hover:text-slate-900 cursor-pointer ${selectedFileType === 'pdf' ? 'font-semibold text-slate-900' : ''}`}
              >
                PDF
              </button>
              <button 
                onClick={() => setSelectedFileType('docx')}
                className={`hover:text-slate-900 cursor-pointer ${selectedFileType === 'docx' ? 'font-semibold text-slate-900' : ''}`}
              >
                Word (.doc)
              </button>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'views' | 'newest')}
              className="bg-transparent text-xs text-slate-700 font-medium focus:outline-none cursor-pointer"
            >
              <option value="views">Lượt xem nhiều nhất</option>
              <option value="newest">Mới cập nhật</option>
            </select>
          </div>
        </div>
      </div>

      {/* Documents Grid */}
      {filteredDocuments.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredDocuments.map((doc) => {
            const isSaved = isDocumentSaved(doc.id);
            return (
              <div
                key={doc.id}
                className="group bg-white rounded-xl border border-slate-200/90 shadow-xs hover:shadow-md hover:border-slate-300 transition-all flex flex-col justify-between overflow-hidden"
              >
                {/* Visual Thumbnail */}
                <div 
                  onClick={() => onSelectDocument(doc)}
                  className="relative h-44 bg-slate-100 overflow-hidden cursor-pointer"
                >
                  <img
                    src={doc.coverImage || '/src/assets/images/hero_digital_learning_1790863793186.jpg'}
                    alt={doc.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent flex items-end p-4">
                    <div className="text-white text-xs">
                      <span className="font-semibold">{doc.subject}</span>
                      <span className="mx-1.5 opacity-60">·</span>
                      <span className="opacity-90">{doc.grade}</span>
                      <span className="mx-1.5 opacity-60">·</span>
                      <span className="uppercase font-mono text-[11px] opacity-90">{doc.fileType}</span>
                    </div>
                  </div>
                </div>

                {/* Card Body */}
                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  <div>
                    {/* Unboxed clean metadata (Zero-pill discipline) */}
                    <div className="flex items-center gap-2 text-xs text-slate-500 mb-2">
                      <span>{doc.pageCount} trang</span>
                      <span aria-hidden="true">·</span>
                      <span>{doc.fileSize}</span>
                      <span aria-hidden="true">·</span>
                      <span>~{doc.readTimeMinutes} phút đọc</span>
                    </div>

                    <h3 
                      onClick={() => onSelectDocument(doc)}
                      className="text-base font-bold text-slate-900 group-hover:text-sky-700 transition-colors cursor-pointer line-clamp-2 leading-snug font-heading"
                    >
                      {doc.title}
                    </h3>

                    <p className="text-xs text-slate-600 line-clamp-2 mt-2 leading-relaxed">
                      {doc.description}
                    </p>
                  </div>

                  {/* Card Footer Actions */}
                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                    <div className="flex items-center gap-2 text-xs text-slate-500">
                      <Eye className="w-3.5 h-3.5" />
                      <span>{doc.views.toLocaleString()}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleSaveDocument(doc.id);
                        }}
                        className={`p-1.5 rounded-lg border transition-colors cursor-pointer ${
                          isSaved 
                            ? 'bg-amber-50 border-amber-300 text-amber-700' 
                            : 'border-slate-200 text-slate-400 hover:text-slate-600 hover:bg-slate-50'
                        }`}
                        title={isSaved ? 'Bỏ lưu' : 'Lưu tài liệu'}
                      >
                        <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-amber-600 text-amber-600' : ''}`} />
                      </button>

                      <button
                        onClick={() => onSelectDocument(doc)}
                        className="px-3.5 py-1.5 rounded-lg bg-sky-700 hover:bg-sky-800 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer shadow-2xs"
                      >
                        <BookOpen className="w-3.5 h-3.5" />
                        <span>Xem tài liệu</span>
                      </button>
                    </div>
                  </div>

                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* Empty State */
        <div className="text-center py-16 bg-white rounded-2xl border border-slate-200 p-8 space-y-3">
          <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
            <Search className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-slate-900 font-heading">
            Không tìm thấy tài liệu phù hợp
          </h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            Vui lòng thử tìm kiếm bằng từ khóa khác hoặc điều chỉnh lại bộ lọc môn học và khối lớp.
          </p>
          <button
            onClick={resetFilters}
            className="mt-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg transition-colors cursor-pointer"
          >
            Đặt lại tất cả bộ lọc
          </button>
        </div>
      )}

    </div>
  );
};
