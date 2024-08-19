import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  inject,
  OnDestroy,
  OnInit,
  signal,
} from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

import { ButtonModule } from 'primeng/button';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { RippleModule } from 'primeng/ripple';
import { debounceTime, distinctUntilChanged, map, Subscription } from 'rxjs';

import { CarriageService } from '@/app/api/carriagesService/carriage.service';
import { Carriage } from '@/app/api/models/carriage';
import { ModalService } from '@/app/shared/services/modal/modal.service';
import { USER_MESSAGE } from '@/app/shared/services/userMessage/constants/user-messages';
import { UserMessageService } from '@/app/shared/services/userMessage/user-message.service';

import { CarriageComponent } from '../carriage/carriage.component';

@Component({
  selector: 'app-create-carriage-form',
  standalone: true,
  imports: [ReactiveFormsModule, InputNumberModule, ButtonModule, RippleModule, CarriageComponent, InputTextModule],
  templateUrl: './create-carriage-form.component.html',
  styleUrl: './create-carriage-form.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreateCarriageFormComponent implements OnInit, OnDestroy {
  private fb = inject(FormBuilder);
  private cdr = inject(ChangeDetectorRef);
  private modalService = inject(ModalService);
  private userMessageService = inject(UserMessageService);
  private carriageService = inject(CarriageService);
  public newCarriage = signal<Carriage>({ name: '', rows: 0, leftSeats: 0, rightSeats: 0, code: '' });
  public isCreated = signal(false);
  private subsciption = new Subscription();
  public carriageForm = this.fb.nonNullable.group({
    name: ['', [Validators.required.bind(this)]],
    rows: [0, [Validators.required.bind(this), Validators.min(1)]],
    leftSeats: [0, [Validators.required.bind(this), Validators.min(1)]],
    rightSeats: [0, [Validators.required.bind(this), Validators.min(1)]],
  });

  public redrawCurrentCarriage(formValue: Partial<Carriage>): void {
    const { name, rows, leftSeats, rightSeats } = formValue;

    const currentCarriage = this.newCarriage();
    if (currentCarriage) {
      currentCarriage.name = name ?? currentCarriage.name;
      currentCarriage.rows = rows ?? currentCarriage.rows;
      currentCarriage.leftSeats = leftSeats ?? currentCarriage.leftSeats;
      currentCarriage.rightSeats = rightSeats ?? currentCarriage.rightSeats;
      this.newCarriage.set({ ...currentCarriage });
      this.cdr.detectChanges();
    }

    this.cdr.detectChanges();
  }

  public submit(): void {
    this.carriageForm.markAsTouched();
    this.carriageForm.updateValueAndValidity();
    const updatedCarriage = {
      name: this.carriageForm.controls.name.value ?? '',
      rows: this.carriageForm.controls.rows.value,
      leftSeats: this.carriageForm.controls.leftSeats.value,
      rightSeats: this.carriageForm.controls.rightSeats.value,
    };

    if (this.carriageForm.valid) {
      this.isCreated.set(true);
      this.carriageService.createCarriage(updatedCarriage).subscribe({
        next: () => this.submitSuccessHandler(),
      });
    }
  }

  private submitSuccessHandler(): void {
    this.carriageService.getCarriages().subscribe((carriages) => {
      this.carriageService.allCarriages.next([carriages[carriages.length - 1], ...carriages]);
    });
    this.isCreated.set(false);
    this.modalService.closeModal();
    this.userMessageService.showSuccessMessage(USER_MESSAGE.CARRIAGE_CREATED_SUCCESSFULLY);
  }

  public ngOnInit(): void {
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
