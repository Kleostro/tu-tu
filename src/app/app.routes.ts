import { Routes } from '@angular/router';

import { adminGuard } from './auth/guards/admin.guard';
import { authGuard, loginGuard } from './auth/guards/login.guard';
import { ADMIN_PATH, APP_PATH } from './shared/constants/routes';

const routes: Routes = [
  {
    path: APP_PATH.DEFAULT,
    loadComponent: () => import('./home/pages/home/home.component').then((c) => c.HomeComponent),
    title: 'Tu-Tu | Home',
  },
  {
    canActivate: [loginGuard],
    path: APP_PATH.SIGN_IN.toLowerCase(),
    loadComponent: () => import('./auth/pages/login/login.component').then((c) => c.LoginComponent),
    title: `Tu-Tu | ${APP_PATH.SIGN_IN}`,
  },
  {
    canActivate: [loginGuard],
    path: APP_PATH.SIGN_UP.toLowerCase(),
    loadComponent: () => import('./auth/pages/register/register.component').then((c) => c.RegisterComponent),
    title: `Tu-Tu | ${APP_PATH.SIGN_UP}`,
  },

  {
    canActivate: [authGuard],
    path: APP_PATH.PROFILE.toLowerCase(),
    loadComponent: () => import('./profile/pages/profile/profile.component').then((c) => c.ProfileComponent),
    title: `Tu-Tu | ${APP_PATH.PROFILE}`,
  },

  {
    canActivate: [authGuard],
    path: APP_PATH.ORDERS.toLowerCase(),
    loadComponent: () => import('./orders/pages/orders/orders.component').then((c) => c.OrdersComponent),
    title: `Tu-Tu | ${APP_PATH.ORDERS}`,
  },

  {
    path: `${APP_PATH.TRIP.toLowerCase()}/:rideId`,
    loadComponent: () =>
      import('./trip-detailed/pages/trip-detailed/trip-detailed.component').then((c) => c.TripDetailedComponent),
    title: `Tu-Tu | ${APP_PATH.TRIP}`,
  },

  {
    canActivate: [adminGuard],
    path: APP_PATH.ADMIN.toLowerCase(),
    loadComponent: () =>
      import('./admin/layout/admin-layout/admin-layout.component').then((c) => c.AdminLayoutComponent),
    children: [
      {
        path: ADMIN_PATH.CARRIAGES.toLowerCase(),
        loadComponent: () => import('./admin/pages/carriages/carriages.component').then((c) => c.CarriagesComponent),
        title: `Admin | ${ADMIN_PATH.CARRIAGES}`,
      },
      {
        path: ADMIN_PATH.ROUTES.toLowerCase(),
        loadComponent: () => import('./admin/pages/routes/routes.component').then((c) => c.RoutesComponent),
        title: `Admin | ${ADMIN_PATH.ROUTES}`,
      },
      {
        path: `${ADMIN_PATH.ROUTES.toLowerCase()}/:id`,
        loadComponent: () =>
          import('./admin/pages/route-detailed/route-detailed.component').then((c) => c.RouteDetailedComponent),
        title: `Admin | ${ADMIN_PATH.ROUTES.slice(0, -1)}`,
      },
      {
        path: ADMIN_PATH.STATIONS.toLowerCase(),
        loadComponent: () => import('./admin/pages/stations/stations.component').then((c) => c.StationsComponent),
        title: `Admin | ${ADMIN_PATH.STATIONS}`,
      },
    ],
    title: `Tu-Tu | ${APP_PATH.ADMIN}`,
  },
  {
    path: APP_PATH.NOT_FOUND,
    loadComponent: () => import('./core/pages/not-found/not-found.component').then((c) => c.NotFoundComponent),
    title: `Tu-Tu | ${APP_PATH.NOT_FOUND}`,
  },
  {
    path: APP_PATH.NO_MATCH,
    redirectTo: APP_PATH.NOT_FOUND,
  },
];

export default routes;
