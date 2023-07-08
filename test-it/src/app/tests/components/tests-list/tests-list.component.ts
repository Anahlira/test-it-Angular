import { DialogRef } from '@angular/cdk/dialog';
import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ITest, TestsService } from 'src/app/services/tests.service';
import {
  MatDialog,
  MAT_DIALOG_DATA,
  MatDialogRef,
  MatDialogModule,
} from '@angular/material/dialog';
import { DialogComponent } from 'src/app/dialog/dialog.component';

@Component({
  selector: 'app-tests-list',
  templateUrl: './tests-list.component.html',
  styleUrls: ['./tests-list.component.scss'],
})
export class TestsListComponent {
  selectedTest: ITest | undefined = undefined;
  arePersonalTests = false;

  constructor(
    private testsService: TestsService,
    private activatedRoute: ActivatedRoute,
    public dialog: MatDialog
  ) {
    this.arePersonalTests =
      !!this.activatedRoute.snapshot.data['personalTests'];
  }

  get tests() {
    if (this.arePersonalTests) {
      return this.testsService.customerTests$;
    }

    return this.testsService.tests$;
  }

  handleTestClick(test: ITest) {
    this.selectedTest = test;
  }

  deleteTest(test: ITest) {
    const dialogRef = this.dialog.open(DialogComponent, {
      data: { title: this.selectedTest?.title },
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.testsService.deleteTest(test?._id || '');
      }
    });
  }
}
