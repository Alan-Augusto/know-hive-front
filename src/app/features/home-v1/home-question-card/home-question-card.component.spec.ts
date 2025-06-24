import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HomeQuestionCardComponent } from './home-question-card.component';

describe('HomeQuestionCardComponent', () => {
  let component: HomeQuestionCardComponent;
  let fixture: ComponentFixture<HomeQuestionCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HomeQuestionCardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HomeQuestionCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
