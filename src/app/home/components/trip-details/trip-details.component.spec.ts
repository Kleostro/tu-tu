import { DatePipe } from '@angular/common';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TimelineModule } from 'primeng/timeline';

import { CurrentRide } from '@/app/shared/models/currentRide.model';

import { TripDetailsComponent } from './trip-details.component';

describe('TripDetailsComponent', () => {
  let component: TripDetailsComponent;
  let fixture: ComponentFixture<TripDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TripDetailsComponent, TimelineModule, DatePipe],
    }).compileComponents();

    fixture = TestBed.createComponent(TripDetailsComponent);
    component = fixture.componentInstance;

    component.trip = {
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
