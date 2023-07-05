import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable, map, mergeMap, switchMap } from 'rxjs';
import { ITest, TestsService } from 'src/app/services/tests.service';

@Component({
  selector: 'app-test-detail',
  templateUrl: './test-detail.component.html',
  styleUrls: ['./test-detail.component.scss'],
})
export class TestDetailComponent {
  test$: Observable<ITest> | undefined = undefined;
  constructor(
    private testsService: TestsService,
    private activatedRoute: ActivatedRoute
  ) {}

  ngOnInit() {
    this.test$ = this.testsService.getTest(
      this.activatedRoute.snapshot.params['id']
    );
    // this.testsService.tests$
    //   .pipe(
    //     map((tests: ITest[]) =>
    //       tests.find(
    //         (test: ITest) =>
    //           test._id === this.activatedRoute.snapshot.params['id']
    //       )
    //     )
    //   )
    //   .subscribe((test) => {
    //     this.test = test;
    //   });
  }
}
