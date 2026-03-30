export const fetchQuizQuestions = async ({
  examSubjectName,
  numberOfQuestions,
}: {
  examSubjectName: string;
  numberOfQuestions: number;
}) => {
  const res = await fetch(
    "https://api.paraheights.com/edzy-api/hackathon/task/quizDetails",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        examSubjectName,
        numberOfQuestions,
      }),
    }
  );

  const data = await res.json();

  // ✅ Transform API → UI format
  return data.data.questions.map((q: any) => ({
    id: q._id,
    questionText: q.text,
    options: q.optionOrdering.map((opt: any) => ({
      optionId: opt._id,
      optionText: opt.text,
    })),
    correctOptionId: q.questionInfo.option,
    solution: q.questionInfo.solution,
  }));
};