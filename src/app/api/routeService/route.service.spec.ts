import { provideHttpClient } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';

import { RouteService } from './route.service';

describe('RouteService', () => {
  let service: RouteService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient()],
    });
    service = TestBed.inject(RouteService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
