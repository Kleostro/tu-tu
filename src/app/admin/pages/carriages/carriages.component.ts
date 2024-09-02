import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, OnDestroy, OnInit } from '@angular/core';

import { ButtonModule } from 'primeng/button';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { RippleModule } from 'primeng/ripple';
import { Subscription } from 'rxjs';

import { CarriageService } from '@/app/api/carriagesService/carriage.service';
import POSITION_DIRECTION from '@/app/shared/directives/position/constants/position.constants';
import { ModalService } from '@/app/shared/services/modal/modal.service';

import { CarriagesListComponent } from '../../components/carriages-list/carriages-list.component';
import { CreateCarriageFormComponent } from '../../components/create-carriage-form/create-carriage-form.component';

@Component({
  selector: 'app-carriages',
  standalone: true,
  imports: [CarriagesListComponent, ButtonModule, RippleModule, CreateCarriageFormComponent, ProgressSpinnerModule],
  templateUrl: './carriages.component.html',
  styleUrl: './carriages.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CarriagesComponent implements OnInit, OnDestroy {
  private cdr = inject(ChangeDetectorRef);
  public carriageService = inject(CarriageService);
  public modalService = inject(ModalService);

  private subsciption = new Subscription();

  public setParamsInModal(): void {
    this.modalService.position$$.set(POSITION_DIRECTION.CENTER_TOP);
  }

  public ngOnInit(): void {
    this.subsciption.add(
      this.carriageService.getCarriages().subscribe((carriages) => {
        this.carriageService.allCarriages.set(carriages);
        this.cdr.detectChanges();
      }),
    );
  }

  public ngOnDestroy(): void {
    this.subsciption.unsubscribe();
  }
}
