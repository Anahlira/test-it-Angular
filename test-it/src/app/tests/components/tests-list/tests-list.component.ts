import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ITest, TestsService } from 'src/app/services/tests.service';

@Component({
  selector: 'app-tests-list',
  templateUrl: './tests-list.component.html',
  styleUrls: ['./tests-list.component.scss'],
})
export class TestsListComponent {
  selectedTest: ITest | undefined = undefined;
  constructor(private testsService: TestsService) {}

  get tests() {
    return this.testsService.tests$;
  }

  handleTestClick(user: ITest) {
    this.selectedTest = user;
  }
}
