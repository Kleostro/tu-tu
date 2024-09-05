import { provideHttpClient } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';

import { RideService } from './ride.service';

describe('RideService', () => {
  let service: RideService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient()],
    });
    service = TestBed.inject(RideService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
