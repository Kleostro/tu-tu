import { TemplateRef } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RoutingService } from '@/app/core/services/routing/routing.service';
import { CurrentRide } from '@/app/home/models/currentRide.model';
import { ResultListService } from '@/app/home/services/result-list/result-list.service';
import { ModalService } from '@/app/shared/services/modal/modal.service';

import { TripDetailedComponent } from './trip-detailed.component';

jest.mock('@/app/home/services/result-list/result-list.service');
jest.mock('@/app/core/services/routing/routing.service');
jest.mock('@/app/shared/services/modal/modal.service');

describe('TripDetailedComponent', () => {
  let component: TripDetailedComponent;
  let fixture: ComponentFixture<TripDetailedComponent>;
  let routingService: jest.Mocked<RoutingService>;
  let modalService: jest.Mocked<ModalService>;

  const mockCurrentRide: CurrentRide = {
    rideId: 1,
    routeId: 1,
    routeStartStation: 'Station A',
    routeEndStation: 'Station B',
    tripStartStation: 'Station C',
    tripEndStation: 'Station D',
    routeStartStationId: 101,
    routeEndStationId: 102,
    tripStartStationId: 103,
    tripEndStationId: 104,
    tripDepartureDate: '2023-01-01T10:00:00Z',
    tripArrivalDate: '2023-01-01T12:00:00Z',
    carriageInfo: [],
    stationsInfo: [],
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TripDetailedComponent],
      providers: [
        {
          provide: ResultListService,
          useValue: {
            currentResultList$$: jest.fn().mockReturnValue([mockCurrentRide]),
          },
        },
        {
          provide: RoutingService,
          useValue: {
            currentRideId$$: jest.fn().mockReturnValue('1'),
            goBack: jest.fn(),
          },
        },
        ModalService,
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(TripDetailedComponent);
    component = fixture.componentInstance;
    routingService = TestBed.inject(RoutingService) as jest.Mocked<RoutingService>;
    modalService = TestBed.inject(ModalService) as jest.Mocked<ModalService>;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set tripItem on ngOnInit', () => {
    component.ngOnInit();
    expect(component.tripItem).toEqual(mockCurrentRide);
  });

  it('should open modal when tripItem is present', () => {
    component.tripItem = mockCurrentRide;
    const mockEvent = new MouseEvent('click');
    jest.spyOn(mockEvent, 'stopPropagation');

    component.modalContent = {} as TemplateRef<unknown>;
    component.openModal(mockEvent);

    expect(mockEvent.stopPropagation).toHaveBeenCalled();
    expect(modalService.openModal).toHaveBeenCalledWith(component.modalContent, 'Route 1');
  });

  it('should not open modal when tripItem is null', () => {
    const mockEvent = new MouseEvent('click');
    jest.spyOn(mockEvent, 'stopPropagation');

    component.tripItem = null;
    component.openModal(mockEvent);

    expect(mockEvent.stopPropagation).toHaveBeenCalled();
    expect(modalService.openModal).not.toHaveBeenCalled();
  });

  it('should call goBack on routingService', () => {
    component.goBack();
    expect(routingService.goBack).toHaveBeenCalled();
  });
});
