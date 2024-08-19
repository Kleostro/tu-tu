import { Route } from './search';

export type RouteResponse = Omit<Route, 'schedule' | 'price'>;

export type RouteBody = Omit<RouteResponse, 'id'>;

export type RouteId = Pick<RouteResponse, 'id'>;
