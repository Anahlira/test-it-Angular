import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TestsRoutingModule } from './tests-routing.module';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../shared/shared.module';
import { TestDetailComponent, TestEditComponent, TestsListComponent } from './components';

const components = [TestsListComponent, TestDetailComponent,TestEditComponent];
const pipes: any[] = [];

@NgModule({
  declarations: [...components, ...pipes],
  imports: [
    CommonModule,
    RouterModule,
    TestsRoutingModule,
    ReactiveFormsModule,
    SharedModule,
  ],
})
export class TestsModule {}
