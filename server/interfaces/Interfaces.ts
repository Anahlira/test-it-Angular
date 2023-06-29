export interface Answer {
  [code: number]: string;
}

export interface QuestionI {
  question_text: string;
  type: "radio" | "mc";
  answers: Answer;
  correct: number | number[];
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
  id?: number;
  owner_id: number;
  title: string;
  visibility: "public" | "private";
  questions: QuestionI;
};

export const isATest = (test: any): test is TestI => {
  return "owner_id" in test && "title" in test && "visibility" in test;
};

// const tryd: Answer = { 1: "hello", 2: "kiki" };
// const a: QuestionsI = {
//   1: { question_text: "hello", type: "radio", answers: tryd, correct: 2 },
//   2: { question_text: "hello", type: "mc", answers: tryd, correct: [2,3] },
// };
