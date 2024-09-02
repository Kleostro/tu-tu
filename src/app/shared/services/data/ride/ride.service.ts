import { inject, Injectable, signal } from '@angular/core';

import { OrderSchedule, Schedule } from '@/app/api/models/search';
import { RideInfo } from '@/app/api/models/trip-detailed';
import { GroupedRoute, OrderTripPoints, TripPoints } from '@/app/home/models/groupedRoutes.model';
import { CurrentRide } from '@/app/shared/models/currentRide.model';
import { TrainCarriagesListService } from '@/app/trip-detailed/services/train-carriages-list/train-carriages-list.service';

import { TripCarriagesService } from '../tripCarriages/trip-carriages.service';
import { TripDatesService } from '../tripDates/trip-dates.service';
import { TripPriceService } from '../tripPrice/trip-price.service';
import { TripStationsService } from '../tripStations/trip-stations.service';

@Injectable({
  providedIn: 'root',
})
export class RideService {
  private tripStationsService = inject(TripStationsService);
  private tripDatesService = inject(TripDatesService);
  private tripPriceService = inject(TripPriceService);
  private tripCarriagesService = inject(TripCarriagesService);
  private trainCarriagesListService = inject(TrainCarriagesListService);

  public rideFromId$$ = signal<CurrentRide | null>(null);

  public createCurrentRideById(routeInfo: RideInfo, schedule: OrderSchedule, tripPoints: OrderTripPoints): CurrentRide {
    const { path, carriages, routeId, rideId } = routeInfo;
    const { segments } = schedule;
    const routeStations = this.tripStationsService.getRouteStations(path);
    const routeStationIds = this.tripStationsService.getRouteStationIds(path);

    const tripStartStation = this.tripStationsService.getStationCityById(+tripPoints.from);
    const tripEndStation = this.tripStationsService.getStationCityById(+tripPoints.to);
    const tripStationIndices = this.tripStationsService.getTripStationIndices(path, +tripPoints.from, +tripPoints.to);
    const tripDates = this.tripDatesService.getTripDates(schedule, tripStationIndices);
    const aggregatedPriceMap = this.tripPriceService.aggregatePrices(segments, tripStationIndices);
    const stationsInfo = this.tripStationsService.createStationsInfo(path, schedule, tripStationIndices);

    const trainCarriages = this.tripCarriagesService.countTrainCarriages(carriages, segments, tripStationIndices);
    const freeSeatsMap = this.tripCarriagesService.calculateFreeSeats(trainCarriages);
    const carriageInfo = this.tripCarriagesService.createCarriageInfo(carriages, aggregatedPriceMap, freeSeatsMap);
    return {
      rideId,
      routeId,
      routeStartStation: routeStations.start,
      routeEndStation: routeStations.end,
      tripStartStation,
      tripEndStation,
      routeStartStationId: routeStationIds.start,
      routeEndStationId: routeStationIds.end,
      tripStartStationId: +tripPoints.from,
      tripEndStationId: +tripPoints.to,
      tripDepartureDate: tripDates.departure,
      tripArrivalDate: tripDates.arrival,
      trainCarriages,
      carriages,
      carriageInfo,
      stationsInfo,
    };
  }

  public createCurrentRide(routeInfo: GroupedRoute, schedule: Schedule, tripPoints: TripPoints): CurrentRide {
    const { path, carriages, routeId } = routeInfo;
    const { segments, rideId } = schedule;
    const routeStations = this.tripStationsService.getRouteStations(path);
    const tripStations = this.tripStationsService.getTripStations(tripPoints);
    const tripStationIds = this.tripStationsService.getTripStationIds(tripStations);
    const routeStationIds = this.tripStationsService.getRouteStationIds(path);
    const { start, end } = tripStationIds;
    const tripStationIndices = this.tripStationsService.getTripStationIndices(path, start, end);
    const tripDates = this.tripDatesService.getTripDates(schedule, tripStationIndices);
    const aggregatedPriceMap = this.tripPriceService.aggregatePrices(segments, tripStationIndices);
    const stationsInfo = this.tripStationsService.createStationsInfo(path, schedule, tripStationIndices);

    const trainCarriages = this.tripCarriagesService.countTrainCarriages(carriages, segments, tripStationIndices);
    const freeSeatsMap = this.tripCarriagesService.calculateFreeSeats(trainCarriages);
    const carriageInfo = this.tripCarriagesService.createCarriageInfo(carriages, aggregatedPriceMap, freeSeatsMap);
    this.trainCarriagesListService.currentCarriages$$.set(carriages);

    return {
      rideId,
      routeId,
      routeStartStation: routeStations.start,
      routeEndStation: routeStations.end,
      tripStartStation: tripStations.start,
      tripEndStation: tripStations.end,
      routeStartStationId: routeStationIds.start,
      routeEndStationId: routeStationIds.end,
      tripStartStationId: start,
      tripEndStationId: end,
      tripDepartureDate: tripDates.departure,
      tripArrivalDate: tripDates.arrival,
      trainCarriages,
      carriages,
      carriageInfo,
      stationsInfo,
    };
  }
}
