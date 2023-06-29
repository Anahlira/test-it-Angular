import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ContainsDirective } from "./contains.directive";


@NgModule({
  declarations: [
    ContainsDirective,
  ],
  imports: [CommonModule],
  exports: [
    ContainsDirective,
  ],
})
export class SharedModule {}
