import { Component, ViewChildren, inject } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
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
  constructor() {}
  // test: ITest | undefined = undefined;
  // formBuilder = inject(FormBuilder);

  // @ViewChildren(ChangeDirective) changeDirectives: ChangeDirective[] = [];
  // form = this.formBuilder.group({
  //   name: [this.test?.title, [Validators.required, Validators.minLength(4)], []],
  //   email: [
  //     this.test?.title,
  //     [Validators.required, Validators.minLength(4), containsValidator('@')],
  //     ,
  //     [],
  //   ],
  //   testname: [this.test?.title, [Validators.required], []],
  // });

  // constructor(
  //   private testsService: TestsService,
  //   private activatedRoute: ActivatedRoute
  // ) {}

  // ngOnInit() {
  //   return this.testsService.tests$
  //     .pipe(
  //       map((tests: ITest[]) =>
  //         tests.find(
  //           (test: ITest) =>
  //             test.id === +this.activatedRoute.snapshot.params['id']
  //         )
  //       )
  //     )
  //     .subscribe((test) => {
  //       this.test = test;
  //       // this.form.setValue({
  //       //   name: test?.name,
  //       //   email: test?.email,
  //       //   testname: test?.testname,
  //       // });
  //     });
  // }

  // getFormControl(name: keyof typeof this.form.controls) {
  //   return this.form.controls[name];
  // }

  // submitFormHandler(): void {
  //   if (this.test) {
  //     const newTest: ITest = {
  //       id: this.test.id,
  //       ownerId: 0,
  //       title: '',
  //       questions: [],
  //       correctIds: [],
  //       visibility: 'public'
  //     };

  //     this.testsService.updateTest(this.test?.id, newTest);

  //     this.changeDirectives.forEach((changeDirective) => {
  //       changeDirective.updateValue();
  //     });
  //   }
  // }

  // canDeactivate(): Observable<boolean> | Promise<boolean> | boolean {
  //   let pristine = true;

  //   this.changeDirectives.forEach((changeDirective) => {
  //     if (changeDirective.isPristine()) {
  //     } else {
  //       pristine = false;
  //     }
  //   });

  //   if (pristine) {
  //     return true;
  //   }
  //   return confirm(
  //     'Your changes are unsaved! Would you like to exit without saving?'
  //   );
  // }

  // handleTestInfoReset(): void {
  //   // this.form.setValue({
  //   //   // name: this.test?.name,
  //   //   // email: this.test?.email,
  //   //   // testname: this.test?.testname,
  //   // });
  // }
}
