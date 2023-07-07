import { Component, ViewChildren, inject } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, map } from 'rxjs';
import { ITest, TestsService } from 'src/app/services/tests.service';
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

  createForm() {
    this.test$?.subscribe((t) => {
      console.log(t);
      this.form = this.formBuilder.group({
        title: t?.title,
        private: t?.visibility,
        questions: this.formBuilder.array(
          t.questions.map((q) => {
            return this.formBuilder.group({
              questionText: q.questionText,
              type: q.type,
              answers: this.formBuilder.array(
                q.answers.map((a) => {
                  return this.formBuilder.group({
                    text: a.text,
                    correct: a.correct,
                  });
                })
              ),
            });
          })
        ),
      });
    });
  }

  createAnswerGroup() {
    return this.formBuilder.group({
      text: '',
      correct: false,
    });
  }

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

  saveTest() {
    console.log(this.form.value);
    this.testsService
      .editTest(
        this.activatedRoute.snapshot.params['id'],
        this.form.value as ITest
      )
      .subscribe((data: ITest) => {
        console.log(data);
      });

    // this.form.reset();
    // this.createForm();
    console.log(this.changes);
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
