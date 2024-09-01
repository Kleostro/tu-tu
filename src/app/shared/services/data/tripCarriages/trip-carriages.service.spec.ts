import { provideHttpClient } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';

import { TripCarriagesService } from './trip-carriages.service';

describe('TripCarriagesService', () => {
  let service: TripCarriagesService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient()],
    });
    service = TestBed.inject(TripCarriagesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
