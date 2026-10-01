export type Subject = 
  | 'Tất cả môn'
  | 'Toán học'
  | 'Vật lý'
  | 'Hóa học'
  | 'Sinh học'
  | 'Tiếng Anh'
  | 'Ngữ văn'
  | 'Lịch sử'
  | 'Tin học';

export type GradeLevel = 
  | 'Tất cả lớp'
  | 'Lớp 10'
  | 'Lớp 11'
  | 'Lớp 12'
  | 'Đại học';

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  grade: string;
  school?: string;
  role: 'student' | 'teacher';
  savedDocuments: string[]; // document IDs
  createdAt: string;
}

export interface DocumentItem {
  id: string;
  title: string;
  description: string;
  subject: Subject;
  grade: GradeLevel;
  fileType: 'pdf' | 'docx' | 'direct';
  fileSize: string;
  pageCount: number;
  author: string;
  views: number;
  downloads: number;
  publishedDate: string;
  readTimeMinutes: number;
  coverImage?: string;
  directContent: {
    summary: string;
    sections: {
      title: string;
      content: string;
      formulasOrNotes?: string[];
    }[];
    importantTakeaways: string[];
  };
}

export type ChoiceKey = 'A' | 'B' | 'C' | 'D';

export interface QuestionOption {
  key: ChoiceKey;
  label: string;
}

export interface Question {
  id: number;
  text: string;
  passage?: string;
  options: QuestionOption[];
  correctAnswer: ChoiceKey;
  explanation: string;
  topic?: string;
}

export interface Exam {
  id: string;
  title: string;
  description: string;
  subject: Subject;
  grade: GradeLevel;
  durationMinutes: number; // e.g. 30
  difficulty: 'Cơ bản' | 'Khá' | 'Nâng cao' | 'Thi thử THPT';
  questions: Question[];
  author: string;
  attemptsCount: number;
  averageScore?: number;
}

export interface ExamResult {
  id: string;
  examId: string;
  examTitle: string;
  subject: Subject;
  grade: GradeLevel;
  userId: string;
  userName: string;
  score: number; // Scale 10
  scorePercentage: number;
  totalQuestions: number;
  correctCount: number;
  incorrectCount: number;
  unansweredCount: number;
  timeSpentSeconds: number;
  submittedAt: string;
  userAnswers: Record<number, ChoiceKey>; // questionId -> option key
  questions: Question[];
}
