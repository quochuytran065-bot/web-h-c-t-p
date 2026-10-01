import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { 
  BookOpen, 
  Clock, 
  User as UserIcon, 
  LogOut, 
  Menu, 
  X, 
  ChevronDown
} from 'lucide-react';

interface NavbarProps {
  activeTab: 'home' | 'documents' | 'exams' | 'history';
  setActiveTab: (tab: 'home' | 'documents' | 'exams' | 'history') => void;
  onOpenHistory: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ activeTab, setActiveTab, onOpenHistory }) => {
  const { currentUser, logout, openAuthModal, loginAsDemo } = useAuth();
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Zone 1: Single text element wordmark */}
          <button 
            onClick={() => setActiveTab('home')}
            className="flex items-center gap-2.5 text-left focus:outline-none group cursor-pointer"
          >
            <div className="w-9 h-9 rounded-lg bg-sky-700 text-white flex items-center justify-center font-bold text-lg shadow-sm group-hover:bg-sky-800 transition-colors">
              E
            </div>
            <div className="leading-tight">
              <span className="text-xl font-bold tracking-tight text-slate-900 font-heading">
                EduViet
              </span>
            </div>
          </button>

          {/* Zone 2: 4 clean text navigation links */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600">
            <button
              onClick={() => setActiveTab('home')}
              className={`transition-colors hover:text-sky-700 py-1 border-b-2 cursor-pointer ${
                activeTab === 'home'
                  ? 'border-sky-600 text-sky-700 font-semibold'
                  : 'border-transparent text-slate-600'
              }`}
            >
              Trang chủ
            </button>
            <button
              onClick={() => setActiveTab('documents')}
              className={`transition-colors hover:text-sky-700 py-1 border-b-2 cursor-pointer ${
                activeTab === 'documents'
                  ? 'border-sky-600 text-sky-700 font-semibold'
                  : 'border-transparent text-slate-600'
              }`}
            >
              Tài liệu học tập
            </button>
            <button
              onClick={() => setActiveTab('exams')}
              className={`transition-colors hover:text-sky-700 py-1 border-b-2 cursor-pointer ${
                activeTab === 'exams'
                  ? 'border-sky-600 text-sky-700 font-semibold'
                  : 'border-transparent text-slate-600'
              }`}
            >
              Bài kiểm tra trắc nghiệm
            </button>
            <button
              onClick={() => {
                if (currentUser) {
                  onOpenHistory();
                } else {
                  openAuthModal();
                }
              }}
              className={`transition-colors hover:text-sky-700 py-1 border-b-2 cursor-pointer ${
                activeTab === 'history'
                  ? 'border-sky-600 text-sky-700 font-semibold'
                  : 'border-transparent text-slate-600'
              }`}
            >
              Lịch sử kết quả
            </button>
          </nav>

          {/* Zone 3: 1-2 primary user actions */}
          <div className="hidden md:flex items-center gap-3">
            {currentUser ? (
              <div className="relative">
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center gap-2.5 px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors text-slate-800 focus:outline-none cursor-pointer"
                >
                  <div className="w-7 h-7 rounded-full bg-sky-100 text-sky-800 font-semibold text-xs flex items-center justify-center border border-sky-200">
                    {currentUser.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="text-left text-xs leading-none">
                    <p className="font-semibold text-slate-900 truncate max-w-[130px]">
                      {currentUser.name}
                    </p>
                    <span className="text-[11px] text-slate-500">{currentUser.grade}</span>
                  </div>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400 ml-1" />
                </button>

                {isUserMenuOpen && (
                  <div 
                    className="absolute right-0 mt-2 w-60 bg-white rounded-xl shadow-lg border border-slate-200 py-2 z-50 animate-in fade-in zoom-in-95 duration-100"
                    onMouseLeave={() => setIsUserMenuOpen(false)}
                  >
                    <div className="px-4 py-2 border-b border-slate-100">
                      <p className="text-xs text-slate-500 font-medium">Tài khoản học sinh</p>
                      <p className="text-sm font-semibold text-slate-900 truncate">{currentUser.name}</p>
                      <p className="text-xs text-slate-500 truncate">{currentUser.email}</p>
                      {currentUser.school && (
                        <p className="text-xs text-slate-400 mt-0.5 truncate">{currentUser.school}</p>
                      )}
                    </div>

                    <div className="py-1">
                      <button
                        onClick={() => {
                          setIsUserMenuOpen(false);
                          onOpenHistory();
                        }}
                        className="w-full px-4 py-2 text-left text-xs font-medium text-slate-700 hover:bg-slate-50 flex items-center gap-2 cursor-pointer"
                      >
                        <Clock className="w-4 h-4 text-slate-400" />
                        Lịch sử bài làm &amp; Điểm số
                      </button>

                      <button
                        onClick={() => {
                          setIsUserMenuOpen(false);
                          setActiveTab('documents');
                        }}
                        className="w-full px-4 py-2 text-left text-xs font-medium text-slate-700 hover:bg-slate-50 flex items-center gap-2 cursor-pointer"
                      >
                        <BookOpen className="w-4 h-4 text-slate-400" />
                        Tài liệu đã lưu ({currentUser.savedDocuments?.length || 0})
                      </button>
                    </div>

                    <div className="border-t border-slate-100 pt-1">
                      <div className="px-4 py-1.5 text-[11px] text-slate-400 font-medium">
                        Đổi tài khoản mẫu:
                      </div>
                      <div className="px-2 flex gap-1 mb-1">
                        <button
                          onClick={() => {
                            loginAsDemo(0);
                            setIsUserMenuOpen(false);
                          }}
                          className="flex-1 text-[11px] py-1 px-2 rounded bg-slate-100 hover:bg-sky-50 hover:text-sky-700 text-slate-600 text-center font-medium cursor-pointer"
                        >
                          Lớp 12
                        </button>
                        <button
                          onClick={() => {
                            loginAsDemo(1);
                            setIsUserMenuOpen(false);
                          }}
                          className="flex-1 text-[11px] py-1 px-2 rounded bg-slate-100 hover:bg-sky-50 hover:text-sky-700 text-slate-600 text-center font-medium cursor-pointer"
                        >
                          Lớp 11
                        </button>
                      </div>

                      <button
                        onClick={() => {
                          logout();
                          setIsUserMenuOpen(false);
                        }}
                        className="w-full px-4 py-2 text-left text-xs text-rose-600 hover:bg-rose-50 flex items-center gap-2 cursor-pointer font-medium"
                      >
                        <LogOut className="w-4 h-4 text-rose-500" />
                        Đăng xuất
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => loginAsDemo(0)}
                  className="px-3 py-2 text-xs font-medium text-slate-600 hover:text-slate-900 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors whitespace-nowrap cursor-pointer"
                >
                  Dùng thử nhanh
                </button>
                <button
                  onClick={openAuthModal}
                  className="px-4 py-2 text-xs font-semibold text-white bg-sky-700 rounded-lg hover:bg-sky-800 transition-colors whitespace-nowrap cursor-pointer shadow-sm"
                >
                  Đăng nhập / Đăng ký
                </button>
              </div>
            )}
          </div>

          {/* Mobile hamburger menu toggle */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 focus:outline-none"
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile nav drawer */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-5 space-y-2">
          <button
            onClick={() => {
              setActiveTab('home');
              setIsMobileMenuOpen(false);
            }}
            className={`block w-full text-left px-3 py-2 rounded-md text-sm font-medium ${
              activeTab === 'home' ? 'bg-sky-50 text-sky-800 font-semibold' : 'text-slate-700'
            }`}
          >
            Trang chủ
          </button>
          <button
            onClick={() => {
              setActiveTab('documents');
              setIsMobileMenuOpen(false);
            }}
            className={`block w-full text-left px-3 py-2 rounded-md text-sm font-medium ${
              activeTab === 'documents' ? 'bg-sky-50 text-sky-800 font-semibold' : 'text-slate-700'
            }`}
          >
            Tài liệu học tập
          </button>
          <button
            onClick={() => {
              setActiveTab('exams');
              setIsMobileMenuOpen(false);
            }}
            className={`block w-full text-left px-3 py-2 rounded-md text-sm font-medium ${
              activeTab === 'exams' ? 'bg-sky-50 text-sky-800 font-semibold' : 'text-slate-700'
            }`}
          >
            Bài kiểm tra trắc nghiệm
          </button>
          <button
            onClick={() => {
              if (currentUser) {
                onOpenHistory();
              } else {
                openAuthModal();
              }
              setIsMobileMenuOpen(false);
            }}
            className="block w-full text-left px-3 py-2 rounded-md text-sm font-medium text-slate-700"
          >
            Lịch sử kết quả
          </button>

          <div className="pt-3 border-t border-slate-200 mt-2">
            {currentUser ? (
              <div className="space-y-2">
                <div className="flex items-center gap-3 px-3 py-2 bg-slate-50 rounded-lg">
                  <div className="w-8 h-8 rounded-full bg-sky-100 text-sky-800 font-semibold text-xs flex items-center justify-center">
                    {currentUser.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-900">{currentUser.name}</p>
                    <p className="text-xs text-slate-500">{currentUser.grade}</p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    logout();
                    setIsMobileMenuOpen(false);
                  }}
                  className="w-full text-left px-3 py-2 text-sm text-rose-600 font-medium"
                >
                  Đăng xuất
                </button>
              </div>
            ) : (
              <div className="space-y-2">
                <button
                  onClick={() => {
                    openAuthModal();
                    setIsMobileMenuOpen(false);
                  }}
                  className="w-full py-2 px-4 text-center text-sm font-semibold text-white bg-sky-700 rounded-lg"
                >
                  Đăng nhập / Đăng ký
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
