"use client";

import { useReducer, useCallback, useEffect } from "react";
import { useMutation } from "@tanstack/react-query";
import { fetchQuizDetails } from "@/lib/api";
import { useQuizTimer } from "@/hooks/useQuizTimer";
import SubjectSelector from "@/components/SubjectSelector";
import QuizQuestion from "@/components/QuizQuestion";
import QuizSummary from "@/components/QuizSummary";
import type {
  Subject,
  QuestionCount,
  QuizAttemptRecord,
  QuizQuestion as QuizQuestionType,
  AnswerState,
} from "@/types/quiz";

// ─── State ────────────────────────────────────────────────────────────────────

type Phase = "setup" | "loading" | "quiz" | "summary";

interface State {
  phase: Phase;
  selectedSubject: Subject | null;
  selectedCount: QuestionCount | null;
  config: { subject: Subject; numberOfQuestions: QuestionCount } | null;
  questions: QuizQuestionType[];
  currentIndex: number;
  selectedOptionId: string | null;
  answerState: AnswerState;
  currentQuestionIncorrect: number;
  shakeKey: number;
  attemptRecords: QuizAttemptRecord[];
  score: number;
  totalIncorrectAttempts: number;
}

const initialState: State = {
  phase: "setup",
  selectedSubject: null,
  selectedCount: null,
  config: null,
  questions: [],
  currentIndex: 0,
  selectedOptionId: null,
  answerState: "unanswered",
  currentQuestionIncorrect: 0,
  shakeKey: 0,
  attemptRecords: [],
  score: 0,
  totalIncorrectAttempts: 0,
};

// ─── Actions ──────────────────────────────────────────────────────────────────

type Action =
  | { type: "SET_SUBJECT"; payload: Subject }
  | { type: "SET_COUNT"; payload: QuestionCount }
  | { type: "START_LOADING" }
  | { type: "LOAD_QUESTIONS"; payload: QuizQuestionType[] }
  | { type: "LOAD_ERROR" }
  | { type: "SELECT_OPTION"; payload: string }
  | { type: "ADVANCE"; payload: { timeElapsed: number } }
  | { type: "REATTEMPT" }
  | { type: "NEW_QUIZ" };

// ─── Reducer ──────────────────────────────────────────────────────────────────

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "SET_SUBJECT":
      return { ...state, selectedSubject: action.payload };
    case "SET_COUNT":
      return { ...state, selectedCount: action.payload };
    case "START_LOADING":
      return { ...state, phase: "loading" };
    case "LOAD_QUESTIONS":
      return {
        ...state,
        phase: "quiz",
        questions: action.payload,
        currentIndex: 0,
        selectedOptionId: null,
        answerState: "unanswered",
        currentQuestionIncorrect: 0,
        shakeKey: 0,
        attemptRecords: [],
        score: 0,
        totalIncorrectAttempts: 0,
        config: {
          subject: state.selectedSubject!,
          numberOfQuestions: state.selectedCount!,
        },
      };
    case "LOAD_ERROR":
      return { ...state, phase: "setup" };
    case "SELECT_OPTION": {
      const current = state.questions[state.currentIndex];
      const isCorrect = action.payload === current.correctOptionId;
      return {
        ...state,
        selectedOptionId: action.payload,
        answerState: isCorrect ? "correct" : "incorrect",
        currentQuestionIncorrect: isCorrect
          ? state.currentQuestionIncorrect
          : state.currentQuestionIncorrect + 1,
        totalIncorrectAttempts: isCorrect
          ? state.totalIncorrectAttempts
          : state.totalIncorrectAttempts + 1,
        shakeKey: isCorrect ? state.shakeKey : state.shakeKey + 1,
      };
    }
    case "ADVANCE": {
      const record: QuizAttemptRecord = {
        questionId: state.questions[state.currentIndex].questionId,
        incorrectAttempts: state.currentQuestionIncorrect,
        timeElapsed: action.payload.timeElapsed,
      };
      const newRecords = [...state.attemptRecords, record];
      const newScore = state.score + 1;
      const isLast = state.currentIndex === state.questions.length - 1;
      if (isLast) {
        return { ...state, phase: "summary", score: newScore, attemptRecords: newRecords };
      }
      return {
        ...state,
        currentIndex: state.currentIndex + 1,
        selectedOptionId: null,
        answerState: "unanswered",
        currentQuestionIncorrect: 0,
        score: newScore,
        attemptRecords: newRecords,
      };
    }
    case "REATTEMPT":
      return {
        ...state,
        phase: "quiz",
        currentIndex: 0,
        selectedOptionId: null,
        answerState: "unanswered",
        currentQuestionIncorrect: 0,
        shakeKey: 0,
        attemptRecords: [],
        score: 0,
        totalIncorrectAttempts: 0,
      };
    case "NEW_QUIZ":
      return {
        ...initialState,
        selectedSubject: state.config?.subject ?? null,
        selectedCount: state.config?.numberOfQuestions ?? null,
      };
    default:
      return state;
  }
}

// ─── Page Component ───────────────────────────────────────────────────────────

export default function QuizPage() {
  const [state, dispatch] = useReducer(reducer, initialState);
  const timer = useQuizTimer();

  const mutation = useMutation({
    mutationFn: fetchQuizDetails,
    onSuccess: (data) => {
      const questions = data?.data?.questions;
      if (questions?.length) {
        dispatch({ type: "LOAD_QUESTIONS", payload: questions });
      } else {
        dispatch({ type: "LOAD_ERROR" });
        alert("No questions returned. Please try again.");
      }
    },
    onError: (err: unknown) => {
      dispatch({ type: "LOAD_ERROR" });
      console.error("Quiz fetch error:", err);
      alert("Failed to fetch questions. Please check your connection.");
    },
  });

  useEffect(() => {
    if (state.phase === "quiz") {
      timer.start();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.phase, state.currentIndex]);

  const handleStart = useCallback(() => {
    if (!state.selectedSubject || !state.selectedCount) return;
    dispatch({ type: "START_LOADING" });
    mutation.mutate({
      examSubjectName: state.selectedSubject,
      numberOfQuestions: state.selectedCount,
    });
  }, [state.selectedSubject, state.selectedCount, mutation]);

  const handleSelectOption = useCallback(
    (optionId: string) => {
      if (state.answerState === "correct") return;
      dispatch({ type: "SELECT_OPTION", payload: optionId });
    },
    [state.answerState]
  );

  const handleNext = useCallback(() => {
    const elapsed = timer.stop();
    dispatch({ type: "ADVANCE", payload: { timeElapsed: elapsed } });
  }, [timer]);

  const currentQuestion = state.questions[state.currentIndex] ?? null;

  return (
    <main className="min-h-screen bg-surface-0 text-white font-body">
      {/* Ambient background glows */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
        <div className="absolute -top-40 -right-40 w-[500px] h-[500px] rounded-full bg-brand-700/[0.08] blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-[500px] h-[500px] rounded-full bg-violet-700/[0.08] blur-3xl" />
      </div>

      {/* Sticky Navbar */}
      <header className="relative z-10 border-b border-surface-4/60 bg-surface-0/80 backdrop-blur-sm sticky top-0">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-brand-600 flex items-center justify-center shadow-md shadow-brand-500/30">
              <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            </div>
            <span className="font-display font-bold text-white tracking-tight">edzy</span>
            <span className="text-slate-600 text-sm">/</span>
            <span className="text-slate-500 text-sm">quiz</span>
          </div>

          {state.phase === "quiz" && (
            <div className="flex items-center gap-2 text-xs font-mono text-slate-500">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Live
            </div>
          )}
          {state.phase === "summary" && (
            <button
              onClick={() => dispatch({ type: "NEW_QUIZ" })}
              className="text-xs font-mono text-brand-400 hover:text-brand-300 transition-colors"
            >
              ← New Quiz
            </button>
          )}
        </div>
      </header>

      {/* Main Content */}
      <div className="relative z-10 max-w-3xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        {(state.phase === "setup" || state.phase === "loading") && (
          <SubjectSelector
            selectedSubject={state.selectedSubject}
            selectedCount={state.selectedCount}
            onSubjectChange={(s) => dispatch({ type: "SET_SUBJECT", payload: s })}
            onCountChange={(c) => dispatch({ type: "SET_COUNT", payload: c })}
            onStart={handleStart}
            isLoading={state.phase === "loading" || mutation.isPending}
          />
        )}

        {state.phase === "quiz" && currentQuestion && (
          <QuizQuestion
            question={currentQuestion}
            questionNumber={state.currentIndex + 1}
            totalQuestions={state.questions.length}
            selectedOptionId={state.selectedOptionId}
            answerState={state.answerState}
            shakeKey={state.shakeKey}
            elapsed={timer.elapsed}
            subject={state.config?.subject ?? ""}
            onSelectOption={handleSelectOption}
            onNext={handleNext}
          />
        )}

        {state.phase === "summary" && (
          <QuizSummary
            score={state.score}
            totalQuestions={state.questions.length}
            totalIncorrectAttempts={state.totalIncorrectAttempts}
            attemptRecords={state.attemptRecords}
            questions={state.questions}
            subject={state.config!.subject}
            onReattempt={() => dispatch({ type: "REATTEMPT" })}
            onNewQuiz={() => dispatch({ type: "NEW_QUIZ" })}
          />
        )}
      </div>
    </main>
  );
}
