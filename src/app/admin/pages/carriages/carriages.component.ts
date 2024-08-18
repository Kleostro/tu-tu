import { AsyncPipe } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, OnDestroy, OnInit } from '@angular/core';

import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
import { Subscription } from 'rxjs';

import { CarriageService } from '@/app/api/carriagesService/carriage.service';

import { CarriagesListComponent } from '../../components/carriages-list/carriages-list.component';

@Component({
  selector: 'app-carriages',
  standalone: true,
  imports: [CarriagesListComponent, ButtonModule, RippleModule, AsyncPipe],
  templateUrl: './carriages.component.html',
  styleUrl: './carriages.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CarriagesComponent implements OnInit, OnDestroy {
  private carriageService = inject(CarriageService);

  private cdr = inject(ChangeDetectorRef);
  public allCarriages = this.carriageService.getCarriages();
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
