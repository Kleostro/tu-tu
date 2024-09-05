import { provideHttpClient } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';

import { MessageService } from 'primeng/api';
import { of, Subject } from 'rxjs';

import { AuthService } from './auth.service';

describe('AuthService', () => {
  let service: AuthService;
  let routerEventsSubject: Subject<NavigationEnd>;

  beforeEach(() => {
    routerEventsSubject = new Subject();

    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        MessageService,
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: { queryParams: {} },
            queryParams: of({}),
          },
        },
        {
          provide: Router,
          useValue: {
            events: routerEventsSubject.asObservable(),
            navigate: jest.fn(),
          },
        },
        {
          provide: Location,
          useValue: {
            back: jest.fn(),
          },
        },
      ],
    });
    service = TestBed.inject(AuthService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should handle router events', () => {
    routerEventsSubject.next(new NavigationEnd(1, 'http://example.com', 'http://example.com'));
  });
});
