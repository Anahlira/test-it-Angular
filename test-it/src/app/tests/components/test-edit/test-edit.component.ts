import { Component, ViewChildren, inject } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, map } from 'rxjs';
import {
  IAnswer,
  IQuestion,
  ITest,
  TestsService,
} from 'src/app/services/tests.service';
import { ChangeDirective } from 'src/app/shared/change.directive';
import { containsValidator } from 'src/app/shared/contains.directive';

@Component({
  selector: 'app-test-edit',
  templateUrl: './test-edit.component.html',
  styleUrls: ['./test-edit.component.scss'],
})
export class TestEditComponent {
  form: FormGroup;
  test$: Observable<ITest> | undefined = undefined;

  @ViewChildren(ChangeDirective) changes: ChangeDirective[] = [];

  constructor(
    private router: Router,
    private testsService: TestsService,
    private activatedRoute: ActivatedRoute,
    private formBuilder: FormBuilder
  ) {
    this.form = this.formBuilder.group({});
  }

  ngOnInit() {
    this.test$ = this.testsService.getTest(
      this.activatedRoute.snapshot.params['id']
    );

    this.createForm();

    console.log(this.form);
  }

  //------------------------
  //Creating form groups
  //------------------------

  createForm() {
    this.test$?.subscribe((t) => {
      console.log(t);
      this.form = this.formBuilder.group({
        title: t?.title,
        private: !t?.visibility,
        questions: this.formBuilder.array(
          t.questions.map((q) => {
            return this.createQuestionGroup(q);
          })
        ),
      });
    });
  }

  createQuestionGroup(question?: IQuestion) {
    let answers: any = [];
    if (question?.answers) {
      answers = question.answers.map((a) => {
        return this.createAnswerGroup(a);
      });
    } else {
      answers = [
        this.createAnswerGroup(),
        this.createAnswerGroup(),
        this.createAnswerGroup(),
        this.createAnswerGroup(),
      ];
    }

    return this.formBuilder.group({
      questionText: question?.questionText || '',
      type: question?.type === 'mc' ? 1 : 0,
      answers: this.formBuilder.array(answers),
    });
  }

  createAnswerGroup(answer?: IAnswer) {
    return this.formBuilder.group({
      text: answer?.text || '',
      correct: answer?.correct || false,
    });
  }

  addQuestion() {
    this.questionGroups.push(this.createQuestionGroup());
  }

  //------------------------
  //Modify and get groups
  //------------------------

  get questionGroups() {
    return this.form.get('questions') as FormArray;
  }
  answerGroups(index: number) {
    return this.questionGroups.controls[index].get('answers') as FormArray;
  }

  addAnswer(questionIndex: number) {
    console.log('add', this.answerGroups(questionIndex));
    this.answerGroups(questionIndex).push(this.createAnswerGroup());
  }

  removeAnswer(questionIndex: number, answerIndex: number) {
    this.answerGroups(questionIndex).removeAt(answerIndex);
  }

  updateCorrectAnswer(question: any, selectedAnswerIndex: number) {
    const answerGroups = question.get('answers') as FormArray;
    answerGroups.controls.forEach((answerGroup: any, index: number) => {
      answerGroup.get('correct').setValue(index === selectedAnswerIndex);
    });
  }

  //------------------------
  //Exit test
  //------------------------

  saveTest() {
    const questions: IQuestion[] = this.form.value.questions.map(
      (element: any, index: number) => {
        // Filter the empty answers
        const answers = element.answers
          .filter((el: IAnswer) => el.text !== '')
          .map((answer: Omit<IAnswer, 'id'>, id: number) => ({
            id: id + 1,
            ...answer,
          }));

        return {
          id: index + 1,
          questionText: element.questionText,
          type: element.multipleChoice ? 'mc' : 'radio',
          answers: answers,
          correctAnswers: answers
            .filter((el: IAnswer) => el.correct)
            .map((el: IAnswer) => el.id),
        };
      }
    );

    const myTest: ITest = {
      //for edit, no need, but create...
      //ownerId: this.authService.user?._id,
      title: this.form.value.title,
      questions: questions,
      visibility: this.form.value.private,
    };

    console.log(myTest);
    this.testsService
      .editTest(this.activatedRoute.snapshot.params['id'], myTest as ITest)
      .subscribe((data: ITest) => {
        console.log(data);
      });

    // this.form.reset();
    // this.createForm();
  }

  canDeactivate() {
    let exit = true;

    this.changes.forEach((change) => {
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
