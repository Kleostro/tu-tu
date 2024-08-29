import { Location } from '@angular/common';
import { inject, Injectable, signal } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Params, Router } from '@angular/router';

import { filter } from 'rxjs';

import { APP_ROUTE } from '@/app/shared/constants/routes';

@Injectable({
  providedIn: 'root',
})
export class RoutingService {
  private activatedRoute = inject(ActivatedRoute);
  private router = inject(Router);
  private location = inject(Location);

  public queryParams$$ = signal<Record<string, string>>({});
  public isAdminPage$$ = signal<boolean>(false);
  public isAdminCarriagesPage$$ = signal<boolean>(false);
  public currentRideId$$ = signal<string>('');

  constructor() {
    this.activatedRoute.queryParams.subscribe((params) => {
      this.queryParams$$.set(params);
    });

    this.router.events.pipe(filter((event) => event instanceof NavigationEnd)).subscribe(() => {
      const { url } = this.router;
      this.isAdminPage$$.set(url.startsWith(APP_ROUTE.ADMIN));
      this.isAdminCarriagesPage$$.set(url.startsWith(`${APP_ROUTE.ADMIN}/carriages`));

      const rideId = this.extractRideIdFromUrl(url);
      this.currentRideId$$.set(rideId?.toString() ?? '');
    });
  }

  private extractRideIdFromUrl(url: string): number | null {
    const match = /\/trip\/:(\d+)/.exec(url);
    if (match?.[1]) {
      return parseInt(match[1], 10);
    }
    return null;
  }

  public goBack(): void {
    this.location.back();
  }

  public updateQueryParams(params: Params): void {
    this.router.navigate([], {
      queryParams: params,
      queryParamsHandling: 'merge',
      relativeTo: this.activatedRoute,
    });
  }
}
