import { inject, Injectable } from '@angular/core';

import { MessageService } from 'primeng/api';

import { MESSAGE_DURATION } from './constants/constants';

@Injectable({
  providedIn: 'root',
})
export class UserMessageService {
  private messageService = inject(MessageService);

  public showSuccessMessage(message: string): void {
    this.messageService.add({
      severity: 'success',
      summary: 'Success',
      life: MESSAGE_DURATION,
      detail: message,
    });
  }

  public showErrorMessage(message: string): void {
    this.messageService.add({
      severity: 'error',
      summary: 'Error',
      life: MESSAGE_DURATION,
      detail: message,
    });
  }

  public showInfoMessage(message: string): void {
    this.messageService.add({
      severity: 'info',
      summary: 'Info',
      life: MESSAGE_DURATION,
      detail: message,
    });
  }

  public showWarningMessage(message: string): void {
    this.messageService.add({
      severity: 'warn',
      summary: 'Warning',
      life: MESSAGE_DURATION,
      detail: message,
    });
  }
}
