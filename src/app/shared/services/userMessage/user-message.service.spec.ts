import { TestBed } from '@angular/core/testing';

import { MessageService } from 'primeng/api';

import { UserMessageService } from './user-message.service';

describe('UserMessageService', () => {
  let service: UserMessageService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [MessageService],
    });
    service = TestBed.inject(UserMessageService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
