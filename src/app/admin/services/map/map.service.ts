import { Injectable } from '@angular/core';

import { Marker, Popup } from 'maplibre-gl';
import { BehaviorSubject, Subject } from 'rxjs';

import makeFirstLetterUppercase from '@/app/shared/utils/makeFirstLetterUppercase';

import { MARKER_PARAMS } from '../../constants/initial-map-state';
import createNewPopupOffsets from '../../utils/createNewPopupOffsets';

@Injectable({
  providedIn: 'root',
})
export class MapService {
  private lngLat = new BehaviorSubject({ lng: 0, lat: 0 });
  public newMarker = new BehaviorSubject<Marker | null>(null);
  private removedMarkerLngLat = new Subject<{ lng: number; lat: number }>();

  public createNewMarker({ city, lng, lat }: { city: string; lng: number; lat: number }): void {
    const newMarker = new Marker({ color: MARKER_PARAMS.color })
      .setLngLat([lng, lat])
      .setPopup(
        new Popup({ className: 'map-popup' })
          .setLngLat({ lng, lat })
          .setText(makeFirstLetterUppercase(city))
          .setOffset(createNewPopupOffsets())
          .setMaxWidth(MARKER_PARAMS.max_width),
      );
    this.newMarker.next(newMarker);
  }

  public getLngLat(): BehaviorSubject<{ lng: number; lat: number }> {
    return this.lngLat;
  }

  public setLngLat({ lng, lat }: { lng: number; lat: number }): void {
    this.lngLat.next({ lng, lat });
  }

  public getRemovedMarker(): Subject<{ lng: number; lat: number }> {
    return this.removedMarkerLngLat;
  }

  public removeMarker(lngLat: { lng: number; lat: number }): void {
    this.removedMarkerLngLat.next(lngLat);
  }
}
