import { ChangeDetectionStrategy, Component, inject, OnDestroy, OnInit, signal } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

import { AutoCompleteModule } from 'primeng/autocomplete';
import { ButtonModule } from 'primeng/button';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputNumberModule } from 'primeng/inputnumber';
import { RippleModule } from 'primeng/ripple';
import { Subscription, take } from 'rxjs';

import { NewStation } from '@/app/api/models/stations';
import { StationsService } from '@/app/api/stationsService/stations.service';
import { USER_MESSAGE } from '@/app/shared/services/userMessage/constants/user-messages';
import { UserMessageService } from '@/app/shared/services/userMessage/user-message.service';
import { capitalizeEachWord } from '@/app/shared/utils/capitalizeEachWord';

import { MapService } from '../../services/map/map.service';

@Component({
  selector: 'app-create-station-form',
  standalone: true,
  imports: [
    FloatLabelModule,
    InputNumberModule,
    ReactiveFormsModule,
    RippleModule,
    ButtonModule,
    AutoCompleteModule,
    FormsModule,
  ],
  templateUrl: './create-station-form.component.html',
  styleUrl: './create-station-form.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreateStationFormComponent implements OnInit, OnDestroy {
  private subscription = new Subscription();

  private fb = inject(FormBuilder);
  private mapService = inject(MapService);
  private stationsService = inject(StationsService);
  private userMessageService = inject(UserMessageService);

  public isStationCreated = signal(false);

  public filteredCountries: string[] = [];

  public createStationForm = this.fb.nonNullable.group({
    city: ['', [Validators.required.bind(this)]],
    latitude: [0, [Validators.required.bind(this), Validators.min(-90), Validators.max(90)]],
    longitude: [0, [Validators.required.bind(this), Validators.min(-180), Validators.max(180)]],
    connections: new FormArray([this.addConnection()]),
  });

  public filterCountry(event: { originalEvent: Event; query: string }): void {
    this.filteredCountries = [];

    this.stationsService.allStationNames().forEach((city) => {
      if (city.toLowerCase().includes(event.query.toLowerCase())) {
        this.filteredCountries.push(city);
      }
    });
  }

  public addConnection(name = ''): FormGroup<{
    connection: FormControl<string>;
  }> {
    const connectionControl = this.fb.nonNullable.group({ connection: [name] }, { updateOn: 'blur' });
    this.subscription.add(
      connectionControl.valueChanges.pipe(take(1)).subscribe((value) => {
        if (value.connection) {
          this.createStationForm.controls.connections.push(this.addConnection());
        }
      }),
    );
    return connectionControl;
  }

  public getValidFormData(): NewStation {
    const rawData = this.createStationForm.getRawValue();
    return {
      ...rawData,
      city: capitalizeEachWord(rawData.city),
      relations: this.stationsService.collectedStationConnectionIds(rawData.connections),
    };
  }

  public submitForm(): void {
    this.createStationForm.markAllAsTouched();
    this.createStationForm.updateValueAndValidity();

    if (!this.createStationForm.valid) {
      return;
    }

    this.isStationCreated.set(true);

    if (this.stationsService.isStationInCity(this.createStationForm.getRawValue().city)) {
      this.submitErrorHandler(USER_MESSAGE.STATION_EXISTS);
    } else {
      this.subscription.add(
        this.stationsService
          .createNewStation(this.getValidFormData())
          .pipe(take(1))
          .subscribe({
            next: ({ id }) => {
              if (id) {
                this.submitSuccessHandler();
              } else {
                this.submitErrorHandler(USER_MESSAGE.STATION_CREATED_ERROR);
              }
            },
            error: () => {
              this.submitErrorHandler(USER_MESSAGE.STATION_EXISTS);
            },
          }),
      );
    }
  }

  private submitSuccessHandler(): void {
    this.subscription.add(this.stationsService.getStations().pipe(take(1)).subscribe());
    this.mapService.createNewMarker({
      city: this.createStationForm.getRawValue().city,
      lat: this.createStationForm.getRawValue().latitude,
      lng: this.createStationForm.getRawValue().longitude,
    });
    this.resetForm();
    this.userMessageService.showSuccessMessage(USER_MESSAGE.STATION_CREATED_SUCCESSFULLY);
  }

  private submitErrorHandler(message: string): void {
    this.resetForm();
    this.userMessageService.showErrorMessage(message);
  }

  private resetForm(): void {
    this.isStationCreated.set(false);
    this.createStationForm.reset();
    const connectionsArray = this.createStationForm.controls.connections;
    while (connectionsArray.length > 1) {
      connectionsArray.removeAt(connectionsArray.length - 1);
    }
  }

  public ngOnInit(): void {
    this.subscription.add(
      this.mapService.getLngLat().subscribe((lngLat) => {
        this.createStationForm.patchValue({
          longitude: lngLat.lng,
          latitude: lngLat.lat,
          city: this.stationsService.findStationByLngLat(lngLat)?.city,
        });

        this.initConnections(lngLat);
      }),
    );
  }

  private initConnections(lngLat: { lng: number; lat: number }): void {
    this.createStationForm.controls.connections.controls = [];
    this.stationsService.findStationByLngLat(lngLat)?.connectedTo.forEach(({ id }) => {
      const city = this.stationsService.findStationById(id)?.city;
      if (city) {
        this.createStationForm.controls.connections.controls.push(this.addConnection(city));
      }
    });
    this.createStationForm.controls.connections.controls.push(this.addConnection());
  }

  public ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
