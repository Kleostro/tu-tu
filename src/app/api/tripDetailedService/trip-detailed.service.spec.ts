import { provideHttpClient } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';

import { TripDetailedService } from './trip-detailed.service';

describe('TripDetailedService', () => {
  let service: TripDetailedService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient()],
    });
    service = TestBed.inject(TripDetailedService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
