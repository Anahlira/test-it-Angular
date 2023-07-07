import { Component, ViewChildren, inject } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, FormControl } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
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
  constructor(
    private testsService: TestsService,
    private activatedRoute: ActivatedRoute,
    private formBuilder: FormBuilder
  ) {
    this.form = this.formBuilder.group({
      title: '',
      private: false,
      // questions: this.formBuilder.array([this.createQuestionGroup()]),
    });
  }

  ngOnInit() {
    this.test$ = this.testsService.getTest(
      this.activatedRoute.snapshot.params['id']
    );
    console.log(this.test$.subscribe((s) => console.log(s)));
  }

  saveTest() {}
}
