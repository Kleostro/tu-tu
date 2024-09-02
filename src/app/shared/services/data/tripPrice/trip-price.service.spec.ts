import { TestBed } from '@angular/core/testing';

import { TripPriceService } from './trip-price.service';

describe('TripPriceService', () => {
  let service: TripPriceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TripPriceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
