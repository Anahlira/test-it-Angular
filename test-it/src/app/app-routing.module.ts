import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { AuthActivate, AuthDeactivate } from './guards';
import { HomeComponent } from './home/home.component';
import { SignupComponent } from './signup/signup.component';
import { TestFormComponent } from './tests/components';
import { QuestionExtractorComponent } from './question-extractor/question-extractor.component';

const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: '/home' },

  {
    path: 'home',
    component: HomeComponent,
    title: 'App | Home',
    canActivate: [AuthActivate],
  },

  {
    path: 'test-extractor',
    component: QuestionExtractorComponent,
    title: 'App | Test Extractor',
    canActivate: [AuthActivate],
    canDeactivate: [AuthDeactivate],
  },

  {
    path: 'test-extractor/check',
    component: TestFormComponent,
    data: { testType: 'check' },
    title: 'App | Test Extractor Check',
    canActivate: [AuthActivate],
    canDeactivate: [AuthDeactivate],
  },

  {
    path: 'login',
    component: LoginComponent,
    title: 'App | Login',
    canActivate: [AuthActivate],
    data: {
      authenticationRequired: false,
    },
  },

  {
    path: 'signup',
    component: SignupComponent,
    title: 'App | Signup',
    canActivate: [AuthActivate],
    data: {
      authenticationRequired: false,
    },
  },

  {
    path: 'tests',
    loadChildren: () =>
      import('./tests/tests.module').then((m) => m.TestsModule),
    title: 'App | Test Detail',
    canActivate: [AuthActivate],
  },

  {
    path: 'my-tests',
    loadChildren: () =>
      import('./tests/tests.module').then((m) => m.TestsModule),
    title: 'App | My Test Detail',
    data: { personalTests: true },
    canActivate: [AuthActivate],
  },

  {
    path: 'test-create',
    component: TestFormComponent,
    title: 'App | Create test',
    canActivate: [AuthActivate],
    canDeactivate: [AuthDeactivate],
    data: { testType: 'create' },
  },
];

export const AppRoutingModule = RouterModule.forRoot(routes);
