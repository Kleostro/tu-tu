import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  inject,
  OnDestroy,
  OnInit,
  signal,
  ViewChild,
} from '@angular/core';

import { Map, NavigationControl } from 'maplibre-gl';
import { SkeletonModule } from 'primeng/skeleton';
import { Subscription } from 'rxjs';

import ENVIRONMENTS from '@/environment/environment';

import { INITIAL_MAP_STATE } from '../../constants/initial-map-state';
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
  private subscription = new Subscription();
  private map!: Map;

  @ViewChild('map')
  private mapContainer!: ElementRef<HTMLElement>;

  public isMapLoaded = signal(false);

  private initMap(): void {
    this.map = new Map({
      container: this.mapContainer.nativeElement,
      style: `https://api.maptiler.com/maps/streets-v2/style.json?key=${ENVIRONMENTS.MAP_KEY}`,
      center: [INITIAL_MAP_STATE.lng, INITIAL_MAP_STATE.lat],
      zoom: INITIAL_MAP_STATE.zoom,
    });

    this.map.addControl(new NavigationControl({}));
  }

  private initMapClickHandler(): void {
    this.map.on('click', ({ lngLat }) => {
      this.mapService.setLngLat({ lng: lngLat.lng, lat: lngLat.lat });
    });

    this.map.on('load', () => {
      this.isMapLoaded.set(true);
    });
  }

  public ngOnInit(): void {
    this.subscription.add(
      this.mapService.getNewMarker().subscribe((marker) => {
        marker.addTo(this.map);
        marker.togglePopup();
        this.map.flyTo({
          center: [marker.getLngLat().lng, marker.getLngLat().lat],
          zoom: INITIAL_MAP_STATE.zoom,
        });
      }),
    );
  }

  public ngAfterViewInit(): void {
    this.initMap();
    this.initMapClickHandler();
  }

  public ngOnDestroy(): void {
    this.map.remove();
    this.subscription.unsubscribe();
  }
}
