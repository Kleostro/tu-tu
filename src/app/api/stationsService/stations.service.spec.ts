import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { NewStation, Station } from '../models/stations';
import { StationsService } from './stations.service';

describe('StationsService', () => {
  let service: StationsService;
  let httpTestController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(StationsService);
    httpTestController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTestController.verify();
  });
  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should correctly get all stations', (done) => {
    const mockStationsArray: Station[] = [
      {
        id: 1,
        city: 'Test',
        latitude: 12345,
        longitude: 54321,
        connectedTo: [{ id: 1, distance: 2 }],
      },
    ];

    service.getStations().subscribe((res) => {
      expect(res).toEqual(mockStationsArray);
      done();
    });

    const req = httpTestController.expectOne('station');
    expect(req.request.method).toBe('GET');
    req.flush(mockStationsArray);
  });

  it('should correctly create new station', (done) => {
    const mockNewStation: NewStation = {
      city: 'testCity',
      latitude: 1423,
      longitude: 4132,
      relations: [5, 3, 1],
    };
    const mockResponse = { id: 1 };

    service.createNewStation(mockNewStation).subscribe((res) => {
      expect(res).toEqual(mockResponse);
      done();
    });

    const req = httpTestController.expectOne('station');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(mockNewStation);
    req.flush(mockResponse);
  });

  it('should correctly delete station', (done) => {
    const mockStationId = 1;

    service.deleteStation(mockStationId).subscribe((res) => {
      expect(res).toBeNull();
      done();
    });

    const req = httpTestController.expectOne(`station/${mockStationId}`);
    expect(req.request.method).toBe('DELETE');
    req.flush(null);
  });
});
