import { TestBed } from '@angular/core/testing';

import { ResultListService } from './result-list.service';

describe('ResultListService', () => {
  let service: ResultListService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ResultListService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
