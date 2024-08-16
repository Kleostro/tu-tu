import { Routes } from '@angular/router';
import { RegisterComponent } from './auth/pages/register/register.component';

const routes: Routes = [
  {
    path: 'admin',
    loadComponent: () =>
      import('./admin/layout/admin-layout/admin-layout.component').then((c) => c.AdminLayoutComponent),
    children: [
      {
        path: 'carriages',
        loadComponent: () => import('./admin/pages/carriages/carriages.component').then((c) => c.CarriagesComponent),
        title: 'Admin | carriages',
      },
      {
        path: 'routes',
        loadComponent: () => import('./admin/pages/routes/routes.component').then((c) => c.RoutesComponent),
        title: 'Admin | routes',
      },
      {
        path: 'schedule',
        loadComponent: () => import('./admin/pages/schedule/schedule.component').then((c) => c.ScheduleComponent),
        title: 'Admin | schedule',
      },
      {
        path: 'stations',
        loadComponent: () => import('./admin/pages/stations/stations.component').then((c) => c.StationsComponent),
        title: 'Admin | stations',
      },
    ],
    title: 'Admin',
  },
  { path: 'register', component: RegisterComponent }
];

export default routes;
