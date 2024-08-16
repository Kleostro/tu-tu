import { Routes } from '@angular/router';

import { ADMIN_PATH, APP_PATH } from './shared/constants/appRoutes';

const routes: Routes = [
  {
    path: APP_PATH.DEFAULT,
    loadComponent: () => import('./home/pages/home/home.component').then((c) => c.HomeComponent),
    title: 'Tu-Tu | Home',
  },
  {
    path: APP_PATH.SIGN_IN.toLowerCase(),
    loadComponent: () => import('./auth/pages/login/login.component').then((c) => c.LoginComponent),
    title: `Tu-Tu | ${APP_PATH.SIGN_IN}`,
  },
  {
    path: APP_PATH.SIGN_UP.toLowerCase(),
    loadComponent: () => import('./auth/pages/register/register.component').then((c) => c.RegisterComponent),
    title: `Tu-Tu | ${APP_PATH.SIGN_UP}`,
  },

  {
    path: APP_PATH.PROFILE.toLowerCase(),
    loadComponent: () => import('./profile/pages/profile/profile.component').then((c) => c.ProfileComponent),
    title: `Tu-Tu | ${APP_PATH.PROFILE}`,
  },

  {
    path: APP_PATH.ORDERS.toLowerCase(),
    loadComponent: () => import('./orders/pages/orders/orders.component').then((c) => c.OrdersComponent),
    title: `Tu-Tu | ${APP_PATH.ORDERS}`,
  },

  {
    path: `${APP_PATH.TRIP.toLowerCase()}/:id`,
    loadComponent: () =>
      import('./trip-detailed/pages/trip-detailed/trip-detailed.component').then((c) => c.TripDetailedComponent),
    title: `Tu-Tu | ${APP_PATH.TRIP}`,
  },

  {
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
        path: ADMIN_PATH.SCHEDULE.toLowerCase(),
        loadComponent: () => import('./admin/pages/schedule/schedule.component').then((c) => c.ScheduleComponent),
        title: `Admin | ${ADMIN_PATH.SCHEDULE}`,
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
    loadComponent: () => import('./core/pages/not-found/not-found.component').then((c) => c.NotFoundComponent),
    path: APP_PATH.NO_MATCH,
    title: `Tu-Tu | ${APP_PATH.NOT_FOUND}`,
  },
];

export default routes;
