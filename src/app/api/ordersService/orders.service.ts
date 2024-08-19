import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

import { Observable } from 'rxjs';

import { Order, OrderId, OrderRequest, User } from '../models/order';

@Injectable({
  providedIn: 'root',
})
export class OrdersService {
  private httpClient = inject(HttpClient);
  private ORDER_ENDPOINT = 'order';

  public getAllOrders(): Observable<Order[]> {
    return this.httpClient.get<Order[]>(this.ORDER_ENDPOINT);
  }

  public makeOrder(order: OrderRequest): Observable<OrderId> {
    return this.httpClient.post<OrderId>(this.ORDER_ENDPOINT, order);
  }

  public cancelOrder(orderId: number): Observable<object> {
    return this.httpClient.delete<object>(`${this.ORDER_ENDPOINT}/${orderId}`);
  }

  public getAllUsers(): Observable<User[]> {
    return this.httpClient.get<User[]>('users');
  }
}
