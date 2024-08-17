import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

import { map, Observable } from 'rxjs';

import { NewStation, Station } from '../models/stations';

@Injectable({
  providedIn: 'root',
})
export class StationsService {
  private httpClient = inject(HttpClient);
  private STATION_ENDPOINT = 'station';

  public getStations(): Observable<Station[]> {
    return this.httpClient.get<Station[]>(this.STATION_ENDPOINT);
  }

  public createNewStation(newStation: NewStation): Observable<{ id: number }> {
    return this.httpClient.post<{ id: number }>(this.STATION_ENDPOINT, newStation);
  }

  public deleteStation(id: number): Observable<void> {
    return this.httpClient.delete<void>(`${this.STATION_ENDPOINT}/${id}`);
  }

  public isStationInCity(station: string): Observable<boolean> {
    return this.getStations().pipe(
      map((stations) =>
        stations.some((stationFromList) => stationFromList.city.toLowerCase() === station.toLowerCase()),
      ),
    );
  }
}
