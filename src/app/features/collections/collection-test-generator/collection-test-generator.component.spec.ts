import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CollectionTestGeneratorComponent } from './collection-test-generator.component';

describe('CollectionTestGeneratorComponent', () => {
  let component: CollectionTestGeneratorComponent;
  let fixture: ComponentFixture<CollectionTestGeneratorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CollectionTestGeneratorComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CollectionTestGeneratorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
