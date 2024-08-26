import { provideHttpClient } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';

import { CitiesService } from './cities.service';

describe('CitiesService', () => {
  let service: CitiesService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient()],
    });
    service = TestBed.inject(CitiesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
