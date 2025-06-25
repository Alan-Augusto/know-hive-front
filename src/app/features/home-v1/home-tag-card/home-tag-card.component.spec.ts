import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HomeTagCardComponent } from './home-tag-card.component';

describe('HomeTagCardComponent', () => {
  let component: HomeTagCardComponent;
  let fixture: ComponentFixture<HomeTagCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HomeTagCardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HomeTagCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
