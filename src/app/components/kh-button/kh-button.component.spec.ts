import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KhButtonComponent } from './kh-button.component';

describe('KhButtonComponent', () => {
  let component: KhButtonComponent;
  let fixture: ComponentFixture<KhButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [KhButtonComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(KhButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
