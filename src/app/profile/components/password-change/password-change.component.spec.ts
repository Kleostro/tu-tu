import { provideHttpClient } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MessageService } from 'primeng/api';

import { UserMessageService } from '@/app/shared/services/userMessage/user-message.service';

import { PasswordChangeComponent } from './password-change.component';

describe('PasswordChangeComponent', () => {
  let component: PasswordChangeComponent;
  let fixture: ComponentFixture<PasswordChangeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PasswordChangeComponent],
      providers: [
        provideHttpClient(),
        {
          provide: UserMessageService,
          useValue: {
            showSuccessMessage: jest.fn(),
            showErrorMessage: jest.fn(),
            showInfoMessage: jest.fn(),
            showWarningMessage: jest.fn(),
          },
        },
        { provide: MessageService, useValue: {} },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(PasswordChangeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
