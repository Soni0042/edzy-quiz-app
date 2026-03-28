# Edzy Quiz App — Task 3

A fully interactive, visually engaging multiple-choice quiz application built for the Edzy.ai Frontend Hackathon.

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- npm / yarn / pnpm

### Installation

```bash
# Clone the repo
git clone <your-repo-url>
cd edzy-quiz

# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build for Production

```bash
npm run build
npm start
```

---

## 🧩 Features

### Core
- ✅ **Subject selection** — Class 10 English, Mathematics, Science, Social Science
- ✅ **Question count picker** — 5, 10, or 15 questions
- ✅ **Live API fetch** — Questions fetched from `api.paraheights.com` (no hardcoded data)
- ✅ **One question at a time** — Sequential quiz flow
- ✅ **Immediate feedback** — Correct (green) / Incorrect (red) on selection
- ✅ **Retry on wrong answer** — Must answer correctly before advancing
- ✅ **Progress bar** — Animated fill with shimmer effect + "Question X of Y"
- ✅ **Summary screen** — Score, incorrect attempts, per-question breakdown

### Bonus
- ✅ **Per-question timer** — Resets on each question, colour-coded (neutral → amber → red)
- ✅ **Smooth animations** — Slide-up, pop-in, shake on wrong answer, bounce-check on correct
- ✅ **Score ring** — Animated SVG donut chart with colour-coded performance
- ✅ **Accessible** — Keyboard navigable, focus management, `:focus-visible` ring
- ✅ **Mobile-friendly** — Responsive layout down to 320px
- ✅ **TypeScript** — Fully typed components, hooks, API layer, and reducer

---

## 🏗️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS |
| API Fetching | Axios + TanStack Query v5 |
| State | useReducer (finite state machine) |
| Fonts | Sora, DM Sans, JetBrains Mono (Google Fonts) |
| Animations | Tailwind custom keyframes + CSS |

---

## 📁 Project Structure

```
src/
├── app/
│   ├── globals.css         # Global styles, custom scrollbar, shimmer
│   ├── layout.tsx          # Root layout with fonts + QueryProvider
│   └── page.tsx            # Main quiz page — all state management
├── components/
│   ├── QueryProvider.tsx   # TanStack Query client wrapper
│   ├── SubjectSelector.tsx # Setup screen (subject + count selection)
│   ├── QuizQuestion.tsx    # Active quiz question with options
│   ├── QuizSummary.tsx     # End-of-quiz summary with score ring
│   ├── ProgressBar.tsx     # Animated progress bar with shimmer
│   └── TimerDisplay.tsx    # Per-question elapsed timer
├── hooks/
│   └── useQuizTimer.ts     # Custom hook for question timer
├── lib/
│   ├── api.ts              # Axios client + fetchQuizDetails()
│   └── utils.ts            # cn() utility (clsx + tailwind-merge)
└── types/
    └── quiz.ts             # All TypeScript interfaces & types
```

---

## 🔌 API

**Endpoint:** `POST https://api.paraheights.com/edzy-api/hackathon/task-1/quizDetails`

**Payload:**
```json
{
  "examSubjectName": "Class 10 - English",
  "numberOfQuestions": 5
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "examSubjectName": "Class 10 - English",
    "numberOfQuestions": 5,
    "questions": [
      {
        "questionId": "...",
        "questionText": "...",
        "options": [
          { "optionId": "...", "optionText": "..." }
        ],
        "correctOptionId": "..."
      }
    ]
  }
}
```

---

## ⚠️ Known Limitations

- **No persistence** — Refreshing mid-quiz resets state (acceptable for MVP; can be solved with `sessionStorage` or server-side sessions)
- **No offline support** — Requires internet access to fetch questions

---

## 📝 Prompting Process

See [PROMPTS.md](./PROMPTS.md) for the complete documentation of all LLM prompts used during development.

---

## 🎨 Design Decisions

- **Dark theme** with deep navy-black backgrounds (`#0f1117`) to reduce eye strain during study sessions
- **Indigo-blue brand accent** (`#4c6ef5`) — professional yet vibrant
- **Sora** for headings (geometric, modern) paired with **DM Sans** (legible body text) and **JetBrains Mono** for numeric labels
- **Shake animation** on wrong answers provides immediate kinesthetic feedback
- **Score ring** on summary motivates students with a visual achievement indicator

---

Built with ❤️ for the Edzy.ai Frontend Hackathon
