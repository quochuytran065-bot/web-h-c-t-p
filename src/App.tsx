import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Navbar } from './components/Navbar';
import { HomeView } from './components/HomeView';
import { DocumentList } from './components/DocumentList';
import { DocumentViewerModal } from './components/DocumentViewerModal';
import { ExamList } from './components/ExamList';
import { ExamTakingView } from './components/ExamTakingView';
import { ExamResultView } from './components/ExamResultView';
import { UserHistoryModal } from './components/UserHistoryModal';
import { AuthModal } from './components/AuthModal';
import { Footer } from './components/Footer';
import { DocumentItem, Exam, ExamResult } from './types';
import { INITIAL_DOCUMENTS, INITIAL_EXAMS } from './data/mockData';

function MainApp() {
  const { saveExamResult, getResultsForExam } = useAuth();

  // App navigation state
  const [activeTab, setActiveTab] = useState<'home' | 'documents' | 'exams' | 'history'>('home');
  
  // Active document modal
  const [selectedDocument, setSelectedDocument] = useState<DocumentItem | null>(null);

  // Active exam session
  const [activeExam, setActiveExam] = useState<Exam | null>(null);
  
  // Active exam result for review
  const [activeResult, setActiveResult] = useState<ExamResult | null>(null);

  // User history modal state
  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);

  // Documents and Exams dataset
  const [documents] = useState<DocumentItem[]>(INITIAL_DOCUMENTS);
  const [exams] = useState<Exam[]>(INITIAL_EXAMS);

  // Handlers
  const handleStartExam = (exam: Exam) => {
    setActiveExam(exam);
    setActiveResult(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleFinishExam = (result: ExamResult) => {
    saveExamResult(result);
    setActiveResult(result);
    setActiveExam(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCancelExam = () => {
    setActiveExam(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleRetakeExam = () => {
    if (!activeResult) return;
    const examToRetake = exams.find(e => e.id === activeResult.examId);
    if (examToRetake) {
      setActiveResult(null);
      setActiveExam(examToRetake);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleViewPreviousResult = (examId: string) => {
    const results = getResultsForExam(examId);
    if (results.length > 0) {
      setActiveResult(results[0]);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleSelectHistoryResult = (result: ExamResult) => {
    setActiveResult(result);
    setIsHistoryModalOpen(false);
    setActiveExam(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // If user is currently taking an exam, render the full-screen testing view
  if (activeExam) {
    return (
      <ExamTakingView
        exam={activeExam}
        onFinishExam={handleFinishExam}
        onCancelExam={handleCancelExam}
      />
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 selection:bg-sky-100 selection:text-sky-900">
      
      {/* Primary Top Bar */}
      <Navbar
        activeTab={activeResult ? 'exams' : activeTab}
        setActiveTab={(tab) => {
          setActiveResult(null);
          setActiveTab(tab);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onOpenHistory={() => setIsHistoryModalOpen(true)}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 w-full">
        {/* If viewing a specific exam result */}
        {activeResult ? (
          <ExamResultView
            result={activeResult}
            onRetake={handleRetakeExam}
            onBackToList={() => {
              setActiveResult(null);
              setActiveTab('exams');
            }}
            onGoToDocuments={() => {
              setActiveResult(null);
              setActiveTab('documents');
            }}
          />
        ) : (
          <>
            {activeTab === 'home' && (
              <HomeView
                documents={documents}
                exams={exams}
                onSelectTab={setActiveTab}
                onSelectDocument={(doc) => setSelectedDocument(doc)}
                onStartExam={handleStartExam}
              />
            )}

            {activeTab === 'documents' && (
              <div className="space-y-6 pb-12">
                <div className="border-b border-slate-200 pb-4">
                  <h1 className="text-2xl font-bold text-slate-900 font-heading">
                    Kho Tài Liệu Học Tập
                  </h1>
                  <p className="text-xs sm:text-sm text-slate-500 mt-1">
                    Tổng hợp đề cương, sổ tay công thức, bài giảng và tài liệu PDF/Word chọn lọc theo từng môn học và khối lớp.
                  </p>
                </div>

                <DocumentList
                  documents={documents}
                  onSelectDocument={(doc) => setSelectedDocument(doc)}
                />
              </div>
            )}

            {activeTab === 'exams' && (
              <div className="space-y-6 pb-12">
                <ExamList
                  exams={exams}
                  onStartExam={handleStartExam}
                  onViewPreviousResult={handleViewPreviousResult}
                />
              </div>
            )}
          </>
        )}
      </main>

      {/* Modals & Dialogs */}
      <DocumentViewerModal
        document={selectedDocument}
        onClose={() => setSelectedDocument(null)}
      />

      <UserHistoryModal
        isOpen={isHistoryModalOpen}
        onClose={() => setIsHistoryModalOpen(false)}
        onSelectResult={handleSelectHistoryResult}
      />

      <AuthModal />

      {/* Footer */}
      <Footer onSelectTab={(tab) => {
        setActiveResult(null);
        setActiveTab(tab);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }} />

    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <MainApp />
    </AuthProvider>
  );
}
