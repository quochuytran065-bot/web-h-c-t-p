import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { X, CheckCircle, GraduationCap } from 'lucide-react';
import { DEMO_USERS } from '../data/mockData';

export const AuthModal: React.FC = () => {
  const { isAuthModalOpen, closeAuthModal, login, register, loginAsDemo } = useAuth();
  const [tab, setTab] = useState<'login' | 'register'>('login');

  // Login form state
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // Register form state
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regGrade, setRegGrade] = useState('Lớp 12');
  const [regSchool, setRegSchool] = useState('');

  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  if (!isAuthModalOpen) return null;

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    if (!loginEmail.trim()) {
      setErrorMsg('Vui lòng nhập địa chỉ email');
      return;
    }
    const success = login(loginEmail);
    if (success) {
      setSuccessMsg('Đăng nhập thành công!');
      setTimeout(() => {
        closeAuthModal();
        setSuccessMsg('');
      }, 500);
    }
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    if (!regName.trim()) {
      setErrorMsg('Vui lòng nhập họ và tên của bạn');
      return;
    }
    if (!regEmail.trim()) {
      setErrorMsg('Vui lòng nhập email');
      return;
    }
    const success = register(regName, regEmail, regGrade, regSchool);
    if (success) {
      setSuccessMsg('Đăng ký tài khoản thành công!');
      setTimeout(() => {
        closeAuthModal();
        setSuccessMsg('');
      }, 500);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div 
        className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150"
        role="dialog"
        aria-modal="true"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 pt-5 pb-4 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-sky-100 text-sky-800 flex items-center justify-center font-bold">
              <GraduationCap className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 font-heading">
                {tab === 'login' ? 'Đăng nhập tài khoản' : 'Đăng ký tài khoản mới'}
              </h2>
              <p className="text-xs text-slate-500">Cổng học tập &amp; thi trắc nghiệm EduViet</p>
            </div>
          </div>
          <button
            onClick={closeAuthModal}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
            aria-label="Đóng"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab switch */}
        <div className="px-6 pt-4">
          <div className="grid grid-cols-2 p-1 bg-slate-100 rounded-lg text-xs font-semibold">
            <button
              onClick={() => {
                setTab('login');
                setErrorMsg('');
              }}
              className={`py-2 rounded-md transition-all cursor-pointer ${
                tab === 'login'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Đăng nhập
            </button>
            <button
              onClick={() => {
                setTab('register');
                setErrorMsg('');
              }}
              className={`py-2 rounded-md transition-all cursor-pointer ${
                tab === 'register'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Đăng ký
            </button>
          </div>
        </div>

        {/* Quick Demo Login Preset Buttons */}
        <div className="px-6 pt-4">
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 text-xs">
            <span className="text-slate-600 font-medium block mb-2">Đăng nhập nhanh với tài khoản mẫu:</span>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => {
                  loginAsDemo(0);
                  closeAuthModal();
                }}
                className="py-1.5 px-2.5 rounded-lg bg-white border border-slate-200 hover:border-sky-300 hover:bg-sky-50/50 text-slate-800 text-left transition-colors cursor-pointer"
              >
                <p className="font-semibold text-slate-900 truncate">Văn Minh</p>
                <p className="text-[11px] text-slate-500">Lớp 12 · Chu Văn An</p>
              </button>
              <button
                type="button"
                onClick={() => {
                  loginAsDemo(1);
                  closeAuthModal();
                }}
                className="py-1.5 px-2.5 rounded-lg bg-white border border-slate-200 hover:border-sky-300 hover:bg-sky-50/50 text-slate-800 text-left transition-colors cursor-pointer"
              >
                <p className="font-semibold text-slate-900 truncate">Thu Hà</p>
                <p className="text-[11px] text-slate-500">Lớp 11 · Amsterdam</p>
              </button>
            </div>
          </div>
        </div>

        {/* Form Body */}
        <div className="p-6">
          {errorMsg && (
            <div className="mb-4 p-2.5 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium">
              {errorMsg}
            </div>
          )}
          {successMsg && (
            <div className="mb-4 p-2.5 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-medium flex items-center gap-1.5">
              <CheckCircle className="w-4 h-4" />
              {successMsg}
            </div>
          )}

          {tab === 'login' ? (
            <form onSubmit={handleLoginSubmit} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Email học sinh / người dùng
                </label>
                <input
                  type="email"
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  placeholder="nhap.email@example.com"
                  className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-600 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-semibold text-slate-700">Mật khẩu</label>
                  <span className="text-[11px] text-slate-400">Mặc định: bất kỳ</span>
                </div>
                <input
                  type="password"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-600 focus:border-transparent"
                />
              </div>

              <button
                type="submit"
                className="w-full mt-2 py-2.5 px-4 bg-sky-700 hover:bg-sky-800 text-white font-semibold text-sm rounded-lg transition-colors shadow-sm cursor-pointer"
              >
                Đăng nhập
              </button>
            </form>
          ) : (
            <form onSubmit={handleRegisterSubmit} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Họ và tên
                </label>
                <input
                  type="text"
                  value={regName}
                  onChange={(e) => setRegName(e.target.value)}
                  placeholder="Ví dụ: Hoàng Tuấn Kiệt"
                  className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-600 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  value={regEmail}
                  onChange={(e) => setRegEmail(e.target.value)}
                  placeholder="email@example.com"
                  className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-600 focus:border-transparent"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Khối lớp
                  </label>
                  <select
                    value={regGrade}
                    onChange={(e) => setRegGrade(e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-sky-600"
                  >
                    <option value="Lớp 10">Lớp 10</option>
                    <option value="Lớp 11">Lớp 11</option>
                    <option value="Lớp 12">Lớp 12</option>
                    <option value="Đại học">Đại học / Tự do</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Trường học (tùy chọn)
                  </label>
                  <input
                    type="text"
                    value={regSchool}
                    onChange={(e) => setRegSchool(e.target.value)}
                    placeholder="THPT..."
                    className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-600"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Mật khẩu
                </label>
                <input
                  type="password"
                  value={regPassword}
                  onChange={(e) => setRegPassword(e.target.value)}
                  placeholder="Tối thiểu 6 ký tự"
                  className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-600 focus:border-transparent"
                />
              </div>

              <button
                type="submit"
                className="w-full mt-2 py-2.5 px-4 bg-sky-700 hover:bg-sky-800 text-white font-semibold text-sm rounded-lg transition-colors shadow-sm cursor-pointer"
              >
                Tạo tài khoản học tập
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
