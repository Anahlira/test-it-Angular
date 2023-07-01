import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TestsListComponent } from './tests-list.component';

describe('UsersComponent', () => {
  let component: TestsListComponent;
  let fixture: ComponentFixture<TestsListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TestsListComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TestsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
