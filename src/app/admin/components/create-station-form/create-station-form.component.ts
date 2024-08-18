import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  computed,
  inject,
  input,
  OnDestroy,
  OnInit,
  signal,
} from '@angular/core';
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
import { ToastModule } from 'primeng/toast';
import { Subscription } from 'rxjs';

import { NewStation, Station } from '@/app/api/models/stations';
import { StationsService } from '@/app/api/stationsService/stations.service';
import { USER_MESSAGE } from '@/app/shared/services/userMessage/constants/user-messages';
import { UserMessageService } from '@/app/shared/services/userMessage/user-message.service';

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
    ToastModule,
    AutoCompleteModule,
    FormsModule,
  ],
  templateUrl: './create-station-form.component.html',
  styleUrl: './create-station-form.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreateStationFormComponent implements OnInit, OnDestroy {
  private fb = inject(FormBuilder);
  private mapService = inject(MapService);
  private stationsService = inject(StationsService);
  private userMessageService = inject(UserMessageService);
  private subscription = new Subscription();
  private cdr = inject(ChangeDetectorRef);

  public allStations = input.required<Station[]>();

  public isStationCreated = signal(false);
  public allStationNames = computed(() => this.allStations().map((station) => station.city));
  public filteredCountries: string[] = [];

  public createStationForm = this.fb.nonNullable.group({
    city: ['', [Validators.required.bind(this)]],
    latitude: [0, [Validators.required.bind(this)]],
    longitude: [0, [Validators.required.bind(this)]],
    connections: new FormArray([this.addConnection()]),
  });

  public filterCountry(event: { originalEvent: Event; query: string }): void {
    this.filteredCountries = [];

    this.allStationNames()?.forEach((city) => {
      if (city.toLowerCase().includes(event.query.toLowerCase())) {
        this.filteredCountries.push(city);
      }
    });
  }

  public addConnection(name = ''): FormGroup<{
    connection: FormControl<string>;
  }> {
    const connectionControl = this.fb.nonNullable.group(
      {
        connection: [name],
      },
      { updateOn: 'blur' },
    );
    this.subscription.add(
      connectionControl.valueChanges.subscribe((value) => {
        if (value.connection && this.allStationNames()?.includes(value.connection)) {
          this.createStationForm.controls.connections.push(this.addConnection());
        }
      }),
    );
    return connectionControl;
  }

  public getValidFormData(): NewStation {
    const { city, latitude, longitude, connections } = this.createStationForm.getRawValue();
    return {
      city,
      latitude,
      longitude,
      relations: connections
        .map((connection) => this.allStations().find((station) => station.city === connection.connection)?.id)
        .filter((id): id is number => id !== undefined),
    };
  }

  public submitForm(): void {
    this.createStationForm.markAllAsTouched();
    this.createStationForm.updateValueAndValidity();

    if (!this.createStationForm.valid) {
      return;
    }

    this.isStationCreated.set(true);
    this.subscription.add(
      this.stationsService.isStationInCity(this.createStationForm.getRawValue().city).subscribe({
        next: (isStationInCity) => {
          if (isStationInCity) {
            this.submitErrorHandler(new Error(USER_MESSAGE.STATION_EXISTS));
            return;
          }
          this.stationsService.createNewStation(this.getValidFormData()).subscribe({
            next: this.submitSuccessHandler.bind(this),
            error: this.submitErrorHandler.bind(this),
          });
        },
      }),
    );
  }

  private submitSuccessHandler(): void {
    this.subscription.add(
      this.stationsService.getStations().subscribe((stations) => {
        this.stationsService.allStations.next(stations);
      }),
    );

    this.mapService.createNewMarker({
      city: this.createStationForm.getRawValue().city,
      lat: this.createStationForm.getRawValue().latitude,
      lng: this.createStationForm.getRawValue().longitude,
    });

    this.resetForm();
    this.userMessageService.showSuccessMessage(USER_MESSAGE.STATION_CREATED_SUCCESSFULLY);
  }

  private submitErrorHandler(error: Error): void {
    this.resetForm();
    this.userMessageService.showErrorMessage(error.message);
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
        this.cdr.detectChanges();
      }),
    );
  }

  private initConnections(lngLat: { lng: number; lat: number }): void {
    this.createStationForm.controls.connections.controls = [];
    this.stationsService.findStationByLngLat(lngLat)?.connectedTo.forEach(({ id }) => {
      const stationById = this.allStations().find((station) => station.id === id);
      if (stationById) {
        this.createStationForm.controls.connections.controls.push(this.addConnection(stationById.city));
      }
    });

    this.createStationForm.controls.connections.controls.push(this.addConnection());
  }

  public ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
