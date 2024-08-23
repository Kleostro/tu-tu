import { computed, inject, Injectable, signal } from '@angular/core';

import { RouteInfo } from '@/app/api/models/schedule';
import { StationsService } from '@/app/api/stationsService/stations.service';

import { CarriageInfo } from '../../models/carriageInfo.model';
import { CurrentRide } from '../../models/currentRide.model';
import { FilterService } from '../filter/filter.service';

@Injectable({
  providedIn: 'root',
})
export class ResultListService {
  private stationsService = inject(StationsService);
  private filterService = inject(FilterService);

  public currentRides: CurrentRide[] = [];

  public currentResultList = computed<CurrentRide[]>(() => this.currentRides);
  public routesInfo$$ = signal<Record<string, RouteInfo> | null>(null);

  constructor() {
    this.stationsService.getStations().subscribe(() => {
      this.filterService.routesInfo$.subscribe((data) => {
        if (data) {
          this.createCurrentRides(data);
        }
      });
    });
  }

  private createCurrentRides(data: RouteInfo): void {
    const ride = data;

    const currentRide = this.createCurrentRide(ride);
    this.currentRides.push(currentRide);
  }

  private createCurrentRide(ride: RouteInfo): CurrentRide {
    const tripPoints = this.filterService.tripPoints$$();
    const routeInfo: RouteInfo = ride;

    const routeStartStation = this.stationsService.findStationById(routeInfo.path[0])!.city;
    const routeEndStation = this.stationsService.findStationById(routeInfo.path[routeInfo.path.length - 1])!.city;
    const aggregatedPriceMap = this.aggregatePrices(routeInfo.schedule[1].segments);

    return {
      rideId: routeInfo.schedule[1].rideId, // ??
      routeId: routeInfo.id, // correct

      routeStartStation, // correct
      routeEndStation, // correct

      tripStartStation: tripPoints!.from, // correct
      tripEndStation: tripPoints!.to, // correct

      routeStartStationId: routeInfo.path[0], // correct
      routeEndStationId: routeInfo.path[routeInfo.path.length - 1], // correct

      tripStartStationId: this.stationsService.findStationByCity(tripPoints!.from)?.id ?? 0, // correct
      tripEndStationId: this.stationsService.findStationByCity(tripPoints!.to)?.id ?? 0, // correct

      tripDepartureDate: routeInfo.schedule[0].segments[0].time[1], // ??
      tripArrivalDate: routeInfo.schedule[0].segments[routeInfo.schedule[0].segments.length - 1].time[0], // ??

      carriageInfo: this.createCarriageInfo(routeInfo.carriages, aggregatedPriceMap), // ?? for all route
      stationsInfo: [], // ?? do later
    };
  }

  private aggregatePrices(segments: { price: { [key: string]: number } }[]): { [key: string]: number } {
    const priceMap: { [key: string]: number } = {};

    segments.forEach((segment) => {
      Object.keys(segment.price).forEach((carriage) => {
        if (priceMap[carriage]) {
          priceMap[carriage] += segment.price[carriage];
        } else {
          priceMap[carriage] = segment.price[carriage];
        }
      });
    });

    return priceMap;
  }

  private createCarriageInfo(carriages: string[], priceMap: { [key: string]: number }): CarriageInfo[] {
    const uniqueCarriages = Array.from(new Set(carriages));
    return uniqueCarriages.map((carriage) => ({
      type: carriage,
      freeSeats: 0,
      price: priceMap[carriage] ?? 0,
    }));
  }
}
