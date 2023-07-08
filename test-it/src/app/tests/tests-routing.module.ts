import { Routes, RouterModule } from '@angular/router';
import {
  TestsListComponent,
  TestDetailComponent,
  TestFormComponent,
} from './components';
import { AuthDeactivate } from '../guards';
import { PlayTestComponent } from './components/play-test/play-test.component';

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'list',
  },
  {
    path: 'list',
    component: TestsListComponent,
  },
  {
    path: ':id',
    component: TestDetailComponent,
    title: 'App | Test',
  },
  {
    path: ':id/edit',
    component: TestFormComponent,
    title: 'App | TestEdit',
    canDeactivate: [AuthDeactivate],
    data: { testType: 'edit' },
  },

  {
    path: ':id/play',
    component: PlayTestComponent,
    title: 'App | PlayTest',
    canDeactivate: [AuthDeactivate],
  },
];

export const TestsRoutingModule = RouterModule.forChild(routes);
