import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuestionShareComponent } from './question-share.component';

describe('QuestionShareComponent', () => {
  let component: QuestionShareComponent;
  let fixture: ComponentFixture<QuestionShareComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [QuestionShareComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(QuestionShareComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
