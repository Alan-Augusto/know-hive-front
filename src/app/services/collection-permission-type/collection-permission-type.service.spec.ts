import { TestBed } from '@angular/core/testing';

import { CollectionPermissionTypeService } from './collection-permission-type.service';

describe('CollectionPermissionTypeService', () => {
  let service: CollectionPermissionTypeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CollectionPermissionTypeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
