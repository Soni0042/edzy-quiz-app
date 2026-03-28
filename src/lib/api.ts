import axios from "axios";
import type { QuizApiResponse, Subject, QuestionCount } from "@/types/quiz";

const API_BASE = "https://api.paraheights.com";

const apiClient = axios.create({
  baseURL: API_BASE,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 15000,
});

export interface FetchQuizParams {
  examSubjectName: Subject;
  numberOfQuestions: QuestionCount;
}

export async function fetchQuizDetails(
  params: FetchQuizParams
): Promise<QuizApiResponse> {
  const { data } = await apiClient.post<QuizApiResponse>(
    "/edzy-api/hackathon/task/quizDetails",
    params
  );
  return data;
}
