import { provideHttpClient } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';

import { TripStationsService } from './trip-stations.service';

describe('TripStationsService', () => {
  let service: TripStationsService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient()],
    });
    service = TestBed.inject(TripStationsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
