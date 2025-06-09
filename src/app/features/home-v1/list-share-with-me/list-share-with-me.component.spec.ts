import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListShareWithMeComponent } from './list-share-with-me.component';

describe('ListShareWithMeComponent', () => {
  let component: ListShareWithMeComponent;
  let fixture: ComponentFixture<ListShareWithMeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListShareWithMeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListShareWithMeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
