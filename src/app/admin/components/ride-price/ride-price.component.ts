import { CurrencyPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, EventEmitter, inject, input, OnInit, Output, signal } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

import { ButtonModule } from 'primeng/button';
import { InputNumberModule } from 'primeng/inputnumber';
import { RippleModule } from 'primeng/ripple';

import { RidePrice } from '../../models/ride.model';

@Component({
  selector: 'app-ride-price',
  standalone: true,
  imports: [CurrencyPipe, ButtonModule, RippleModule, InputNumberModule, ReactiveFormsModule],
  providers: [CurrencyPipe],
  templateUrl: './ride-price.component.html',
  styleUrl: './ride-price.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RidePriceComponent implements OnInit {
  private fb = inject(FormBuilder);
  public priceList = input<RidePrice[] | null>(null);
  public isPriceEdited = input(false);
  public isEdit = signal(false);

  public priceForm = this.fb.group({
    priceList: this.fb.array<FormGroup<{ price: FormControl<number> }>>([]),
  });

  @Output() public priceChanged = new EventEmitter<RidePrice[]>();

  public ngOnInit(): void {
    this.priceForm.controls.priceList.clear();
    this.priceList()?.forEach((price) => {
      this.priceForm.controls.priceList.push(
        this.fb.nonNullable.group({
          price: [price.price, [Validators.required.bind(this), Validators.min(0.01)]],
        }),
      );
    });
  }

  public submit(): void {
    this.priceForm.markAsTouched();
    this.priceForm.updateValueAndValidity();

    if (!this.priceForm.valid) {
      return;
    }

    const priceList = this.priceList();

    if (priceList) {
      const updatedPriceList = priceList.map((price, index) => ({
        ...price,
        price: this.priceForm.controls.priceList.controls[index].controls.price.value,
      }));
      this.priceChanged.emit(updatedPriceList);
    }
  }
}
