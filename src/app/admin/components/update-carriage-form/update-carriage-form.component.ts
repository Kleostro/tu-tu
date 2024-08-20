import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  effect,
  inject,
  input,
  OnDestroy,
  OnInit,
  signal,
} from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

import { ButtonModule } from 'primeng/button';
import { InputNumberModule } from 'primeng/inputnumber';
import { RippleModule } from 'primeng/ripple';
import { debounceTime, distinctUntilChanged, map, Subscription, take } from 'rxjs';

import { CarriageService } from '@/app/api/carriagesService/carriage.service';
import { Carriage } from '@/app/api/models/carriage';
import { ModalService } from '@/app/shared/services/modal/modal.service';
import { USER_MESSAGE } from '@/app/shared/services/userMessage/constants/user-messages';
import { UserMessageService } from '@/app/shared/services/userMessage/user-message.service';

import { CarriageComponent } from '../carriage/carriage.component';

@Component({
  selector: 'app-update-carriage-form',
  standalone: true,
  imports: [ReactiveFormsModule, InputNumberModule, ButtonModule, RippleModule, CarriageComponent],
  templateUrl: './update-carriage-form.component.html',
  styleUrl: './update-carriage-form.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UpdateCarriageFormComponent implements OnInit, OnDestroy {
  private fb = inject(FormBuilder);
  private modalService = inject(ModalService);
  private userMessageService = inject(UserMessageService);
  private carriageService = inject(CarriageService);
  private cdr = inject(ChangeDetectorRef);

  public carriage = input<Carriage | null>(null);

  private subsciption = new Subscription();
  public currentCarriage = signal<Carriage | null>(null);
  public isUpdating = signal(false);
  public carriageForm = this.fb.nonNullable.group({
    rows: [0, [Validators.required.bind(this), Validators.min(1)]],
    leftSeats: [0, [Validators.required.bind(this), Validators.min(1)]],
    rightSeats: [0, [Validators.required.bind(this), Validators.min(1)]],
  });

  constructor() {
    effect(() => this.currentCarriage.set(this.carriage()), { allowSignalWrites: true });
  }

  public redrawCurrentCarriage(formValue: Partial<Carriage>): void {
    const { rows, leftSeats, rightSeats } = formValue;
    const currentCarriage = this.currentCarriage();
    if (currentCarriage) {
      currentCarriage.rows = rows ?? currentCarriage.rows;
      currentCarriage.leftSeats = leftSeats ?? currentCarriage.leftSeats;
      currentCarriage.rightSeats = rightSeats ?? currentCarriage.rightSeats;
      this.currentCarriage.set({ ...currentCarriage });
      this.cdr.detectChanges();
    }
  }

  public submit(): void {
    this.carriageForm.markAsTouched();
    this.carriageForm.updateValueAndValidity();
    const updatedCarriage = {
      code: this.carriage()?.code ?? '',
      name: this.carriage()?.name ?? '',
      rows: this.carriageForm.controls.rows.value,
      leftSeats: this.carriageForm.controls.leftSeats.value,
      rightSeats: this.carriageForm.controls.rightSeats.value,
    };

    if (this.carriageForm.valid) {
      this.isUpdating.set(true);
      this.subsciption.add(
        this.carriageService.updateCarriage(updatedCarriage).subscribe({
          next: () => this.submitSuccessHandler(),
        }),
      );
    }
  }

  private submitSuccessHandler(): void {
    this.carriageService
      .getCarriages()
      .pipe(take(1))
      .subscribe((carriages) => {
        this.carriageService.allCarriages.set(carriages);
      });
    this.isUpdating.set(false);
    this.modalService.closeModal();
    this.userMessageService.showSuccessMessage(USER_MESSAGE.CARRIAGE_UPDATED_SUCCESSFULLY);
  }

  public ngOnInit(): void {
    this.carriageForm.patchValue({
      rows: this.carriage()?.rows,
      leftSeats: this.carriage()?.leftSeats,
      rightSeats: this.carriage()?.rightSeats,
    });

    this.subsciption.add(
      this.carriageForm.valueChanges
        .pipe(
          debounceTime(500),
          distinctUntilChanged(),
          map((value) => this.redrawCurrentCarriage(value)),
        )
        .subscribe(),
    );
  }

  public ngOnDestroy(): void {
    this.subsciption.unsubscribe();
  }
}
