import { inject, Injectable } from '@angular/core';

import { Schedule } from '@/app/api/models/search';
import { GroupedRoute, TripPoints } from '@/app/home/models/groupedRoutes.model';
import { CurrentRide } from '@/app/shared/models/currentRide.model';

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

  public createCurrentRide(routeInfo: GroupedRoute, schedule: Schedule, tripPoints: TripPoints): CurrentRide {
    const routeStations = this.tripStationsService.getRouteStations(routeInfo.path);
    const tripStations = this.tripStationsService.getTripStations(tripPoints);
    const tripStationIds = this.tripStationsService.getTripStationIds(tripStations);
    const routeStationIds = this.tripStationsService.getRouteStationIds(routeInfo.path);
    const tripStationIndices = this.tripStationsService.getTripStationIndices(routeInfo.path, tripStationIds);
    const tripDates = this.tripDatesService.getTripDates(schedule, tripStationIndices);
    const { carriages } = routeInfo;
    const aggregatedPriceMap = this.tripPriceService.aggregatePrices(schedule.segments, tripStationIndices);
    const stationsInfo = this.tripStationsService.createStationsInfo(routeInfo.path, schedule, tripStationIndices);

    const trainCarriages = this.tripCarriagesService.countTrainCarriages(
      carriages,
      schedule.segments,
      tripStationIndices,
    );
    const freeSeatsMap = this.tripCarriagesService.calculateFreeSeats(trainCarriages);
    const carriageInfo = this.tripCarriagesService.createCarriageInfo(
      routeInfo.carriages,
      aggregatedPriceMap,
      freeSeatsMap,
    );

    return {
      rideId: schedule.rideId,
      routeId: routeInfo.routeId,
      routeStartStation: routeStations.start,
      routeEndStation: routeStations.end,
      tripStartStation: tripStations.start,
      tripEndStation: tripStations.end,
      routeStartStationId: routeStationIds.start,
      routeEndStationId: routeStationIds.end,
      tripStartStationId: tripStationIds.start,
      tripEndStationId: tripStationIds.end,
      tripDepartureDate: tripDates.departure,
      tripArrivalDate: tripDates.arrival,
      trainCarriages,
      carriages,
      carriageInfo,
      stationsInfo,
    };
  }
}
