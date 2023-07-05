export interface Answer {
  id: number;
  text: string;
  correct: boolean;
}

export interface QuestionI {
  id: number;
  questionText: string;
  type: "radio" | "mc";
  answers: Answer[];
  correctAnswers: number | number[];
}

//TODO:
//QuestionI can be :
// 1.{
//   question_text: string;
//   type: "mc";
//   answers: Answer;
//   correct: number[];
// }
// or
// 2.{
//   question_text: string;
//   type: "radio" ;
//   answers: Answer;
//   correct: number;
// }

export interface QuestionsI {
  [code: number]: QuestionI;
}

export type TestI = {
  id?: string;
  ownerId: number;
  title: string;
  visibility: "public" | "private";
  questions: QuestionI[];
};

export const isATest = (test: any): test is TestI => {
  return "ownerId" in test && "title" in test && "visibility" in test;
};

// const tryd: Answer = { 1: "hello", 2: "kiki" };
// const a: QuestionsI = {
//   1: { question_text: "hello", type: "radio", answers: tryd, correct: 2 },
//   2: { question_text: "hello", type: "mc", answers: tryd, correct: [2,3] },
// };
