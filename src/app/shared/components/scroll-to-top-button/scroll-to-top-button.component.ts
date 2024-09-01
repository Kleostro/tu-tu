import { ChangeDetectionStrategy, Component, ElementRef, HostListener, ViewChild } from '@angular/core';

import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';

import { SCROLL_TO_TOP_BUTTON_OFFSET } from './constants/constants';

@Component({
  selector: 'app-scroll-to-top-button',
  standalone: true,
  imports: [ButtonModule, RippleModule],
  templateUrl: './scroll-to-top-button.component.html',
  styleUrl: './scroll-to-top-button.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ScrollToTopButtonComponent {
  @ViewChild('scrollButton') private scrollButton?: ElementRef<HTMLButtonElement>;

  @HostListener('window:scroll')
  private toggleVisibility(): void {
    this.scrollButton?.nativeElement.classList.toggle('hidden', window.scrollY <= SCROLL_TO_TOP_BUTTON_OFFSET);
  }

  public scrollToTop(): void {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}
