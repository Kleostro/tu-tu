import { Directive, HostBinding, Input } from '@angular/core';

import { POSITION_OFFSETS } from './constants/position.constants';
import ModalPositionType from './models/position.model';

@Directive({
  selector: '[appPosition]',
  standalone: true,
})
export class PositionDirective {
  @Input() public position!: ModalPositionType;

  @HostBinding('style') public get hostStyle(): string {
    return this.calcOffsetsByPosition(this.position);
  }

  public calcOffsetsByPosition(position: ModalPositionType): string {
    return POSITION_OFFSETS[position] || POSITION_OFFSETS['center'];
  }
}
