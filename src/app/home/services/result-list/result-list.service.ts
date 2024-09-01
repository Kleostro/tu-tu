import { inject, Injectable, signal } from '@angular/core';

import { CarriageService } from '@/app/api/carriagesService/carriage.service';
import { RouteInfo } from '@/app/api/models/schedule';
import { Schedule, SegmentOccupiedSeats, SegmentPrice } from '@/app/api/models/search';
import { StationsService } from '@/app/api/stationsService/stations.service';
import { calculateDuration } from '@/app/shared/utils/calculateDuration';

import { CarriageCountMap } from '../../models/carriageCountMap.model';
import { CarriageInfo } from '../../models/carriageInfo.model';
import { CarriageNameMap } from '../../models/carriageNameMap.model';
import { CurrentRide } from '../../models/currentRide.model';
import { FreeSeatsMap } from '../../models/freeSeatsMap.model';
import { GroupedRoute, TripPoints } from '../../models/groupedRoutes.model';
import { PriceMap } from '../../models/priceMap.model';
import { RouteDates } from '../../models/routeDates.model';
import { StationInfo } from '../../models/stationInfo.model';
import { TrainCarriages } from '../../models/trainCarriages.model';
import { TripDates } from '../../models/tripDates.model';
import { TripIds } from '../../models/tripIds.model';
import { TripIndices } from '../../models/tripIndices.model';
import { TripStations } from '../../models/tripStations.model';
import { PLACEHOLDER } from './constants/constants';

@Injectable({
  providedIn: 'root',
})
export class ResultListService {
  private stationsService = inject(StationsService);
  private carriagesService = inject(CarriageService);

  public currentResultList$$ = signal<CurrentRide[]>([]);
  public routesInfo$$ = signal<Record<string, RouteInfo> | null>(null);

  public createCurrentRides(data: GroupedRoute[], tripPoints: TripPoints): void {
    if (data === undefined) {
      this.currentResultList$$.set([]);
      return;
    }

    let currentRides: CurrentRide[] = [];

    data.forEach((routeInfo) => {
      const rides = routeInfo.schedule.map((schedule) => this.createCurrentRide(routeInfo, schedule, tripPoints));
      currentRides = [...currentRides, ...rides];
    });

    this.updateResultList(currentRides);
  }

  private updateResultList(currentRides: CurrentRide[]): void {
    const updatedResultList = [...currentRides];
    updatedResultList.sort((a, b) => new Date(a.tripDepartureDate).getTime() - new Date(b.tripDepartureDate).getTime());
    this.currentResultList$$.set(updatedResultList);
  }

  private createCurrentRide(routeInfo: GroupedRoute, schedule: Schedule, tripPoints: TripPoints): CurrentRide {
    const routeStations = this.getRouteStations(routeInfo.path);
    const tripStations = this.getTripStations(tripPoints);
    const tripStationIds = this.getTripStationIds(tripStations);
    const routeStationIds = this.getRouteStationIds(routeInfo.path);
    const tripStationIndices = this.getTripStationIndices(routeInfo.path, tripStationIds);
    const tripDates = this.getTripDates(schedule, tripStationIndices);
    const { carriages } = routeInfo;
    const aggregatedPriceMap = this.aggregatePrices(schedule.segments, tripStationIndices);
    const stationsInfo = this.createStationsInfo(routeInfo.path, schedule, tripStationIndices);
    const trainCarriages = this.countTrainCarriages(carriages, schedule.segments, tripStationIndices);
    const freeSeatsMap = this.calculateFreeSeats(trainCarriages);
    const carriageInfo = this.createCarriageInfo(routeInfo.carriages, aggregatedPriceMap, freeSeatsMap);

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

  private getRouteStations(path: number[]): TripStations {
    return {
      start: this.getStationCityById(path[0]),
      end: this.getStationCityById(path[path.length - 1]),
    };
  }

  private getTripStations(tripPoints: TripPoints): TripStations {
    return {
      start: tripPoints.from,
      end: tripPoints.to,
    };
  }

  private getTripStationIds(tripStations: TripStations): TripIds {
    return {
      start: this.getStationIdByCity(tripStations.start),
      end: this.getStationIdByCity(tripStations.end),
    };
  }

  private getRouteStationIds(path: number[]): TripIds {
    return {
      start: path[0],
      end: path[path.length - 1],
    };
  }

  private getTripStationIndices(path: number[], tripStationIds: TripIds): TripIndices {
    return {
      start: path.indexOf(tripStationIds.start),
      end: path.indexOf(tripStationIds.end),
    };
  }

  private getTripDates(schedule: Schedule, indices: TripIndices): TripDates {
    return {
      departure: schedule.segments[indices.start].time[0],
      arrival: schedule.segments[indices.end - 1].time[1],
    };
  }

  private getStationCityById(stationId: number): string {
    return this.stationsService.findStationById(stationId)?.city ?? PLACEHOLDER.CITY;
  }

  private getStationIdByCity(city: string): number {
    return this.stationsService.findStationByCity(city)!.id;
  }

  private aggregatePrices(segments: SegmentPrice[], indices: TripIndices): PriceMap {
    const priceMap: PriceMap = {};
    segments.slice(indices.start, indices.end).forEach((segment) => {
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

  private getArrivalAndDepartureDates(index: number, pathsLength: number, schedule: Schedule): RouteDates {
    let arrivalDate = '';
    let departureDate = '';

    if (index === 0) {
      [departureDate] = schedule.segments[index].time;
    } else if (index === pathsLength - 1) {
      [, arrivalDate] = schedule.segments[index - 1].time;
    } else if (index > 0 && index < pathsLength - 1) {
      [, arrivalDate] = schedule.segments[index - 1].time;
      [departureDate] = schedule.segments[index].time;
    }

    return { arrivalDate, departureDate };
  }

  private createStationsInfo(paths: number[], schedule: Schedule, indices: TripIndices): StationInfo[] {
    const pathsLength = paths.length;
    const stations = this.stationsService.allStations();
    const stationMap = new Map<number, string>();

    stations.forEach((station) => {
      stationMap.set(station.id, station.city);
    });

    const stationsInfo = paths.map((stationId, index) => {
      const stationName = stationMap.get(stationId) ?? PLACEHOLDER.STATION;
      const { arrivalDate, departureDate } = this.getArrivalAndDepartureDates(index, pathsLength, schedule);

      return {
        stationId,
        stationName,
        arrivalDate,
        departureDate,
        stopDuration: calculateDuration(arrivalDate, departureDate),
        firstStation: index === 0,
        lastStation: index === pathsLength - 1,
        firstUserStation: index === indices.start,
        lastUserStation: index === indices.end,
        userStation: index >= indices.start && index <= indices.end,
      };
    });

    return stationsInfo;
  }

  private countTrainCarriages(
    carriages: string[],
    segments: SegmentOccupiedSeats[],
    tripStationIndices: TripIndices,
  ): TrainCarriages {
    const allCarriages = this.carriagesService.allCarriages();
    const trainCarriages: TrainCarriages = {};
    let currentFirstSeat = 1;

    carriages.forEach((carriageTypeCode, index) => {
      const info = allCarriages.find((crg) => crg.code === carriageTypeCode);
      if (info) {
        const { rows, leftSeats, rightSeats, name } = info;
        const totalSeats = this.calculateTotalSeats(rows, leftSeats, rightSeats);
        const firstSeat = currentFirstSeat;
        const lastSeat = firstSeat + totalSeats - 1;
        const occupiedSeats = this.findOccupiedSeats(segments, tripStationIndices, firstSeat, lastSeat);

        const key = (index + 1).toString();
        trainCarriages[key] = {
          carriageTypeCode,
          carriageOrder: index + 1,
          carriageName: name,
          firstSeat,
          lastSeat,
          occupiedSeats,
          totalSeats,
          freeSeats: totalSeats - occupiedSeats.length,
        };

        currentFirstSeat = lastSeat + 1;
      }
    });

    return trainCarriages;
  }

  private createCarriageNameMap(carriages: string[]): CarriageNameMap {
    const allCarriages = this.carriagesService.allCarriages();
    const carriageMap: CarriageNameMap = {};

    allCarriages.forEach(({ code, name }) => {
      carriageMap[code] = name;
    });

    const result: { [key: string]: string } = {};
    carriages.forEach((carriageTypeCode) => {
      if (carriageMap[carriageTypeCode]) {
        result[carriageTypeCode] = carriageMap[carriageTypeCode];
      }
    });

    return result;
  }

  private calculateTotalSeats(rows: number, leftSeats: number, rightSeats: number): number {
    return rows * (leftSeats + rightSeats);
  }

  private findOccupiedSeats(
    segments: SegmentOccupiedSeats[],
    tripStationIndices: TripIndices,
    firstSeat: number,
    lastSeat: number,
  ): number[] {
    return Array.from(
      new Set(
        segments
          .slice(tripStationIndices.start, tripStationIndices.end)
          .flatMap((segment) => segment.occupiedSeats)
          .filter((seat) => seat >= firstSeat && seat <= lastSeat),
      ),
    );
  }

  private createCarriageInfo(carriages: string[], priceMap: PriceMap, freeSeatsMap: FreeSeatsMap): CarriageInfo[] {
    const carriageCountMap = this.countCarriages(carriages);
    const carriageNameMap = this.createCarriageNameMap(carriages);
    return this.generateCarriageInfo(carriageNameMap, carriageCountMap, freeSeatsMap, priceMap);
  }

  private countCarriages(carriages: string[]): CarriageCountMap {
    const carriageCountMap: CarriageCountMap = {};
    carriages.forEach((carriage) => {
      if (!carriageCountMap[carriage]) {
        carriageCountMap[carriage] = { count: 0, occupiedSeats: [] };
      }
      carriageCountMap[carriage].count += 1;
    });
    return carriageCountMap;
  }

  private calculateFreeSeats(trainCarriages: TrainCarriages): FreeSeatsMap {
    const freeSeatsMap: FreeSeatsMap = {};

    Object.entries(trainCarriages).forEach(([, carriage]) => {
      const { freeSeats, carriageTypeCode } = carriage;
      if (freeSeatsMap[carriageTypeCode]) {
        freeSeatsMap[carriageTypeCode] += freeSeats;
      } else {
        freeSeatsMap[carriageTypeCode] = freeSeats;
      }
    });
    return freeSeatsMap;
  }

  private generateCarriageInfo(
    carriageNameMap: CarriageNameMap,
    carriageCountMap: CarriageCountMap,
    freeSeatsMap: FreeSeatsMap,
    priceMap: PriceMap,
  ): CarriageInfo[] {
    return Object.keys(carriageCountMap).map((carriage) => ({
      name: carriageNameMap[carriage],
      type: carriage,
      freeSeats: freeSeatsMap[carriage] ?? 0,
      price: priceMap[carriage] ?? 0,
    }));
  }
}
