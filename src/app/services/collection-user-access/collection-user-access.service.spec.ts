import { TestBed } from '@angular/core/testing';

import { CollectionUserAccessService } from './collection-user-access.service';

describe('CollectionUserAccessService', () => {
  let service: CollectionUserAccessService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CollectionUserAccessService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
