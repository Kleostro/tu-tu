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
    CalendarModule,
  ],
  templateUrl: './search.component.html',
  styleUrl: './search.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SearchComponent implements OnInit {
  public tripForm!: FormGroup;
  public cities: string[] = ['New York', 'Los Angeles', 'Chicago', 'Houston', 'Phoenix'];
  public filteredCities: string[] = [];
  public minDate: Date = new Date();
  private fb: FormBuilder = inject(FormBuilder);

  public ngOnInit(): void {
    this.tripForm = this.fb.group({
      startCity: ['', Validators.required.bind(this)],
      endCity: ['', Validators.required.bind(this)],
      dateTime: ['', Validators.required.bind(this)],
    });
  }

  public filterCity(event: AutoCompleteCompleteEvent): void {
    const query = event.query.toLowerCase();
    this.filteredCities = this.cities.filter((city) => city.toLowerCase().includes(query));
  }

  public onSubmit(): void {}
}
