import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

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
  ],
  templateUrl: './search.component.html',
  styleUrl: './search.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SearchComponent implements OnInit {
  public tripForm!: FormGroup;
  public filteredCities: string[] = [];
  public minDate: Date = new Date();
  public timeSelected = false;
  private fb: FormBuilder = inject(FormBuilder);
  public stationsService = inject(StationsService);
  public stations: Station[] = [];

  public ngOnInit(): void {
    this.tripForm = this.fb.group({
      startCity: ['', Validators.required.bind(this)],
      endCity: ['', Validators.required.bind(this)],
      tripDate: ['', Validators.required.bind(this)],
    });
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

  public onSubmit(): void {}
}
