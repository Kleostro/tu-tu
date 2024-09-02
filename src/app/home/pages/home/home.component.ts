import { ChangeDetectionStrategy, Component, inject, OnDestroy, OnInit } from '@angular/core';

import { Subscription } from 'rxjs';

import { CarriageService } from '@/app/api/carriagesService/carriage.service';
import { StationsService } from '@/app/api/stationsService/stations.service';

import { ResultListComponent } from '../../components/result-list/result-list.component';
import { SearchComponent } from '../../components/search/search.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [ResultListComponent, SearchComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeComponent implements OnInit, OnDestroy {
  private subscription = new Subscription();

  private carriageService = inject(CarriageService);
  private stationsService = inject(StationsService);

  public ngOnInit(): void {
    this.subscription.add(
      this.stationsService.getStations().subscribe(() =>
        this.carriageService.getCarriages().subscribe((carriages) => {
          this.carriageService.allCarriages.set(carriages);
        }),
      ),
    );
  }

  public ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
