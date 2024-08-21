import { AsyncPipe } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, OnDestroy, OnInit } from '@angular/core';

import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
import { Subscription } from 'rxjs';

import { CarriageService } from '@/app/api/carriagesService/carriage.service';
import { ModalService } from '@/app/shared/services/modal/modal.service';

import { CarriagesListComponent } from '../../components/carriages-list/carriages-list.component';
import { CreateCarriageFormComponent } from '../../components/create-carriage-form/create-carriage-form.component';

@Component({
  selector: 'app-carriages',
  standalone: true,
  imports: [CarriagesListComponent, ButtonModule, RippleModule, AsyncPipe, CreateCarriageFormComponent],
  templateUrl: './carriages.component.html',
  styleUrl: './carriages.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CarriagesComponent implements OnInit, OnDestroy {
  private cdr = inject(ChangeDetectorRef);
  public carriageService = inject(CarriageService);
  public modalService = inject(ModalService);

  private subsciption = new Subscription();

  public ngOnInit(): void {
    this.subsciption.add(
      this.carriageService.getCarriages().subscribe((carriages) => {
        this.carriageService.setAllCarriages(carriages);
        this.cdr.detectChanges();
      }),
    );
  }

  public ngOnDestroy(): void {
    this.subsciption.unsubscribe();
  }
}
