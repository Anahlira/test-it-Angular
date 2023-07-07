import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { AuthActivate } from './guards';
import { HomeComponent } from './home/home.component';
import { SignupComponent } from './signup/signup.component';
import { TestCreateComponent } from './tests/components';

const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: '/home' },

  {
    path: 'home',
    component: HomeComponent,
    title: 'App | Home',
    canActivate: [AuthActivate],
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
    canActivate: [AuthActivate],
  },

  {
    path: 'test-create',
    component: TestCreateComponent,
    title: 'App | Create test',
    canActivate: [AuthActivate],
  },
];

export const AppRoutingModule = RouterModule.forRoot(routes);
