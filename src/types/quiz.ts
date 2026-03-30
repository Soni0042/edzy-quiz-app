// ─── API Types ────────────────────────────────────────────────────────────────

export interface QuizOption {
  optionId: string;
  optionText: string;
}

export interface QuizQuestion {
  id: string; // ✅ FIXED (was questionId)

  questionText: string;
  options: QuizOption[];
  correctOptionId: string;

  solution?: string; // optional (future use)
}

export interface QuizApiResponse {
  success: boolean;
  data: {
    examSubjectName: string;
    numberOfQuestions: number;
    questions: QuizQuestion[];
  };
  message?: string;
}

// ─── App State Types ──────────────────────────────────────────────────────────

export type Subject =
  | "Class 10 - English"
  | "Class 10 - Mathematics"
  | "Class 10 - Science"
  | "Class 10 - Social Science";

export type QuestionCount = 5 | 10 | 15;

export type AnswerState = "unanswered" | "correct" | "incorrect";

export interface QuizConfig {
  subject: Subject;
  numberOfQuestions: QuestionCount;
}

export interface QuizAttemptRecord {
  questionId: string; // keep this same
  incorrectAttempts: number;
  timeElapsed: number;
}

export interface QuizState {
  phase: "setup" | "loading" | "quiz" | "summary";
  config: QuizConfig | null;
  questions: QuizQuestion[];
  currentIndex: number;
  selectedOptionId: string | null;
  answerState: AnswerState;
  attemptRecords: QuizAttemptRecord[];
  score: number;
  totalIncorrectAttempts: number;
  shakeKey: number;
}

// ─── Component Props ──────────────────────────────────────────────────────────

export interface SubjectCardProps {
  subject: Subject;
  selected: boolean;
  onSelect: (subject: Subject) => void;
}

export interface QuestionCountPickerProps {
  value: QuestionCount | null;
  onChange: (count: QuestionCount) => void;
}

export interface ProgressBarProps {
  current: number;
  total: number;
}

export interface TimerDisplayProps {
  elapsed: number;
}