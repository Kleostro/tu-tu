import { Injectable, signal, TemplateRef } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ModalService {
  public isModalShow = signal(false);
  public content = signal<TemplateRef<unknown> | null>(null);
  public modalTitle = signal('');

  public openModal(content: TemplateRef<unknown>, title: string): void {
    this.content.set(content);
    this.modalTitle.set(title);
    this.isModalShow.set(true);
    document.body.style.overflowY = 'hidden';
  }

  public closeModal(): void {
    this.content.set(null);
    this.modalTitle.set('');
    this.isModalShow.set(false);
    document.body.style.overflowY = '';
  }
}
