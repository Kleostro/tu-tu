import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';

import { Observable, tap } from 'rxjs';

import ENDPOINTS from '../constants/constants';
import { Order, OrderId, OrderRequest, User } from '../models/order';

@Injectable({
  providedIn: 'root',
})
export class OrdersService {
  private httpClient = inject(HttpClient);
  public allOrders = signal<Order[]>([]);
  public allUsers = signal<User[]>([]);

  public getOrders(): Observable<Order[]> {
    return this.httpClient.get<Order[]>(ENDPOINTS.ORDER).pipe(tap((orders) => this.allOrders.set(orders)));
  }

  public getAllOrders(): Observable<Order[]> {
    return this.httpClient
      .get<Order[]>(`${ENDPOINTS.ORDER}?all=true`)
      .pipe(tap((orders) => this.allOrders.set(orders)));
  }

  public createOrder(order: OrderRequest): Observable<OrderId> {
    return this.httpClient.post<OrderId>(ENDPOINTS.ORDER, order);
  }

  public cancelOrder(orderId: number): Observable<object> {
    return this.httpClient.delete<object>(`${ENDPOINTS.ORDER}/${orderId}`);
  }

  public getAllUsers(): Observable<User[]> {
    return this.httpClient.get<User[]>(ENDPOINTS.USERS).pipe(tap((users) => this.allUsers.set(users)));
  }

  public findUserById(id: number): User | null {
    return this.allUsers()?.find((user) => user.id === id) ?? null;
  }
}
