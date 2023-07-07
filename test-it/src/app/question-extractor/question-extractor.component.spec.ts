import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuestionExtractorComponent } from './question-extractor.component';

describe('QuestionExtractorComponent', () => {
  let component: QuestionExtractorComponent;
  let fixture: ComponentFixture<QuestionExtractorComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [QuestionExtractorComponent]
    });
    fixture = TestBed.createComponent(QuestionExtractorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
