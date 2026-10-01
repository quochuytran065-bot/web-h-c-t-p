import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, ExamResult } from '../types';
import { DEMO_USERS } from '../data/mockData';

interface AuthContextType {
  currentUser: User | null;
  examHistory: ExamResult[];
  isAuthModalOpen: boolean;
  login: (email: string) => boolean;
  register: (name: string, email: string, grade: string, school?: string) => boolean;
  logout: () => void;
  loginAsDemo: (demoIndex: number) => void;
  toggleSaveDocument: (docId: string) => void;
  isDocumentSaved: (docId: string) => boolean;
  saveExamResult: (result: ExamResult) => void;
  getResultsForExam: (examId: string) => ExamResult[];
  openAuthModal: () => void;
  closeAuthModal: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const STORAGE_KEY_USER = 'eduviet_current_user_v1';
const STORAGE_KEY_HISTORY = 'eduviet_exam_history_v1';
const STORAGE_KEY_ALL_USERS = 'eduviet_registered_users_v1';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_USER);
      if (saved) return JSON.parse(saved);
      // Default to Minh (Demo student) for seamless immediate out-of-the-box experience
      return DEMO_USERS[0];
    } catch {
      return DEMO_USERS[0];
    }
  });

  const [examHistory, setExamHistory] = useState<ExamResult[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_HISTORY);
      if (saved) return JSON.parse(saved);
      return [];
    } catch {
      return [];
    }
  });

  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  // Sync current user to localStorage
  useEffect(() => {
    try {
      if (currentUser) {
        localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(currentUser));
      } else {
        localStorage.removeItem(STORAGE_KEY_USER);
      }
    } catch (e) {
      console.warn('LocalStorage error:', e);
    }
  }, [currentUser]);

  // Sync exam history to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_HISTORY, JSON.stringify(examHistory));
    } catch (e) {
      console.warn('LocalStorage error:', e);
    }
  }, [examHistory]);

  const login = (email: string): boolean => {
    const trimmed = email.trim().toLowerCase();
    // Check demo users
    const matchedDemo = DEMO_USERS.find(u => u.email.toLowerCase() === trimmed);
    if (matchedDemo) {
      setCurrentUser(matchedDemo);
      return true;
    }
    // Check locally registered users
    try {
      const usersRaw = localStorage.getItem(STORAGE_KEY_ALL_USERS);
      const users: User[] = usersRaw ? JSON.parse(usersRaw) : [];
      const found = users.find(u => u.email.toLowerCase() === trimmed);
      if (found) {
        setCurrentUser(found);
        return true;
      }
    } catch (err) {
      console.error(err);
    }

    // Auto-create account if new email
    const newUser: User = {
      id: 'user-' + Date.now(),
      name: email.split('@')[0],
      email: trimmed,
      grade: 'Lớp 12',
      role: 'student',
      savedDocuments: [],
      createdAt: new Date().toISOString().split('T')[0]
    };
    setCurrentUser(newUser);
    return true;
  };

  const register = (name: string, email: string, grade: string, school?: string): boolean => {
    const trimmed = email.trim().toLowerCase();
    const newUser: User = {
      id: 'user-' + Date.now(),
      name: name.trim() || 'Học sinh',
      email: trimmed,
      grade: grade || 'Lớp 12',
      school: school?.trim() || 'THPT',
      role: 'student',
      savedDocuments: [],
      createdAt: new Date().toISOString().split('T')[0]
    };

    try {
      const usersRaw = localStorage.getItem(STORAGE_KEY_ALL_USERS);
      const users: User[] = usersRaw ? JSON.parse(usersRaw) : [];
      users.push(newUser);
      localStorage.setItem(STORAGE_KEY_ALL_USERS, JSON.stringify(users));
    } catch (e) {
      console.error(e);
    }

    setCurrentUser(newUser);
    return true;
  };

  const logout = () => {
    setCurrentUser(null);
  };

  const loginAsDemo = (index: number) => {
    const demo = DEMO_USERS[index] || DEMO_USERS[0];
    setCurrentUser(demo);
  };

  const toggleSaveDocument = (docId: string) => {
    if (!currentUser) {
      setIsAuthModalOpen(true);
      return;
    }
    const currentSaved = currentUser.savedDocuments || [];
    const exists = currentSaved.includes(docId);
    const updatedDocs = exists
      ? currentSaved.filter(id => id !== docId)
      : [...currentSaved, docId];

    setCurrentUser({
      ...currentUser,
      savedDocuments: updatedDocs
    });
  };

  const isDocumentSaved = (docId: string): boolean => {
    return !!currentUser?.savedDocuments?.includes(docId);
  };

  const saveExamResult = (result: ExamResult) => {
    setExamHistory(prev => [result, ...prev]);
  };

  const getResultsForExam = (examId: string): ExamResult[] => {
    return examHistory.filter(r => r.examId === examId);
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        examHistory,
        isAuthModalOpen,
        login,
        register,
        logout,
        loginAsDemo,
        toggleSaveDocument,
        isDocumentSaved,
        saveExamResult,
        getResultsForExam,
        openAuthModal: () => setIsAuthModalOpen(true),
        closeAuthModal: () => setIsAuthModalOpen(false)
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
