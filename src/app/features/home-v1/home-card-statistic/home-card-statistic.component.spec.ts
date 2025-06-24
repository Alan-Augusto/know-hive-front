import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HomeCardStatisticComponent } from './home-card-statistic.component';

describe('HomeCardStatisticComponent', () => {
  let component: HomeCardStatisticComponent;
  let fixture: ComponentFixture<HomeCardStatisticComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HomeCardStatisticComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HomeCardStatisticComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
