import { Component, inject } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { IAnswer, IQuestion, ITest } from '../services/tests.service';

@Component({
  selector: 'app-question-extractor',
  templateUrl: './question-extractor.component.html',
  styleUrls: ['./question-extractor.component.scss'],
})
export class QuestionExtractorComponent {
  textInput: string = '';
  formBuilder = inject(FormBuilder);
  createdTest: ITest | undefined = undefined;

  form = this.formBuilder.group({
    textInput: [this.textInput],
  });

  constructor(private router: Router, private authService: AuthService) {}

  extractQuestions(): void {
    if (!this.form.value.textInput) {
      return;
    }
    const lines = this.form.value.textInput.split('\n');
    let questions: string[][] = [];
    let currentQuestion: string[] = [];

    for (let line of lines) {
      line = line.trim();

      if (line !== '') {
        currentQuestion.push(line);
      } else {
        if (currentQuestion.length > 0) {
          questions.push(currentQuestion);
          currentQuestion = [];
        }
      }
    }

    if (currentQuestion.length > 0) {
      questions.push(currentQuestion);
    }

    console.log('Extracted Questions:', questions);
    this.modifyToTest(questions);
  }

  modifyToTest(createdInitialQuestions: string[][]): void {
    let questions: IQuestion[] = [];
    let index = 0;
    for (let question of createdInitialQuestions) {
      if (question.length === 0) return;

      const questionText = question.shift();

      if (!questionText) return;
      index++;

      const answers: IAnswer[] = question.map((answer, answerIndex: number) => {
        const answerTexts = answer.split('|');

        if (answerTexts.length === 2) {
          return {
            id: answerIndex,
            text: answerTexts[0].trim(),
            correct:
              answerTexts[1].trim().replaceAll(' ', '') === '1' ||
              answerTexts[1].trim().replaceAll(' ', '') === '+1',
          };
        }

        return { id: answerIndex, text: answer, correct: false };
      });

      console.log('answers', answers);
      const correctAnswers = answers
        .filter((answer) => answer.correct)
        .map((answer) => answer.id);

      questions.push({
        questionText: question[0],
        type: correctAnswers.length > 1 ? 'mc' : 'radio',
        correctAnswers: [1],
        id: index,
        answers,
      });
    }
    
    console.log(questions);
  }
}
