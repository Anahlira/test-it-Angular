import { Routes, RouterModule } from '@angular/router';
import {
  TestsListComponent,
  TestDetailComponent,
  TestEditComponent,
} from './components';
import { AuthDeactivate } from '../guards';

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
    path: ":id",
    component: TestDetailComponent,
    title: "App | Test",
  },
  {
    path: ":id/edit",
    component: TestEditComponent,
    title: "App | TestEdit",
    canDeactivate: [AuthDeactivate],
  },
];

export const TestsRoutingModule = RouterModule.forChild(routes);
