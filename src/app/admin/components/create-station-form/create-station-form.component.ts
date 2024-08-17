import { ChangeDetectionStrategy, Component, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputNumberModule } from 'primeng/inputnumber';
import { RippleModule } from 'primeng/ripple';
import { ToastModule } from 'primeng/toast';
import { map, Observable, of, Subscription, switchMap } from 'rxjs';

import { NewStation } from '@/app/api/models/stations';
import { StationsService } from '@/app/api/stationsService/stations.service';
import MESSAGE_STATUS from '@/app/shared/constants/message-status';

import { MapService } from '../../services/map/map.service';

@Component({
  selector: 'app-create-station-form',
  standalone: true,
  imports: [FloatLabelModule, InputNumberModule, ReactiveFormsModule, RippleModule, ButtonModule, ToastModule],
  providers: [MessageService],
  templateUrl: './create-station-form.component.html',
  styleUrl: './create-station-form.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreateStationFormComponent implements OnInit, OnDestroy {
  private fb = inject(FormBuilder);
  private mapService = inject(MapService);
  private stationsService = inject(StationsService);
  private messageService = inject(MessageService);
  private subscription = new Subscription();

  public isStationCreated = signal(false);

  private createStation(params: NewStation): Observable<{ id: number }> {
    return this.stationsService.createNewStation(params);
  }

  private createMarker(params: { city: string; lat: number; lng: number }): void {
    this.mapService.createNewMarker(params);
  }

  public createStationForm = this.fb.nonNullable.group({
    city: ['', [Validators.required.bind(this)]],
    latitude: [0, [Validators.required.bind(this)]],
    longitude: [0, [Validators.required.bind(this)]],
  });

  public submitForm(): void {
    this.createStationForm.markAllAsTouched();
    this.createStationForm.updateValueAndValidity();

    if (this.createStationForm.valid) {
      this.isStationCreated.set(true);
      const { city, latitude, longitude } = this.createStationForm.getRawValue();
      this.subscription.add(
        this.stationsService
          .isStationInCity(city)
          .pipe(
            switchMap((exists) =>
              exists
                ? of(null)
                : this.createStation({ city, latitude, longitude, relations: [] }).pipe(
                    map((id) => {
                      this.isStationCreated.set(false);
                      this.createStationForm.reset();
                      this.messageService.add({
                        severity: MESSAGE_STATUS.SUCCESS,
                        summary: 'Success!',
                        detail: `Station created with id: ${id.id}`,
                      });
                    }),
                  ),
            ),
            map((exists) => (exists ? of(null) : this.createMarker({ city, lat: latitude, lng: longitude }))),
          )
          .subscribe({
            error: (error: Error) => {
              this.isStationCreated.set(false);
              this.messageService.add({ severity: MESSAGE_STATUS.ERROR, summary: error.name, detail: error.message });
            },
          }),
      );
    }
  }

  public ngOnInit(): void {
    this.subscription.add(
      this.mapService.getLngLat().subscribe((lngLat) => {
        this.createStationForm.patchValue({ longitude: lngLat.lng, latitude: lngLat.lat });
      }),
    );
  }

  public ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
