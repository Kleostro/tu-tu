import { Injectable, signal } from '@angular/core';

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
  public removedMarker = new Subject<Marker>();

  public markers = signal<Marker[]>([]);

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
    this.markers.update((markers) => [...markers, newMarker]);
  }

  public removeMarker(lngLat: { lng: number; lat: number }): void {
    const marker = this.markers().find((m) => m.getLngLat().lat === lngLat.lat && m.getLngLat().lng === lngLat.lng);
    if (marker) {
      this.removedMarker.next(marker);
    }
  }

  public getLngLat(): BehaviorSubject<{ lng: number; lat: number }> {
    return this.lngLat;
  }

  public setLngLat({ lng, lat }: { lng: number; lat: number }): void {
    this.lngLat.next({ lng, lat });
  }
}
