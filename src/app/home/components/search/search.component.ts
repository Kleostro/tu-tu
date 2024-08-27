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
import { UserMessageService } from '@/app/shared/services/userMessage/user-message.service';

import { TripData } from '../../models/tripData';
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
  private filterService = inject(FilterService);
  private citiesService = inject(CitiesService);
  private stationsService = inject(StationsService);
  private fb: FormBuilder = inject(FormBuilder);
  private userMessageService = inject(UserMessageService);
  public stations: Station[] = [];
  public filteredCities: string[] = [];

  public minDate: Date = new Date();
  public timeSelected = false;

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
      const stations = await firstValueFrom(this.stationsService.getStations());
      const newCities = await firstValueFrom(this.citiesService.getCities());
      this.stations = [...stations, ...newCities];
    } catch {
      this.userMessageService.showErrorMessage('Connection is lost!');
    }
  }

  public filterCity(event: AutoCompleteCompleteEvent): void {
    const query = event.query.toLowerCase();
    this.filteredCities = this.stations
      .filter(({ city }) => city.toLowerCase().includes(query))
      .map(({ city }) => city);
  }

  public onDateSelect(event: Date): void {
    this.timeSelected = !!event;
  }

  public onSubmit(): void {
    if (this.tripForm.valid) {
      const startCityData = this.stations.find((station) => station.city === this.tripForm.value.startCity)!;
      const endCityData = this.stations.find((station) => station.city === this.tripForm.value.endCity)!;
      const tripData: TripData = {
        startCity: startCityData,
        endCity: endCityData,
        tripDate: new Date(this.tripForm.controls['tripDate'].value ?? ''),
      };

      this.tripData$$.set(tripData);
      const searchPrms = {
        fromLatitude: startCityData.latitude,
        toLatitude: endCityData.latitude,
        fromLongitude: startCityData.longitude,
        toLongitude: endCityData.longitude,
        time: this.tripForm.value.tripDate!,
      };

      this.filterService.startSearch(searchPrms);
    }
  }
}
