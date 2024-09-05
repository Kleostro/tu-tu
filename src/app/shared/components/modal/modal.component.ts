import { NgTemplateOutlet } from '@angular/common';
import { ChangeDetectionStrategy, Component, ElementRef, inject, ViewChild } from '@angular/core';

import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';

import { PositionDirective } from '../../directives/position/position.directive';
import { ModalService } from '../../services/modal/modal.service';

@Component({
  selector: 'app-modal',
  standalone: true,
  imports: [NgTemplateOutlet, ButtonModule, RippleModule, PositionDirective],
  templateUrl: './modal.component.html',
  styleUrl: './modal.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ModalComponent {
  public modalService = inject(ModalService);

  @ViewChild('modalDialog') public modalDialog!: ElementRef;

  public outsideClick(event: Event): void {
    if (
      event.target &&
      event.target instanceof HTMLElement &&
      this.modalDialog.nativeElement !== event.target &&
      this.modalDialog.nativeElement instanceof HTMLElement &&
      !this.modalDialog.nativeElement.contains(event.target)
    ) {
      this.modalService.closeModal();
    }
  }
}
