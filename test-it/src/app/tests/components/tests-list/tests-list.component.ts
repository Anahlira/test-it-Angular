import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ITest, TestsService } from 'src/app/services/tests.service';

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
    private activatedRoute: ActivatedRoute
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
    this.testsService.deleteTest(test?._id || '');
  }
}
