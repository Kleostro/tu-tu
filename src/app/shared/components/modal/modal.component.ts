import { NgTemplateOutlet } from '@angular/common';
import { ChangeDetectionStrategy, Component, ElementRef, inject, ViewChild } from '@angular/core';

import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';

import { ModalService } from '../../services/modal/modal.service';

@Component({
  selector: 'app-modal',
  standalone: true,
  imports: [NgTemplateOutlet, ButtonModule, RippleModule],
  templateUrl: './modal.component.html',
  styleUrl: './modal.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ModalComponent {
  public modalService = inject(ModalService);
  @ViewChild('modalContent') public modalContent!: ElementRef;

  public outsideClick(event: Event): void {
    if (
      event.target &&
      event.target instanceof HTMLElement &&
      this.modalContent.nativeElement !== event.target &&
      this.modalContent.nativeElement instanceof HTMLElement &&
      !this.modalContent.nativeElement.contains(event.target)
    ) {
      this.modalService.closeModal();
    }
  }
}