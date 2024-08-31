import { provideHttpClient } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';

import { TrainCarriagesListService } from './train-carriages-list.service';

describe('TrainCarriagesListService', () => {
  let service: TrainCarriagesListService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [TrainCarriagesListService, provideHttpClient()],
    });
    service = TestBed.inject(TrainCarriagesListService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
