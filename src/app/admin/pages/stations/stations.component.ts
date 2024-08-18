import { AsyncPipe } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, OnDestroy, OnInit } from '@angular/core';

import { Subscription } from 'rxjs';

import { StationsService } from '@/app/api/stationsService/stations.service';

import { CreateStationFormComponent } from '../../components/create-station-form/create-station-form.component';
import { MapComponent } from '../../components/map/map.component';
import { StationsListComponent } from '../../components/stations-list/stations-list.component';

@Component({
  selector: 'app-stations',
  standalone: true,
  imports: [MapComponent, CreateStationFormComponent, StationsListComponent, AsyncPipe],
  templateUrl: './stations.component.html',
  styleUrl: './stations.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StationsComponent implements OnInit, OnDestroy {
  private stationsService = inject(StationsService);
  private cdr = inject(ChangeDetectorRef);
  public allStations = this.stationsService.getAllStations();
  private subsciption = new Subscription();

  public ngOnInit(): void {
    this.subsciption.add(
      this.stationsService.getStations().subscribe((stations) => {
        this.stationsService.allStations.next(stations);
        this.cdr.detectChanges();
      }),
    );
  }

  public ngOnDestroy(): void {
    this.subsciption.unsubscribe();
  }
}
