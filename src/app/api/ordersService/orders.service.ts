import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';

import { Observable, shareReplay, tap } from 'rxjs';

import ENDPOINTS from '../constants/constants';
import { Order, OrderId, OrderRequest, User } from '../models/order';
import { ordersDummyData } from './orders.data';

@Injectable({
  providedIn: 'root',
})
export class OrdersService {
  private httpClient = inject(HttpClient);
  public allOrders = signal<Order[]>([]);
  public allUsers = signal<User[]>([]);

  public getOrders(): Observable<Order[]> {
    return this.httpClient.get<Order[]>(ENDPOINTS.ORDER).pipe(
      shareReplay(1),
      // Temporar solution with hardcoded data
      // tap((orders) => this.allOrders.set(orders)),
      tap(() => this.allOrders.set(ordersDummyData)),
    );
  }

  public getAllOrders(): Observable<Order[]> {
    return this.httpClient.get<Order[]>(`${ENDPOINTS.ORDER}?all=true`).pipe(
      shareReplay(1),
      // Temporar solution with hardcoded data
      // tap((orders) => this.allOrders.set(orders)),
      tap(() => this.allOrders.set(ordersDummyData)),
    );
  }

  public makeOrder(order: OrderRequest): Observable<OrderId> {
    return this.httpClient.post<OrderId>(ENDPOINTS.ORDER, order);
  }

  public cancelOrder(orderId: number): Observable<object> {
    return this.httpClient.delete<object>(`${ENDPOINTS.ORDER}/${orderId}`);
  }

  public getAllUsers(): Observable<User[]> {
    return this.httpClient.get<User[]>(ENDPOINTS.USERS).pipe(
      shareReplay(1),
      tap((users) => this.allUsers.set(users)),
    );
  }

  public findUserById(id: number): User | null {
    return this.allUsers()?.find((user) => user.id === id) ?? null;
  }
}
