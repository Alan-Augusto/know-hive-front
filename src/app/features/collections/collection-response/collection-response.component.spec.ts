import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CollectionResponseComponent } from './collection-response.component';

describe('CollectionResponseComponent', () => {
  let component: CollectionResponseComponent;
  let fixture: ComponentFixture<CollectionResponseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CollectionResponseComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CollectionResponseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
