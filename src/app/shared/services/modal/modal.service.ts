import { Injectable, signal, TemplateRef } from '@angular/core';

import POSITION_DIRECTION from '../../directives/position/constants/position.constants';
import ModalPositionType from '../../directives/position/models/position.model';

@Injectable({
  providedIn: 'root',
})
export class ModalService {
  public isModalShow$$ = signal(false);
  public content$$ = signal<TemplateRef<unknown> | null>(null);
  public modalTitle$$ = signal('');
  public contentWidth$$ = signal('80%');
  public position$$ = signal<ModalPositionType>(POSITION_DIRECTION.CENTER);

  public openModal(content: TemplateRef<unknown>, title = ''): void {
    this.content$$.set(content);
    this.modalTitle$$.set(title);
    this.isModalShow$$.set(true);
    document.body.style.overflowY = 'hidden';
  }

  public closeModal(): void {
    this.content$$.set(null);
    this.modalTitle$$.set('');
    this.isModalShow$$.set(false);
    this.contentWidth$$.set('80%');
    this.position$$.set(POSITION_DIRECTION.CENTER);
    document.body.style.overflowY = '';
  }
}
