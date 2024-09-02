import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  effect,
  inject,
  input,
  OnDestroy,
  signal,
} from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AutoCompleteModule } from 'primeng/autocomplete';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
import { Subscription, take } from 'rxjs';

import { CarriageService } from '@/app/api/carriagesService/carriage.service';
import { RouteResponse } from '@/app/api/models/route';
import { RouteService } from '@/app/api/routeService/route.service';
import { StationsService } from '@/app/api/stationsService/stations.service';
import { USER_MESSAGE } from '@/app/shared/services/userMessage/constants/user-messages';
import { UserMessageService } from '@/app/shared/services/userMessage/user-message.service';

@Component({
  selector: 'app-route-form',
  standalone: true,
  imports: [ButtonModule, RippleModule, ReactiveFormsModule, AutoCompleteModule, FormsModule],
  templateUrl: './route-form.component.html',
  styleUrl: './route-form.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RouteFormComponent implements OnDestroy {
  private subscription = new Subscription();

  private stationsService = inject(StationsService);
  private carriageService = inject(CarriageService);
  private routeService = inject(RouteService);
  private userMessageService = inject(UserMessageService);
  private fb = inject(FormBuilder);
  private cdr = inject(ChangeDetectorRef);

  public currentRoute = input<RouteResponse | null>(null);

  public filteredStations = signal<string[]>([]);
  public filteredCarriages = signal<string[]>([]);
  public isRouteChanged = signal(false);
  public currentStationControl = signal<number>(0);

  public routeForm = this.fb.nonNullable.group({
    stations: new FormArray([this.addStation()]),
    carriages: new FormArray([this.addCarriage()]),
  });

  constructor() {
    effect(() => {
      this.routeForm.controls.stations.controls = [];
      this.routeForm.controls.carriages.controls = [];
      this.currentRoute()?.path.forEach((stationId) => {
        const station = this.stationsService.findStationById(stationId);
        if (station) {
          this.routeForm.controls.stations.controls.push(this.addStation(station.city));
        }
      });
      this.routeForm.controls.stations.controls.push(this.addStation());

      this.currentRoute()?.carriages.forEach((type) => {
        const carriage = this.carriageService.findCarriageByCode(type);
        if (carriage) {
          this.routeForm.controls.carriages.controls.push(this.addCarriage(carriage.name));
        }
      });
      this.routeForm.controls.carriages.controls.push(this.addCarriage());
      this.cdr.detectChanges();
    });
  }

  public addStation(name = ''): FormGroup<{
    station: FormControl<string>;
  }> {
    const stationControl = this.fb.nonNullable.group({ station: [name] }, { updateOn: 'blur' });
    this.subscription.add(
      stationControl.valueChanges.subscribe((value) => {
        if (value.station) {
          this.routeForm.controls.stations.push(this.addStation());
        }
      }),
    );
    return stationControl;
  }

  public addCarriage(name = ''): FormGroup<{
    carriage: FormControl<string>;
  }> {
    const carriageControl = this.fb.nonNullable.group({ carriage: [name] }, { updateOn: 'blur' });
    this.subscription.add(
      carriageControl.valueChanges.pipe(take(1)).subscribe((value) => {
        if (value.carriage) {
          this.routeForm.controls.carriages.push(this.addCarriage());
        }
      }),
    );
    return carriageControl;
  }

  private getPreviousControlValue(): string | null {
    const currentIndex = this.routeForm.controls.stations.controls.indexOf(
      this.routeForm.controls.stations.controls[this.currentStationControl()],
    );
    const previousIndex = currentIndex - 1;
    if (previousIndex >= 0) {
      const previousControl = this.routeForm.controls.stations.at(previousIndex);
      return previousControl.controls.station?.value ?? null;
    }
    return null;
  }

  public filterStations(event: { originalEvent: Event; query: string }): void {
    this.filteredStations.set([]);
    this.routeForm.controls.stations.updateValueAndValidity();
    this.removeStationControlsBelowCurrentControl();

    const stations: string[] = [];

    this.stationsService.allStationNames().forEach((city) => {
      if (city.toLowerCase().includes(event.query.toLowerCase())) {
        stations.push(city);
      }
    });

    const lastStationControlValue = this.getPreviousControlValue();
    if (lastStationControlValue) {
      const currentStation = this.stationsService.findStationByCity(lastStationControlValue);
      if (currentStation) {
        currentStation.connectedTo.forEach((connection) =>
          this.filteredStations.set([
            ...this.filteredStations(),
            this.stationsService.findStationById(connection.id)?.city ?? '',
          ]),
        );
      }
    } else {
      this.filteredStations.set(stations);
    }
  }

  public filterCarriages(event: { originalEvent: Event; query: string }): void {
    this.filteredCarriages.set([]);

    this.carriageService.allCarriageTypes().forEach((type) => {
      if (type.toLowerCase().includes(event.query.toLowerCase())) {
        this.filteredCarriages.set([...this.filteredCarriages(), type]);
      }
    });
  }

  public checkMinStations(): boolean {
    return this.routeForm.controls.carriages.getRawValue().filter((carriage) => carriage.carriage).length < 3;
  }

  public checkMinCarriages(): boolean {
    return this.routeForm.controls.stations.getRawValue().filter((station) => station.station).length < 3;
  }

  public submit(): void {
    this.routeForm.markAllAsTouched();
    this.routeForm.updateValueAndValidity();
    this.isRouteChanged.set(true);

    if (this.checkMinCarriages() || this.checkMinStations()) {
      this.userMessageService.showErrorMessage(USER_MESSAGE.ROUTE_CREATION_UPDATED_ERROR);
      this.isRouteChanged.set(false);
      return;
    }

    if (this.currentRoute()) {
      this.updateCurrentRoute();
    } else {
      this.createNewRoute();
    }
  }

  public collectedRouteData(): { path: number[]; carriages: string[] } {
    return {
      path: [
        ...this.stationsService.collectedStationIds(
          this.routeForm
            .getRawValue()
            .stations.map((station) => this.stationsService.findStationByCity(station.station)!),
        ),
      ].filter(Boolean),

      carriages: [...this.routeForm.getRawValue().carriages.map((carriage) => carriage.carriage)].filter(Boolean),
    };
  }

  private updateCurrentRoute(): void {
    this.subscription.add(
      this.routeService
        .updateRoute(this.currentRoute()!.id, this.collectedRouteData())
        .pipe(take(1))
        .subscribe(({ id }) => {
          if (id) {
            this.submitSuccessHandler(USER_MESSAGE.ROUTE_UPDATED_SUCCESSFULLY);
          } else {
            this.submitErrorHandler(USER_MESSAGE.ROUTE_UPDATED_ERROR);
          }
        }),
    );
  }

  private createNewRoute(): void {
    this.subscription.add(
      this.routeService
        .createRoute(this.collectedRouteData())
        .pipe(take(1))
        .subscribe(({ id }) => {
          if (id) {
            this.submitSuccessHandler(USER_MESSAGE.ROUTE_CREATED_SUCCESSFULLY);
          } else {
            this.submitErrorHandler(USER_MESSAGE.ROUTE_CREATED_ERROR);
          }
        }),
    );
  }

  private submitSuccessHandler(message: string): void {
    this.subscription.add(this.routeService.getAllRoutes().pipe(take(1)).subscribe());
    this.subscription.add(this.stationsService.getStations().pipe(take(1)).subscribe());
    this.subscription.add(
      this.carriageService
        .getCarriages()
        .pipe(take(1))
        .subscribe((carriages) => {
          this.carriageService.allCarriages.set(carriages);
          this.routeService.currentRoute.set(null);
          this.resetForm();
          this.userMessageService.showSuccessMessage(message);
        }),
    );
  }

  private submitErrorHandler(message: string): void {
    this.resetForm();
    this.userMessageService.showErrorMessage(message);
  }

  private resetForm(): void {
    this.isRouteChanged.set(false);
    this.routeForm.reset();
    const carriagesArray = this.routeForm.controls.carriages;
    while (carriagesArray.length > 1) {
      carriagesArray.removeAt(carriagesArray.length - 1);
    }

    const stationsArray = this.routeForm.controls.stations;
    while (stationsArray.length > 1) {
      stationsArray.removeAt(stationsArray.length - 1);
    }
  }

  private removeStationControlsBelowCurrentControl(): void {
    const stationsArray = this.routeForm.controls.stations.controls;
    stationsArray.splice(this.currentStationControl() + 1);
    this.routeForm.controls.stations.controls = stationsArray;
  }

  public ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
