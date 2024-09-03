import { inject, Injectable, signal } from '@angular/core';

import { Order } from '@/app/api/models/order';
import { OrdersService } from '@/app/api/ordersService/orders.service';
import { UserOrder } from '@/app/shared/models/userOrder.model';

import { TripCarriagesService } from '../tripCarriages/trip-carriages.service';
import { TripDatesService } from '../tripDates/trip-dates.service';
import { TripPriceService } from '../tripPrice/trip-price.service';
import { TripStationsService } from '../tripStations/trip-stations.service';

@Injectable({
  providedIn: 'root',
})
export class UserOrderService {
  private ordersService = inject(OrdersService);
  private tripStationsService = inject(TripStationsService);
  private tripDatesService = inject(TripDatesService);
  private tripPriceService = inject(TripPriceService);
  private tripCarriagesService = inject(TripCarriagesService);

  private currentOrders: UserOrder[] = [];
  public currentOrders$$ = signal<UserOrder[] | null>(null);

  public createUserOrders(): void {
    this.currentOrders = [];
    this.ordersService.allOrders().forEach((order) => {
      const currentOrder = this.createOrder(order);
      this.currentOrders.push(currentOrder);
    });
    this.currentOrders$$.set(this.currentOrders);
  }

  public createOrder(order: Order): UserOrder {
    const { carriages, stationEnd, stationStart, id, seatId, userId, status, rideId, path, routeId, schedule } = order;

    const tripStartStation = this.tripStationsService.getStationCityById(stationStart);
    const tripEndStation = this.tripStationsService.getStationCityById(stationEnd);

    const tripStationIndices = this.tripStationsService.getTripStationIndices(path, stationStart, stationEnd);
    const tripDates = this.tripDatesService.getTripDates(schedule, tripStationIndices);
    const aggregatedPriceMap = this.tripPriceService.aggregatePrices(schedule.segments, tripStationIndices);
    const trainCarriages = this.tripCarriagesService.countTrainCarriages(
      carriages,
      schedule.segments,
      tripStationIndices,
    );
    const freeSeatsMap = this.tripCarriagesService.calculateFreeSeats(trainCarriages);
    const carriageInfo = this.tripCarriagesService.createCarriageInfo(carriages, aggregatedPriceMap, freeSeatsMap);
    const carriage = this.tripCarriagesService.findUserCarriage(seatId, trainCarriages) ?? '';
    const price = this.tripPriceService.getCarriagePrice(carriage, carriageInfo);
    return {
      orderId: id,

      rideId,
      routeId,
      seatNumber: seatId,
      userId,
      status,
      tripStartStation,
      tripEndStation,
      tripStartStationId: stationEnd,
      tripEndStationId: stationStart,
      tripDepartureDate: tripDates.departure,
      tripArrivalDate: tripDates.arrival,
      carriage,
      price,
    };
  }
}
