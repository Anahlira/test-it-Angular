import { Component, ViewChildren, inject } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import {
  IAnswer,
  IQuestion,
  ITest,
  TestsService,
} from '../services/tests.service';
import { ChangeDirective } from '../shared/change.directive';

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

  @ViewChildren(ChangeDirective) changeDirectives: ChangeDirective[] = [];
  constructor(
    private router: Router,
    private authService: AuthService,
    private testsService: TestsService
  ) {}

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
        const answerTexts: string[] = answer.split('|');

        if (answerTexts.length === 2) {
          return {
            id: answerIndex,
            text: answerTexts[0].trim(),
            correct:
              answerTexts[1].trim().replaceAll(' ', '') === '1' ||
              answerTexts[1].trim().replaceAll(' ', '') === '+1',
          };
        }
        const answerFullText: string = answer.replaceAll(' ', '').trim();

        if (answerFullText.match(/-1$/)) {
          return {
            id: answerIndex,
            text: answer.replace(/-1$/, ''),
            correct: false,
          };
        } else if (answerFullText.match(/\+1$/)) {
          return {
            id: answerIndex,
            text: answer.replace(/\+1$/, ''),
            correct: true,
          };
        } else if (answerFullText.match(/1$/)) {
          return {
            id: answerIndex,
            text: answer.replace(/1$/, ''),
            correct: true,
          };
        }

        return { id: answerIndex, text: answer, correct: false };
      });

      console.log('answers', answers);
      const correctAnswers = answers
        .filter((answer) => answer.correct)
        .map((answer) => answer.id);

      questions.push({
        questionText,
        type: correctAnswers.length > 1 ? 'mc' : 'radio',
        correctAnswers: correctAnswers,
        id: index,
        answers,
      });
    }

    const test: ITest = {
      title: '',
      ownerId: this.authService.user?._id,
      visibility: 'public',
      questions,
    };

    this.testsService.saveCreatedTest(test);

    this.changeDirectives.forEach((d) => {
      d.updateValue();
    });

    this.router.navigate(['/test-extractor/check']);
  }

  canDeactivate() {
    let exit = true;

    this.changeDirectives.forEach((change) => {
      if (!change.isPristine()) {
        exit = false;
        return;
      }
    });

    if (!exit)
      return confirm('You have unsaved changes. Do you want to leave?');
    return true;
  }
}
