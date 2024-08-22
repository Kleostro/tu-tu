import { DatePipe } from '@angular/common';
import { provideHttpClient } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterModule } from '@angular/router';

import { ButtonModule } from 'primeng/button';
import { TimelineModule } from 'primeng/timeline';

import { CurrentRide } from '@/app/home/service/result-list-service/result-list.service';

import { ResultItemComponent } from './result-item.component';

describe('ResultItemComponent', () => {
  let component: ResultItemComponent;
  let fixture: ComponentFixture<ResultItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RouterModule, TimelineModule, ButtonModule, ResultItemComponent],
      providers: [DatePipe, provideHttpClient()],
    }).compileComponents();

    fixture = TestBed.createComponent(ResultItemComponent);
    component = fixture.componentInstance;

    component.resultItem = {
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
