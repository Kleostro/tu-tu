import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

import { AutoCompleteCompleteEvent, AutoCompleteModule } from 'primeng/autocomplete';
import { ButtonModule } from 'primeng/button';
import { CalendarModule } from 'primeng/calendar';
import { FloatLabelModule } from 'primeng/floatlabel';
import { IconFieldModule } from 'primeng/iconfield';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { InputIconModule } from 'primeng/inputicon';
import { firstValueFrom } from 'rxjs';

import { Station } from '@/app/api/models/stations';
import { StationsService } from '@/app/api/stationsService/stations.service';
import { AutocompleteIconDirective } from '@/app/shared/directives/autocompleteIcon/autocomplete-icon.directive';
import { USER_MESSAGE } from '@/app/shared/services/userMessage/constants/user-messages';
import { UserMessageService } from '@/app/shared/services/userMessage/user-message.service';

import { TripData } from '../../models/tripData.model';
import { CitiesService } from '../../services/cities/cities.service';
import { FilterService } from '../../services/filter/filter.service';
import { FilterComponent } from '../filter/filter.component';

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [
    ButtonModule,
    InputIconModule,
    IconFieldModule,
    AutoCompleteModule,
    InputGroupModule,
    InputGroupAddonModule,
    FloatLabelModule,
    ReactiveFormsModule,
    AutocompleteIconDirective,
    CalendarModule,
    FilterComponent,
  ],
  templateUrl: './search.component.html',
  styleUrl: './search.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SearchComponent implements OnInit {
  public filterService = inject(FilterService);
  private citiesService = inject(CitiesService);
  private stationsService = inject(StationsService);
  private fb = inject(FormBuilder);
  private userMessageService = inject(UserMessageService);
  public stations: Station[] = [];
  public filteredCities: string[] = [];
  private fakeCities: Station[] = [];
  public minDate: Date = new Date();

  public tripData$$ = signal<TripData | null>(null);

  public tripForm = this.fb.group({
    startCity: this.fb.control<string>('', [Validators.required.bind(this)]),
    endCity: this.fb.control<string>('', [Validators.required.bind(this)]),
    tripDate: this.fb.control<string>('', [Validators.required.bind(this)]),
  });

  public get tripData(): TripData | null {
    return this.tripData$$();
  }

  public async ngOnInit(): Promise<void> {
    try {
      this.stations = await firstValueFrom(this.stationsService.getStations());
      this.fakeCities = await firstValueFrom(this.citiesService.getCities());
    } catch {
      this.userMessageService.showErrorMessage(USER_MESSAGE.CONNECTION_LOST_ERROR);
    }
  }

  public filterCity(event: AutoCompleteCompleteEvent): void {
    const query = event.query.toLowerCase();
    const filteredCitiesSet = new Set(
      this.stations.filter(({ city }) => city.toLowerCase().includes(query)).map(({ city }) => city),
    );

    const fakeCities = this.fakeCities.filter(({ city }) => city.toLowerCase().includes(query));
    if (fakeCities.length) {
      const fakeCityNames = fakeCities.map(({ city }) => city);
      fakeCityNames.forEach((city) => filteredCitiesSet.add(city));
      this.stations = [...this.stations, ...fakeCities];
    }

    this.filteredCities = Array.from(filteredCitiesSet);
  }

  public onSubmit(): void {
    if (this.tripForm.valid) {
      const startCity = this.stations.find((station) => station.city === this.tripForm.value.startCity)!;
      const endCity = this.stations.find((station) => station.city === this.tripForm.value.endCity)!;
      const tripDate = new Date(this.tripForm.controls['tripDate'].value ?? '');
      if (startCity && endCity) {
        const tripData: TripData = {
          startCity,
          endCity,
          tripDate,
        };

        this.tripData$$.set(tripData);
        const searchPrms = {
          fromLatitude: startCity.latitude,
          toLatitude: endCity.latitude,
          fromLongitude: startCity.longitude,
          toLongitude: endCity.longitude,
          time: new Date(this.tripForm.value.tripDate!).getTime(),
        };
        this.filterService.startSearch(searchPrms);
      } else {
        this.userMessageService.showErrorMessage(USER_MESSAGE.NO_STATIONS_FOUND_ERROR);
      }
    }
  }
}
