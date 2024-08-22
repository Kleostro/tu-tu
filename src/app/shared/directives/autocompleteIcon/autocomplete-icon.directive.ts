import { AfterViewInit, Directive, ElementRef, inject, Input } from '@angular/core';

import { AutoComplete } from 'primeng/autocomplete';

@Directive({
  selector: '[appAutocompleteIcon]',
  standalone: true,
})
export class AutocompleteIconDirective implements AfterViewInit {
  private autoComplete = inject(AutoComplete);
  @Input() public icon = '';

  public ngAfterViewInit(): void {
    // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
    const inputWrapper = (this.autoComplete.el as ElementRef<HTMLElement>).nativeElement.firstChild;
    if (!(inputWrapper instanceof HTMLDivElement)) {
      return;
    }
    const searchIcon = document.createElement('i');
    searchIcon.classList.add('pi', this.icon);
    searchIcon.style.left = '.75rem';
    searchIcon.style.color = 'blue';
    inputWrapper.appendChild(searchIcon);
    inputWrapper.classList.add('p-input-icon-left');
  }
}
