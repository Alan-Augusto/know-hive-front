import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ButtonColorComponent } from './button-color.component';

describe('ButtonColorComponent', () => {
  let component: ButtonColorComponent;
  let fixture: ComponentFixture<ButtonColorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ButtonColorComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ButtonColorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
