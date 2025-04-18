import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ColorPreviewComponent } from './color-preview.component';

describe('ColorPreviewComponent', () => {
  let component: ColorPreviewComponent;
  let fixture: ComponentFixture<ColorPreviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ColorPreviewComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ColorPreviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
