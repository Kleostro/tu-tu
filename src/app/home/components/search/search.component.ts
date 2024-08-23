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

import { TripData } from '../../models/tripData';
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
  public filteredCities: string[] = [];
  public minDate: Date = new Date();
  public timeSelected = false;
  public tripData$$ = signal<TripData | null>(null);

  private fb: FormBuilder = inject(FormBuilder);
  public stationsService = inject(StationsService);
  public stations: Station[] = [];

  public tripForm = this.fb.group({
    startCity: this.fb.control<string>('', [Validators.required.bind(this)]),
    endCity: this.fb.control<string>('', [Validators.required.bind(this)]),
    tripDate: this.fb.control<string>('', [Validators.required.bind(this)]),
  });

  public get tripData(): TripData | null {
    return this.tripData$$();
  }

  public ngOnInit(): void {
    firstValueFrom(this.stationsService.getStations()).then((stations) => {
      this.stations = stations;
    });
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
      const tripData: TripData = {
        startCity: this.tripForm.controls['startCity'].value ?? '',
        endCity: this.tripForm.controls['endCity'].value ?? '',
        tripDate: new Date(this.tripForm.controls['tripDate'].value ?? ''),
      };
      this.tripData$$.set(tripData);
    }
  }
}
