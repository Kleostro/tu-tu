import { DatePipe } from '@angular/common';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TimelineModule } from 'primeng/timeline';

import { CurrentRide } from '../../service/result-list-service/result-list.service';
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
      startStation: 'City A',
      endStation: 'City B',
      rideId: '1',
      from: 'City A',
      fromId: '123',
      toId: '456',
      to: 'City B',
      departureDate: '2023-10-01T08:14:00',
      arrivalDate: '2023-10-01T18:51:00',
      carriageInfo: [
        { type: 'Type A', freeSeats: 10, price: '$100' },
        { type: 'Type B', freeSeats: 5, price: '$50' },
      ],
    } as CurrentRide;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
