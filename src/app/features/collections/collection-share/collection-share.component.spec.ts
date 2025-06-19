import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CollectionShareComponent } from './collection-share.component';

describe('CollectionShareComponent', () => {
  let component: CollectionShareComponent;
  let fixture: ComponentFixture<CollectionShareComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CollectionShareComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CollectionShareComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
