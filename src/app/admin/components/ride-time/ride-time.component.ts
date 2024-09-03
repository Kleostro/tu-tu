import { DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, EventEmitter, inject, input, Output, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

import { ButtonModule } from 'primeng/button';
import { CalendarModule } from 'primeng/calendar';
import { RippleModule } from 'primeng/ripple';

import { RidePath } from '../../models/ride.model';

@Component({
  selector: 'app-ride-time',
  standalone: true,
  imports: [ButtonModule, RippleModule, ReactiveFormsModule, CalendarModule, DatePipe],
  providers: [DatePipe],
  templateUrl: './ride-time.component.html',
  styleUrl: './ride-time.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RideTimeComponent {
  private fb = inject(FormBuilder);

  public to = input<string | null>(null);
  public from = input<string | null>(null);
  public isTimeEdited = input(true);

  public isEdit = signal(false);

  public minDate = new Date();
  public fromTime = false;
  public toTime = false;

  @Output() public timeChanged = new EventEmitter<RidePath>();

  public timeForm = this.fb.group({
    from: ['', [Validators.required.bind(this)]],
    to: ['', [Validators.required.bind(this)]],
  });

  public selectFromTime(event: Date): void {
    this.fromTime = !!event;
  }

  public selectToTime(event: Date): void {
    this.toTime = !!event;
  }
}
