import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  inject,
  Input,
  OnDestroy,
  OnInit,
  signal,
  ViewChild,
} from '@angular/core';

import { Map, Marker, NavigationControl } from 'maplibre-gl';
import { SkeletonModule } from 'primeng/skeleton';
import { Subscription } from 'rxjs';

import { Station } from '@/app/api/models/stations';
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
  private mapService = inject(MapService);

  @Input() public allStations: Station[] | null = null;

  private subscription = new Subscription();
  private map!: Map;
  public isMapLoaded = signal(false);
  private markers: Marker[] = [];
  private lastClickedMarker: Marker | null = null;

  @ViewChild('map')
  private mapContainer!: ElementRef<HTMLElement>;

  private initMap(): void {
    this.map = new Map({
      container: this.mapContainer.nativeElement,
      style: `https://api.maptiler.com/maps/streets-v2/style.json?key=${ENVIRONMENTS.MAP_KEY}`,
      center: [INITIAL_MAP_STATE.lng, INITIAL_MAP_STATE.lat],
      zoom: INITIAL_MAP_STATE.zoom,
    });

    this.map.addControl(new NavigationControl({}));
  }

  private initMapHandlers(): void {
    this.map.on('click', ({ lngLat }) => this.mapService.setLngLat({ lng: lngLat.lng, lat: lngLat.lat }));

    this.map.on('contextmenu', () => {
      this.removeLineBetweenMarkers();
      this.lastClickedMarker = null;
    });

    this.map.on('load', () => this.isMapLoaded.set(true));
  }

  private removeLineBetweenMarkers(): void {
    if (this.map.getLayer('line')) {
      this.map.removeLayer('line');
      this.map.removeSource('line');
    }
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

  private initMarkerClickHandler(marker: Marker): void {
    this.mapService.setLngLat(marker.getLngLat());
    if (this.lastClickedMarker) {
      this.removeLineBetweenMarkers();
      this.createLineBetweenMarkers(marker, this.lastClickedMarker);
      this.map.addSource('line', {
        type: 'geojson',
        data: this.createLineBetweenMarkers(marker, this.lastClickedMarker),
      });
      this.map.addLayer(LINE_LAYER);
    }

    this.lastClickedMarker = marker;
  }

  public ngOnInit(): void {
    this.subscription.add(
      this.mapService.getNewMarker().subscribe((marker) => {
        marker.addTo(this.map);
        marker.togglePopup();
        this.markers.push(marker);
        marker.getElement().addEventListener('click', (event) => {
          event.stopPropagation();
          this.initMarkerClickHandler(marker);
        });
        this.map.flyTo({
          center: [marker.getLngLat().lng, marker.getLngLat().lat],
          zoom: INITIAL_MAP_STATE.zoom,
        });
      }),
    );
  }

  public ngAfterViewInit(): void {
    this.initMap();
    this.initMapHandlers();

    this.allStations?.forEach((station) => {
      this.mapService.createNewMarker({ city: station.city, lng: station.longitude, lat: station.latitude });
    });
  }

  public ngOnDestroy(): void {
    this.map.remove();
    this.subscription.unsubscribe();
  }
}
