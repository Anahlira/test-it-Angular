import { Directive, ElementRef, Input } from '@angular/core';

@Directive({
  selector: '[changeTracker]',
  exportAs: 'changeTracker',
})
export class ChangeDirective {
  @Input() initialValue: string | undefined;

  constructor(private elementRef: ElementRef) {}

  ngOnInit(): void {
    this.initialValue = this.elementRef.nativeElement.value;
  }

  updateValue() {
    this.initialValue = this.elementRef.nativeElement.value;
  }

  isPristine() {
    return this.initialValue === this.elementRef.nativeElement.value;
  }
}
