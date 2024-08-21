import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

import { Observable } from 'rxjs';

import ENDPOINTS from '../constants/constants';
import { Order, OrderId, OrderRequest, User } from '../models/order';

@Injectable({
  providedIn: 'root',
})
export class OrdersService {
  private httpClient = inject(HttpClient);

  public getAllOrders(): Observable<Order[]> {
    return this.httpClient.get<Order[]>(ENDPOINTS.ORDER);
  }

  public makeOrder(order: OrderRequest): Observable<OrderId> {
    return this.httpClient.post<OrderId>(ENDPOINTS.ORDER, order);
  }

  public cancelOrder(orderId: number): Observable<object> {
    return this.httpClient.delete<object>(`${ENDPOINTS.ORDER}/${orderId}`);
  }

  public getAllUsers(): Observable<User[]> {
    return this.httpClient.get<User[]>(ENDPOINTS.USERS);
  }
}
