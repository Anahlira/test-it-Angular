import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, map, mergeMap, switchMap } from 'rxjs';
import { DialogComponent } from 'src/app/dialog/dialog.component';
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
  title: string | undefined = undefined;

  constructor(
    private testsService: TestsService,
    private activatedRoute: ActivatedRoute,
    private authService: AuthService,
    private router: Router,
    public dialog: MatDialog
  ) {}

  ngOnInit() {
    this.test$ = this.testsService.getTest(
      this.activatedRoute.snapshot.params['id']
    );

    this.test$?.subscribe((test) => {
      this.isTestOwners = test.ownerId == this.authService.user?._id;
      this.title = test.title;
    });
  }

  deleteTest(test: ITest) {
    const dialogRef = this.dialog.open(DialogComponent, {
      data: {
        title: `Are you sure you want to delete ${this.title}`,
        confirmText: 'DELETE',
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.testsService.deleteTest(test?._id || '');
        this.router.navigate(['/tests']);
      }
    });
  }
}
