import { TestBed } from '@angular/core/testing';

import { QuestionUserAccessService } from './question-user-access.service';

describe('QuestionUserAccessService', () => {
  let service: QuestionUserAccessService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(QuestionUserAccessService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
