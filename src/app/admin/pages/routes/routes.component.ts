import { ChangeDetectionStrategy, Component, inject, OnDestroy, OnInit, signal } from '@angular/core';

import { ButtonModule } from 'primeng/button';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { RippleModule } from 'primeng/ripple';
import { Subscription } from 'rxjs';

import { CarriageService } from '@/app/api/carriagesService/carriage.service';
import { RouteService } from '@/app/api/routeService/route.service';
import { StationsService } from '@/app/api/stationsService/stations.service';

import { RouteFormComponent } from '../../components/route-form/route-form.component';
import { RoutesListComponent } from '../../components/routes-list/routes-list.component';

@Component({
  selector: 'app-routes',
  standalone: true,
  imports: [RoutesListComponent, ButtonModule, RippleModule, RouteFormComponent, ProgressSpinnerModule],
  templateUrl: './routes.component.html',
  styleUrl: './routes.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RoutesComponent implements OnInit, OnDestroy {
  public routeService = inject(RouteService);
  public stationsService = inject(StationsService);
  public carriageService = inject(CarriageService);
  public isFormVisible = signal(false);

  private subscription = new Subscription();

  public hadnleOpenRouteForm(): void {
    this.isFormVisible.set(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  public ngOnInit(): void {
    this.subscription.add(this.routeService.getAllRoutes().subscribe());
    this.subscription.add(this.stationsService.getStations().subscribe());
    this.subscription.add(
      this.carriageService.getCarriages().subscribe((carriages) => this.carriageService.allCarriages.set(carriages)),
    );
  }

  public ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
