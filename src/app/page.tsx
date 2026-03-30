"use client";

import { useReducer, useCallback, useEffect } from "react";
import { useMutation } from "@tanstack/react-query";
import { fetchQuizQuestions } from "@/lib/api";
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

// ✅ UPDATED ACTIONS
type Action =
  | { type: "SET_SUBJECT"; payload: Subject }
  | { type: "SET_COUNT"; payload: QuestionCount }
  | { type: "START_LOADING" }
  | { type: "LOAD_QUESTIONS"; payload: QuizQuestionType[] }
  | { type: "LOAD_ERROR" }
  | { type: "SELECT_OPTION"; payload: string }
  | { type: "SUBMIT" } // ✅ NEW
  | { type: "ADVANCE"; payload: { timeElapsed: number } }
  | { type: "REATTEMPT" }
  | { type: "NEW_QUIZ" };

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

    // ✅ UPDATED: NO CHECK HERE
    case "SELECT_OPTION":
      return {
        ...state,
        selectedOptionId: action.payload,
        answerState: "unanswered",
      };

    // ✅ NEW SUBMIT LOGIC
    case "SUBMIT": {
      const current = state.questions[state.currentIndex];
      const isCorrect =
        state.selectedOptionId === current.correctOptionId;

      return {
        ...state,
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
        questionId: state.questions[state.currentIndex].id,
        incorrectAttempts: state.currentQuestionIncorrect,
        timeElapsed: action.payload.timeElapsed,
      };

      const newRecords = [...state.attemptRecords, record];
      const newScore = state.score + 1;
      const isLast =
        state.currentIndex === state.questions.length - 1;

      if (isLast) {
        return {
          ...state,
          phase: "summary",
          score: newScore,
          attemptRecords: newRecords,
        };
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

export default function QuizPage() {
  const [state, dispatch] = useReducer(reducer, initialState);
  const timer = useQuizTimer();

  const mutation = useMutation({
    mutationFn: fetchQuizQuestions,
    onSuccess: (data) => {
      if (data?.length) {
        dispatch({ type: "LOAD_QUESTIONS", payload: data });
      } else {
        dispatch({ type: "LOAD_ERROR" });
      }
    },
  });

  useEffect(() => {
    if (state.phase === "quiz") {
      timer.start();
    }
  }, [state.phase, state.currentIndex]);

  const handleStart = useCallback(() => {
    if (!state.selectedSubject || !state.selectedCount) return;

    dispatch({ type: "START_LOADING" });

    mutation.mutate({
      examSubjectName: state.selectedSubject,
      numberOfQuestions: state.selectedCount,
    });
  }, [state.selectedSubject, state.selectedCount]);

  const handleSelectOption = useCallback((optionId: string) => {
    dispatch({ type: "SELECT_OPTION", payload: optionId });
  }, []);

  // ✅ NEW
  const handleSubmit = useCallback(() => {
    if (!state.selectedOptionId) return;
    dispatch({ type: "SUBMIT" });
  }, [state.selectedOptionId]);

  const handleNext = useCallback(() => {
    const elapsed = timer.stop();
    dispatch({ type: "ADVANCE", payload: { timeElapsed: elapsed } });
  }, [timer]);

  const currentQuestion = state.questions[state.currentIndex];

  return (
    <main className="min-h-screen bg-black text-white">
      {(state.phase === "setup" || state.phase === "loading") && (
        <SubjectSelector
          selectedSubject={state.selectedSubject}
          selectedCount={state.selectedCount}
          onSubjectChange={(s) =>
            dispatch({ type: "SET_SUBJECT", payload: s })
          }
          onCountChange={(c) =>
            dispatch({ type: "SET_COUNT", payload: c })
          }
          onStart={handleStart}
          isLoading={mutation.isPending}
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
          onSubmit={handleSubmit} // ✅ NEW
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
    </main>
  );
}