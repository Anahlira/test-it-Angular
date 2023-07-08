import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, map, mergeMap, switchMap } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { ITest, TestsService } from 'src/app/services/tests.service';

@Component({
  selector: 'app-test-detail',
  templateUrl: './test-detail.component.html',
  styleUrls: ['./test-detail.component.scss'],
})
export class TestDetailComponent {
  test$: Observable<ITest> | undefined = undefined;
  isTestOwners = false;

  constructor(
    private testsService: TestsService,
    private activatedRoute: ActivatedRoute,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    this.test$ = this.testsService.getTest(
      this.activatedRoute.snapshot.params['id']
    );

    this.test$?.subscribe((test) => {
      this.isTestOwners = test.ownerId == this.authService.user?._id;
    });
  }

  deleteTest(test: ITest) {
    this.testsService.deleteTest(test?._id || '');
    this.router.navigate(['/tests']);
  }
}
