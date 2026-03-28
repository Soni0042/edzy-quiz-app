# PROMPTS.md — LLM Prompting Process Documentation

This file documents all prompts used during the development of the Edzy Quiz App (Task 3).

---

## Prompt 1 — Project Scaffolding & Architecture

**Tool:** Claude (Anthropic)

**Prompt:**
> I need to build a Next.js 14 + TypeScript quiz app for Edzy.ai. The app should:
> - Let students select subject (Class 10 English/Maths/Science/Social Science) and number of questions (5/10/15)
> - Fetch questions from POST https://api.paraheights.com/edzy-api/hackathon/task-1/quizDetails with payload { examSubjectName, numberOfQuestions }
> - Show one question at a time with 4 options
> - Give immediate correct/incorrect feedback on selection
> - Force retry on wrong answer before moving forward
> - Track progress with progress bar
> - Show summary at end: score, incorrect attempts, reattempt option
> - Bonus: per-question timer
>
> Suggest a clean, scalable folder structure using App Router, TanStack Query, Tailwind CSS, and TypeScript. Define all necessary types.

**Purpose:** Establish project structure, type system, and component architecture before writing any code.

---

## Prompt 2 — Type Definitions

**Tool:** Claude

**Prompt:**
> Based on the API response shape for the quiz app, define all TypeScript interfaces including:
> - `QuizQuestion` with `questionId`, `questionText`, `options: QuizOption[]`, `correctOptionId`
> - `QuizOption` with `optionId`, `optionText`
> - `QuizApiResponse` wrapping data
> - App-level state types: `QuizState`, `QuizConfig`, `QuizAttemptRecord`, `AnswerState`
> - All component prop interfaces
>
> Keep them in a single `types/quiz.ts` file.

**Purpose:** Strong typing from the start to prevent runtime errors and improve DX.

---

## Prompt 3 — Reducer Design

**Tool:** Claude

**Prompt:**
> Design a `useReducer`-based state machine for the quiz app with phases: `setup | loading | quiz | summary`.
> Actions needed:
> - SET_SUBJECT, SET_COUNT
> - START_LOADING, LOAD_QUESTIONS, LOAD_ERROR
> - SELECT_OPTION (compute correct/incorrect immediately)
> - NEXT_QUESTION (record time, increment score)
> - FINISH_QUIZ
> - REATTEMPT (reset questions, keep config)
> - NEW_QUIZ (go back to setup)
>
> Incorrect answers should increment `totalIncorrectAttempts` and trigger a shake animation via `shakeKey`.

**Purpose:** Centralise all quiz logic in a predictable, testable reducer instead of scattered useState calls.

---

## Prompt 4 — API Layer

**Tool:** Claude

**Prompt:**
> Write an Axios API client for the Edzy quiz endpoint. The base URL is `https://api.paraheights.com/edzy-api/hackathon`.
> - Create an axios instance with 15s timeout and JSON headers
> - Export a `fetchQuizDetails(params)` function typed with the interfaces from quiz.ts
> - Wrap with TanStack Query's `useMutation` in the page component (not a query since it requires user-provided params)

**Purpose:** Clean separation of API concerns; TanStack Query provides retry logic and loading states for free.

---

## Prompt 5 — Per-Question Timer Hook

**Tool:** Claude

**Prompt:**
> Build a `useQuizTimer` custom hook that:
> - Tracks elapsed seconds with `setInterval`
> - Exposes `elapsed` (number), `start()`, `stop()` (returns final elapsed), `reset()`
> - `start()` resets elapsed to 0 and begins counting
> - Cleans up interval on unmount
> - Uses `useRef` for the interval ID to avoid stale closures

**Purpose:** Encapsulate timer logic cleanly; hook resets on each new question via `useEffect` watching `currentIndex`.

---

## Prompt 6 — SubjectSelector Component

**Tool:** Claude

**Prompt:**
> Create a `SubjectSelector` React component with:
> - A 2×2 grid of subject cards, each with emoji, subject name, gradient colour scheme
> - Subject options: English (blue), Mathematics (violet), Science (emerald), Social Science (amber)
> - Three question-count buttons: 5, 10, 15 — pill-style toggle
> - A "Start Quiz" button disabled until both selections are made
> - Loading spinner state during API fetch
> - Animated entrance using Tailwind custom keyframes
> - Dark theme (surface-0 background, brand-600 accents)

**Purpose:** First impression UX — clean, clear, visually engaging configuration screen.

---

## Prompt 7 — QuizQuestion Component

**Tool:** Claude

**Prompt:**
> Build a `QuizQuestion` component that shows:
> - Progress bar + "Question X of Y" label at the top
> - Per-question elapsed timer (colour-coded: neutral < 30s, amber 30-60s, red > 60s)
> - Question card with Q{n} badge
> - 4 option buttons with letter labels (A/B/C/D)
> - On selection: immediately highlight correct (green) or incorrect (red)
> - Incorrect → shake animation on the question card, options become disabled except for retrying
> - Wait — on incorrect the user must try again, so options should NOT be disabled on incorrect
> - Correct → show feedback banner, reveal "Next Question" / "Finish Quiz" button
> - All elements animate in with staggered delays

**Purpose:** Core quiz interaction — the retry-on-wrong mechanic is the key UX differentiator.

---

## Prompt 8 — QuizSummary Component

**Tool:** Claude

**Prompt:**
> Build a `QuizSummary` component showing:
> - Animated SVG score ring (like a donut chart) with score/total and percentage
> - Colour-coded ring: green ≥ 80%, amber ≥ 50%, red < 50%
> - 3-stat row: Score, Wrong Attempts, Avg Time per question
> - Scrollable per-question breakdown list (question text, incorrect count badge, time taken)
> - Two action buttons: "Reattempt" (outlined) and "New Quiz" (filled)
> - Staggered entrance animations with animationDelay on each section

**Purpose:** Satisfying end-state with actionable insights; motivates students to retry and improve.

---

## Prompt 9 — UI/UX Polish & Design System

**Tool:** Claude

**Prompt:**
> Design a cohesive dark theme for the quiz app with:
> - Background: #0f1117 (deep navy-black)
> - Surface layers: surface-0 through surface-4 for cards/borders
> - Accent: brand-500/600 (indigo-blue, #4c6ef5 / #5c7cfa)
> - Typography: Sora (display/headings), DM Sans (body), JetBrains Mono (labels/counters)
> - Custom Tailwind keyframes: slide-up, slide-in-right, pop-in, shake, bounce-check, count-up
> - Progress bar with shimmer effect and glow shadow
> - CSS variables for font families
> - Custom scrollbar styling

**Purpose:** Establish visual identity; avoid generic "AI app" aesthetics with distinctive font pairing and glow effects.

---

## Prompt 10 — Error Handling & Edge Cases

**Tool:** Claude

**Prompt:**
> What edge cases should I handle in this quiz app?
> - API returns empty questions array
> - API timeout / network error
> - User refreshes mid-quiz (state is lost — acceptable for MVP, note in README)
> - All 15 questions requested but API returns fewer
> - Timer overflow (> 99 seconds — show MM:SS format)

**Outcome:** Added `alert()` fallbacks for API errors, MM:SS timer format, graceful empty-state handling, `retry: 2` in QueryClient config.

---

## Prompt 11 — Accessibility Audit

**Tool:** Claude

**Prompt:**
> Review the quiz app components for accessibility issues:
> - Are option buttons keyboard-navigable?
> - Is the correct answer announced to screen readers?
> - Do buttons have sufficient colour contrast (4.5:1 ratio)?
> - Is focus managed correctly when the "Next" button appears after a correct answer?

**Outcome:** Added `useEffect` to auto-focus the Next button when `answerState === "correct"`, added `:focus-visible` ring in global CSS, ensured all interactive elements use `<button>` not `<div>`.

---

## Notes on LLM-Assisted Development

- All business logic, component architecture, and API integration were planned before writing code
- LLM assistance was primarily used for: boilerplate reduction, animation CSS, SVG score ring math, TypeScript type generation
- All generated code was reviewed, adapted, and validated manually
- No AI-generated code was copy-pasted without understanding; every pattern was intentional
