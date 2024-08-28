import { DatePipe } from '@angular/common';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TimelineModule } from 'primeng/timeline';

import { calculateDuration } from '@/app/shared/utils/calculateDuration';

import { TripTimelineComponent } from './trip-timeline.component';

jest.mock('@/app/shared/utils/calculateDuration', () => ({
  calculateDuration: jest.fn(),
}));

describe('TripTimelineComponent', () => {
  let component: TripTimelineComponent;
  let fixture: ComponentFixture<TripTimelineComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TimelineModule, TripTimelineComponent],
      declarations: [],
      providers: [DatePipe],
    }).compileComponents();

    fixture = TestBed.createComponent(TripTimelineComponent);
    component = fixture.componentInstance;

    component.departureDate = '2023-01-01T10:00:00';
    component.arrivalDate = '2023-01-01T12:00:00';
    component.startStation = 'Station A';
    component.endStation = 'Station B';
    component.dateFormat = 'MMMM dd hh:mm';
  });

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should set data correctly on initialization', () => {
    component.departureDate = '2023-01-01T10:00:00';
    component.arrivalDate = '2023-01-01T12:00:00';
    component.startStation = 'Station A';
    component.endStation = 'Station B';
    component.dateFormat = 'MMMM dd hh:mm';
    const mockDuration = '2 hours';
    (calculateDuration as jest.Mock).mockReturnValue(mockDuration);

    fixture.detectChanges();

    expect(component.events).toEqual([
      { date: new Date('2023-01-01T10:00:00'), city: 'Station A', dateFormat: 'MMMM dd hh:mm' },
      { duration: mockDuration },
      { date: new Date('2023-01-01T12:00:00'), city: 'Station B', dateFormat: 'MMMM dd hh:mm' },
    ]);

    expect(calculateDuration).toHaveBeenCalledWith(new Date('2023-01-01T10:00:00'), new Date('2023-01-01T12:00:00'));
  });
});
