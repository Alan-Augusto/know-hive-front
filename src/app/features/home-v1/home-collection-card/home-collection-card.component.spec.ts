import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HomeCollectionCardComponent } from './home-collection-card.component';

describe('HomeCollectionCardComponent', () => {
  let component: HomeCollectionCardComponent;
  let fixture: ComponentFixture<HomeCollectionCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HomeCollectionCardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HomeCollectionCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
