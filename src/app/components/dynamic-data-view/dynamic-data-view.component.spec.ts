import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DynamicDataViewComponent } from './dynamic-data-view.component';

describe('DynamicDataViewComponent', () => {
  let component: DynamicDataViewComponent;
  let fixture: ComponentFixture<DynamicDataViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DynamicDataViewComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DynamicDataViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
