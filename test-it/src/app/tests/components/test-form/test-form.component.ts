import { Component, ViewChildren, inject } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { DialogComponent } from 'src/app/dialog/dialog.component';
import { AuthService } from 'src/app/services/auth.service';
import {
  IAnswer,
  IQuestion,
  ITest,
  TestsService,
} from 'src/app/services/tests.service';
import { ChangeDirective } from 'src/app/shared/change.directive';
import { RestApiService } from 'src/app/shared/rest-api.service';

@Component({
  selector: 'app-test-form',
  templateUrl: './test-form.component.html',
  styleUrls: ['./test-form.component.scss'],
})
export class TestFormComponent {
  form: FormGroup;
  test$: Observable<ITest> | undefined = undefined;
  editTest: string = 'create';
  savedTest = false;

  @ViewChildren(ChangeDirective) changeDirectives: ChangeDirective[] = [];

  constructor(
    private router: Router,
    private testsService: TestsService,
    private authService: AuthService,
    private restApi: RestApiService,
    private activatedRoute: ActivatedRoute,
    private formBuilder: FormBuilder,
    public dialog: MatDialog
  ) {
    this.form = this.formBuilder.group({});
    this.editTest = this.activatedRoute.snapshot.data['testType'] || 'create';
  }

  ngOnInit() {
    switch (this.editTest) {
      case 'edit':
        this.test$ = this.testsService.getTest(
          this.activatedRoute.snapshot.params['id']
        );
        break;
      case 'check':
        this.test$ = this.testsService.createdTest$;
        break;
      case 'create':
        this.test$ = this.testsService.createdTest$;
        break;
      default:
    }

    this.createForm();
  }

  //------------------------
  //Creating form groups
  //------------------------

  createForm() {
    this.test$?.subscribe((t) => {
      let questions: any = [];
      if (t.questions) {
        questions = t.questions?.map((q) => {
          return this.createQuestionGroup(q);
        });
      } else {
        questions.push(this.createQuestionGroup());
      }

      let visibility: boolean = false;

      if (t?.visibility === undefined) {
        visibility = true;
      } else if (t.visibility === 'public' || t.visibility) visibility = true;

      this.form = this.formBuilder.group({
        title: t?.title,
        private: !visibility,
        questions: this.formBuilder.array(questions),
      });
    });
  }

  createQuestionGroup(question?: IQuestion) {
    let answers: any = [];
    if (question?.answers) {
      answers = question.answers?.map((a) => {
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

  removeQuestion(questionIndex: number) {
    this.questionGroups.removeAt(questionIndex);
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

  checkForNoAnswers(question: IQuestion) {
    if (question?.answers.length === 0) return 1;
    return 0;
  }

  chechForExistingCorrectAnswer(answers: IAnswer[]) {
    let hasCorrect = false;

    answers.forEach((answer: IAnswer) => {
      if (answer.correct) {
        hasCorrect = true;
        return;
      }
    });
    return hasCorrect;
  }

  saveTest() {
    let missingElements = false;

    const questions: IQuestion[] = this.form.value.questions
      .filter((el: IQuestion) => {
        if (el.questionText === '' || this.checkForNoAnswers(el))
          missingElements = true;
        return el.questionText !== '' && !this.checkForNoAnswers(el);
      })
      .map((element: any, index: number) => {
        // Filter the empty answers
        const answers = element.answers
          .filter((el: IAnswer) => {
            if (el.text === '') missingElements = true;
            return el.text !== '';
          })
          .map((answer: Omit<IAnswer, 'id'>, id: number) => ({
            id: id + 1,
            ...answer,
          }));

        if (this.chechForExistingCorrectAnswer(answers) === false) {
          missingElements = true;
        }

        return {
          id: index + 1,
          questionText: element.questionText,
          type: element.multipleChoice ? 'mc' : 'radio',
          answers: answers,
          correctAnswers: answers
            .filter((el: IAnswer) => el.correct)
            .map((el: IAnswer) => el.id),
        };
      });

    const myTest: ITest = {
      title: this.form.value.title,
      questions: questions,
      visibility: this.form.value.private,
    };

    if (this.editTest !== 'edit') {
      myTest.ownerId = this.authService.user?._id;
    }

    console.log(missingElements);
    console.log(myTest);

    if (missingElements) {
      const dialogRef = this.dialog.open(DialogComponent, {
        data: {
          title: `Are you sure you want to save? The test has missing elements.`,
          confirmText: 'Save',
        },
      });

      dialogRef.afterClosed().subscribe((result) => {
        if (result) {
          this.saveToDatabase(myTest);
        } else missingElements = false;
      });
    } else this.saveToDatabase(myTest);
  }

  saveToDatabase(myTest: ITest) {
    switch (this.editTest) {
      case 'edit':
        const testId = this.activatedRoute.snapshot.params['id'];
        this.testsService
          .editTest(testId, myTest as ITest)
          .subscribe((data: ITest) => {
            console.log(data);
            this.changeDirectives.forEach((d) => {
              d.updateValue();
            });
            this.router.navigate([`/my-tests/${testId}`]);
          });
        break;
      default:
        this.restApi.createTest(myTest).subscribe((data: ITest) => {
          console.log(data);
          const newTestId = data._id;
          this.changeDirectives.forEach((d) => {
            d.updateValue();
          });

          this.testsService.resetCreatedTest();
          this.router.navigate([`/my-tests/${newTestId}`]);
        });
    }
    this.savedTest = true;
    this.router.navigate(['/tests']);
  }

  canDeactivate() {
    let exit = true;

    if (this.editTest === 'check' && this.testsService.createdTest$) {
      return confirm('You have unsaved changes. Do you want to leave?');
    }

    if (this.savedTest) {
      return true;
    }

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
