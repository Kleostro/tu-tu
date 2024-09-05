import { DatePipe } from '@angular/common';
import { provideHttpClient } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, RouterModule } from '@angular/router';

import { ButtonModule } from 'primeng/button';
import { TimelineModule } from 'primeng/timeline';
import { of } from 'rxjs';

import { CurrentRide } from '@/app/shared/models/currentRide.model';

import { ResultItemComponent } from './result-item.component';

describe('ResultItemComponent', () => {
  let component: ResultItemComponent;
  let fixture: ComponentFixture<ResultItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RouterModule, TimelineModule, ButtonModule, ResultItemComponent],
      providers: [
        DatePipe,
        provideHttpClient(),
        {
          provide: ActivatedRoute,
          useValue: {
            queryParams: of({}),
            snapshot: { params: {} },
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ResultItemComponent);
    component = fixture.componentInstance;

    component.resultItem = {
      rideId: 1,
      routeId: 1,

      routeStartStation: 'routeStartStation',
      routeEndStation: 'routeEndStation',

      tripStartStation: 'tripStartStation',
      tripEndStation: 'tripEndStation',

      routeStartStationId: 1,
      routeEndStationId: 1,

      tripStartStationId: 1,
      tripEndStationId: 1,

      tripDepartureDate: '2023-10-01T08:14:00',
      tripArrivalDate: '2023-10-01T08:14:00',

      trainCarriages: {},

      carriages: [],
      carriageInfo: [],
      stationsInfo: [],
    } as CurrentRide;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
