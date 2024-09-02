import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  inject,
  input,
  OnDestroy,
  OnInit,
  signal,
  ViewChild,
} from '@angular/core';

import { Map, Marker, NavigationControl } from 'maplibre-gl';
import { SkeletonModule } from 'primeng/skeleton';
import { Subscription } from 'rxjs';

import { Station } from '@/app/api/models/stations';
import { StationsService } from '@/app/api/stationsService/stations.service';
import ENVIRONMENTS from '@/environment/environment';

import { INITIAL_MAP_STATE, LINE_LAYER } from '../../constants/initial-map-state';
import { MapService } from '../../services/map/map.service';

@Component({
  selector: 'app-map',
  standalone: true,
  imports: [SkeletonModule],
  templateUrl: './map.component.html',
  styleUrl: './map.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MapComponent implements OnInit, AfterViewInit, OnDestroy {
  private subscription = new Subscription();

  private mapService = inject(MapService);
  private stationsService = inject(StationsService);

  private map: Map | null = null;
  private lastClickedMarker: Marker | null = null;

  public allStations = input.required<Station[]>();

  public isMapLoaded = signal(false);

  @ViewChild('mapContainer')
  private mapContainer: ElementRef<HTMLElement> | null = null;

  private initMap(): void {
    if (this.mapContainer) {
      this.map = new Map({
        container: this.mapContainer.nativeElement,
        style: `https://api.maptiler.com/maps/streets-v2/style.json?key=${ENVIRONMENTS.MAP_KEY}`,
        center: [INITIAL_MAP_STATE.lng, INITIAL_MAP_STATE.lat],
        zoom: INITIAL_MAP_STATE.zoom,
      });

      this.map.addControl(new NavigationControl({}));
    }
  }

  private initMapHandlers(): void {
    this.map?.on('click', ({ lngLat }) => this.mapService.setLngLat({ lng: lngLat.lng, lat: lngLat.lat }));

    this.map?.on('contextmenu', () => {
      this.removeLineBetweenMarkers();
      this.lastClickedMarker = null;
    });

    this.map?.on('load', () => this.isMapLoaded.set(true));
  }

  private createLineBetweenMarkers(currentMarker: Marker, lastClickedMarker: Marker): GeoJSON.Feature {
    return {
      type: 'Feature',
      geometry: {
        type: 'LineString',
        coordinates: [
          [lastClickedMarker.getLngLat().lng, lastClickedMarker.getLngLat().lat],
          [currentMarker.getLngLat().lng, currentMarker.getLngLat().lat],
        ],
      },
      properties: {},
    };
  }

  private removeLineBetweenMarkers(): void {
    if (this.map?.getLayer('line')) {
      this.map?.removeLayer('line');
      this.map?.removeSource('line');
    }
  }

  private initMarkerClickHandler(marker: Marker): void {
    this.mapService.setLngLat(marker.getLngLat());
    if (this.lastClickedMarker) {
      this.removeLineBetweenMarkers();
      this.map?.addSource('line', {
        type: 'geojson',
        data: this.createLineBetweenMarkers(marker, this.lastClickedMarker),
      });
      this.map?.addLayer(LINE_LAYER);
    }

    this.lastClickedMarker = marker;
  }

  private drawInitialMarkers(): void {
    this.stationsService
      .allStations()
      .forEach((station) =>
        this.mapService.createNewMarker({ city: station.city, lng: station.longitude, lat: station.latitude }),
      );
  }

  public ngOnInit(): void {
    this.subscription.add(
      this.mapService.newMarker.subscribe((marker) => {
        if (marker && this.map) {
          marker.addTo(this.map);
          marker.togglePopup();
          this.mapService.markers.update((markers) => [...markers, marker]);
          marker.getElement().addEventListener('click', (event) => {
            event.stopPropagation();
            this.initMarkerClickHandler(marker);
          });

          this.map.flyTo({
            center: [marker.getLngLat().lng, marker.getLngLat().lat],
            zoom: INITIAL_MAP_STATE.zoom,
            curve: 0.5,
            speed: 0.5,
          });
        }
      }),
    );

    this.subscription.add(
      this.mapService.removedMarker.subscribe((marker) => {
        marker.remove();
      }),
    );
  }

  public ngAfterViewInit(): void {
    this.initMap();
    this.initMapHandlers();
    this.drawInitialMarkers();
  }

  public ngOnDestroy(): void {
    this.map?.remove();
    this.subscription.unsubscribe();
  }
}
