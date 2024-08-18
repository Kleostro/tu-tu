import { Injectable } from '@angular/core';

import { Marker, Popup } from 'maplibre-gl';
import { BehaviorSubject, Subject } from 'rxjs';

import { Station } from '@/app/api/models/stations';
import makeFirstLetterToUppercase from '@/app/shared/utils/makeFirstLetterToUppercase';

import { MARKER_PARAMS } from '../../constants/initial-map-state';
import createNewPopupOffsets from '../../utils/createNewPopupOffsets';

@Injectable({
  providedIn: 'root',
})
export class MapService {
  private lngLat = new BehaviorSubject({ lng: 0, lat: 0 });
  private newMarker = new Subject<Marker>();

  public createNewMarker({ city, lng, lat }: { city: string; lng: number; lat: number }): void {
    this.newMarker.next(
      new Marker({ color: MARKER_PARAMS.color })
        .setLngLat([lng, lat])
        .setPopup(
          new Popup({ className: 'map-popup' })
            .setLngLat({ lng, lat })
            .setText(makeFirstLetterToUppercase(city))
            .setOffset(createNewPopupOffsets())
            .setMaxWidth(MARKER_PARAMS.max_width),
        ),
    );
  }

  public findStationByLngLat(stations: Station[], { lng, lat }: { lng: number; lat: number }): Station | null {
    return stations.find((station) => station.longitude === lng && station.latitude === lat) ?? null;
  }

  public getLngLat(): BehaviorSubject<{ lng: number; lat: number }> {
    return this.lngLat;
  }

  public setLngLat({ lng, lat }: { lng: number; lat: number }): void {
    this.lngLat.next({ lng, lat });
  }

  public getNewMarker(): Subject<Marker> {
    return this.newMarker;
  }
}
