import { provideHttpClient } from '@angular/common/http';
import { TemplateRef } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MessageService } from 'primeng/api';

import { RoutingService } from '@/app/core/services/routing/routing.service';
import { ResultListService } from '@/app/home/services/result-list/result-list.service';
import { CurrentRide } from '@/app/shared/models/currentRide.model';
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
    trainCarriages: {},
    carriages: [],
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
        provideHttpClient(),
        {
          provide: RoutingService,
          useValue: {
            currentRideId$$: jest.fn().mockReturnValue('1'),
            goBack: jest.fn(),
          },
        },
        ModalService,
        MessageService,
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(TripDetailedComponent);
    component = fixture.componentInstance;
    routingService = TestBed.inject(RoutingService) as jest.Mocked<RoutingService>;
    modalService = TestBed.inject(ModalService) as jest.Mocked<ModalService>;

    jest.spyOn(component, 'takeTabsCarriageType').mockReturnValue([{ name: 'Carriage 1', type: 'mockType' }]);
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
    component.tripModalContent = {} as TemplateRef<unknown>;
    component.openModal();

    expect(modalService.openModal).toHaveBeenCalledWith(component.tripModalContent, 'Route 1');
  });

  it('should call goBack on routingService', () => {
    component.goBack();
    expect(routingService.goBack).toHaveBeenCalled();
  });
});
