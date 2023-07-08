import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { IQuestion, ITest } from 'src/app/services/tests.service';
import { TestsService } from 'src/app/services/tests.service';
@Component({
  selector: 'app-play-test',
  templateUrl: './play-test.component.html',
  styleUrls: ['./play-test.component.scss'],
})
export class PlayTestComponent implements OnInit {
  test: ITest | undefined;
  form: FormGroup;
  result: any[] | undefined;
  answers: { [questionId: number]: number[] } = {};
  totalCorrectPoints: number = 0;

  constructor(
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private testsService: TestsService,
    private activatedRoute: ActivatedRoute
  ) {
    this.form = this.formBuilder.group({
      questions: [],
    });
  }

  selectAnswer(questionId: number, answerId: number): void {
    if (this.answers[questionId]) {
      // If answers for this question already exist, check if the current answer is selected or deselected
      const index = this.answers[questionId].indexOf(answerId);
      if (index !== -1) {
        // Answer already selected, remove it
        this.answers[questionId].splice(index, 1);
      } else {
        // Answer not selected, add it
        this.answers[questionId].push(answerId);
      }
    } else {
      // No answers for this question yet, create a new array with the selected answer
      this.answers[questionId] = [answerId];
    }
  }

  isAnswerSelected(questionId: number, answerIndex: number): boolean {
    const selectedAnswers = this.answers[questionId];
    return selectedAnswers && selectedAnswers.includes(answerIndex);
  }

  loadTest(): void {
    this.testsService
      .getTest(this.activatedRoute.snapshot.params['id'])
      .subscribe((test) => {
        this.test = test;

        this.form = this.formBuilder.group({
          questions: this.formBuilder.array(
            test.questions.map((question) => this.buildQuestionGroup(question))
          ),
        });
      });
  }

  ngOnInit(): void {
    this.loadTest();
  }

  buildQuestionGroup(question: IQuestion): FormGroup {
    return this.formBuilder.group({
      id: question.id,
      selectedAnswers: [],
    });
  }

  submitTest(): void {
    // Calculate the test results
    this.result = this.form?.value.questions.map((question: any) => ({
      id: question.id,
      correct: this.isQuestionCorrect(question.id),
    }));

    this.totalCorrectPoints = this.result
      ? this.result.filter((r) => r.correct).length
      : 0;
  }

  isQuestionCorrect(questionId: any): boolean {
    const selectedAnswers = this.answers[questionId];

    if (!this.test) {
      return false;
    }
    const question = this.test.questions.find((q) => q.id === questionId);

    if (!question || !selectedAnswers || selectedAnswers.length === 0) {
      return false;
    }

    console.log(question.correctAnswers, this.answers[questionId]);
    if (Array.isArray(question.correctAnswers)) {
      return (
        selectedAnswers.length === question.correctAnswers.length &&
        selectedAnswers.every((answer) => question.answers[answer].correct)
      );
    } else {
      return (
        selectedAnswers.length === 1 &&
        selectedAnswers[0] === question.correctAnswers
      );
    }
  }

  getAnswerClass(questionIndex: number, answerIndex: number): string {
    if (!this.result) {
      return '';
    }

    const questionResult = this.result[questionIndex];

    const isQuestionCorrectCorrect = questionResult && questionResult.correct;
    const isSelected = this.isAnswerSelected(questionResult.id, answerIndex);

    const isCorrectOverall =
      this.test?.questions[questionIndex].answers[answerIndex].correct;

    if (isCorrectOverall && isSelected) {
      return 'correct-answer';
    } else if (!isCorrectOverall && isSelected) {
      return 'incorrect-answer';
    } else if (isCorrectOverall && !isSelected) {
      return 'notselected-correct-answer';
    }

    return '';
  }

  canDeactivate() {
    let exit = true;

    if (Object.keys(this.answers).length !== 0) {
      exit = false;
    }

    if (!exit) {
      return confirm('You did not submit the test. Do you want to leave?');
    }
    return true;
  }

  resetForm(): void {
    if (!this.test) {
      return;
    }

    this.form.reset();

    this.form = this.formBuilder.group({
      questions: this.formBuilder.array(
        this.test.questions.map((question) => this.buildQuestionGroup(question))
      ),
    });
    this.answers = {};
    this.result = undefined;
  }
}
