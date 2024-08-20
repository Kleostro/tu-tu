import { HttpClient } from '@angular/common/http';
import { computed, inject, Injectable, signal } from '@angular/core';

import { Observable, shareReplay, tap } from 'rxjs';

import { NewStation, Station } from '../models/stations';

@Injectable({
  providedIn: 'root',
})
export class StationsService {
  private httpClient = inject(HttpClient);
  private STATION_ENDPOINT = 'station';
  public allStations = signal<Station[]>([]);
  public allStationNames = computed(() => this.allStations().map((station) => station.city));

  public getStations(): Observable<Station[]> {
    return this.httpClient.get<Station[]>(this.STATION_ENDPOINT).pipe(
      shareReplay(1),
      tap((stations) => this.allStations.set(stations)),
    );
  }

  public createNewStation(newStation: NewStation): Observable<{ id: number }> {
    return this.httpClient.post<{ id: number }>(this.STATION_ENDPOINT, newStation);
  }

  public deleteStation(id: number): Observable<void> {
    return this.httpClient.delete<void>(`${this.STATION_ENDPOINT}/${id}`);
  }

  public isStationInCity(station: string): boolean {
    return this.allStations().some((stationFromList) => stationFromList.city.toLowerCase() === station.toLowerCase());
  }

  public findStationByLngLat({ lng, lat }: { lng: number; lat: number }): Station | null {
    return this.allStations().find((station) => station.longitude === lng && station.latitude === lat) ?? null;
  }

  public findStationById(id: number): Station | null {
    return this.allStations()?.find((station) => station.id === id) ?? null;
  }

  public collectedStationConnectionIds(connections: { connection: string }[]): number[] {
    return connections
      .map(({ connection }) => this.allStations().find((station) => station.city === connection)?.id)
      .filter((id): id is number => id !== undefined);
  }
}
