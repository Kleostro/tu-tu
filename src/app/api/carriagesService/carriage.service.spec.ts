import { provideHttpClient } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';

import { CarriageService } from './carriage.service';

describe('CarriageService', () => {
  let service: CarriageService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient()],
    });
    service = TestBed.inject(CarriageService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
