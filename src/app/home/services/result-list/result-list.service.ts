import { inject, Injectable, signal } from '@angular/core';

import { CustomSchedule, RouteInfo } from '@/app/api/models/schedule';
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

  public currentResultList = signal<CurrentRide[]>(this.currentRides);
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
    const filterDate = new Date(this.filterService.searchPrms().time);
    const rides = data.schedule
      .map((schedule) => this.createCurrentRide(data, schedule))
      .filter((ride): ride is CurrentRide => ride !== null && new Date(ride.tripDepartureDate) > filterDate);

    this.currentRides.push(...rides);

    const updatedResultList = [...this.currentResultList(), ...rides];
    updatedResultList.sort((a, b) => new Date(a.tripDepartureDate).getTime() - new Date(b.tripDepartureDate).getTime());

    this.currentResultList.set(updatedResultList);
  }

  private createCurrentRide(routeInfo: RouteInfo, schedule: CustomSchedule): CurrentRide {
    const tripPoints = this.filterService.tripPoints$$();

    const routeId = routeInfo.id;

    const routeStartStation = this.stationsService.findStationById(routeInfo.path[0])!.city;
    const routeEndStation = this.stationsService.findStationById(routeInfo.path[routeInfo.path.length - 1])!.city;
    const aggregatedPriceMap = this.aggregatePrices(schedule.segments);

    const tripStartStation = tripPoints!.from;
    const tripEndStation = tripPoints!.to;

    const tripStartStationId = this.stationsService.findStationByCity(tripStartStation)!.id;
    const tripEndStationId = this.stationsService.findStationByCity(tripEndStation)!.id;

    const routeStartStationId = routeInfo.path[0];
    const routeEndStationId = routeInfo.path[routeInfo.path.length - 1];

    const tripStartStationIdIndex = routeInfo.path.indexOf(tripStartStationId);
    const tripEndStationIdIndex = routeInfo.path.indexOf(tripEndStationId);

    const tripDepartureDate = schedule.segments[tripStartStationIdIndex].time[0];
    const tripArrivalDate = schedule.segments[tripEndStationIdIndex - 1].time[1];

    return {
      rideId: schedule.rideId, // Use rideId from the current schedule
      routeId, // correct

      routeStartStation, // correct
      routeEndStation, // correct

      tripStartStation, // correct
      tripEndStation, // correct

      routeStartStationId, // correct
      routeEndStationId, // correct

      tripStartStationId, // correct
      tripEndStationId, // correct

      tripDepartureDate, // correct
      tripArrivalDate, // correct

      carriageInfo: this.createCarriageInfo(routeInfo.carriages, aggregatedPriceMap), // For the current schedule
      stationsInfo: [], // To be done later
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
