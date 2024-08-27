import { provideHttpClient } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';

import { UserMessageService } from '@/app/shared/services/userMessage/user-message.service';

import { FilterService } from './filter.service';

describe('FilterService', () => {
  let service: FilterService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        {
          provide: UserMessageService,
          useValue: {
            showErrorMessage: jest.fn(),
          },
        },
      ],
    });
    service = TestBed.inject(FilterService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
