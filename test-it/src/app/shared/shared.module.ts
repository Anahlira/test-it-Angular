import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ContainsDirective } from './contains.directive';
import { ChangeDirective } from './change.directive';

@NgModule({
  declarations: [ContainsDirective, ChangeDirective],
  imports: [CommonModule],
  exports: [ContainsDirective, ChangeDirective],
})
export class SharedModule {}
