import { Location } from '@angular/common';
import { inject, Injectable, signal } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class RoutingService {
  private activatedRoute = inject(ActivatedRoute);
  private router = inject(Router);
  private location = inject(Location);

  public queryParams = signal<Record<string, string>>({});

  constructor() {
    this.activatedRoute.queryParams.subscribe((params) => {
      this.queryParams.set(params);
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
