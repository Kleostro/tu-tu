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

  constructor() {
    this.activatedRoute.queryParams.subscribe((params) => {
      this.queryParams$$.set(params);
    });

    this.router.events.pipe(filter((event) => event instanceof NavigationEnd)).subscribe(() => {
      this.isAdminPage$$.set(this.router.url.startsWith(APP_ROUTE.ADMIN));
    });
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
