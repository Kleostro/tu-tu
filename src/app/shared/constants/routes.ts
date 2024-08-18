export const APP_PATH = {
  DEFAULT: '',
  SIGN_IN: 'Sign-in',
  SIGN_UP: 'Sign-up',
  ADMIN: 'Admin',
  NOT_FOUND: '404',
  NO_MATCH: '**',
  PROFILE: 'Profile',
  TRIP: 'Trip',
  ORDERS: 'Orders',
} as const;

export const APP_ROUTE = {
  SIGN_IN: `/${APP_PATH.SIGN_IN.toLowerCase()}`,
  SIGN_UP: `/${APP_PATH.SIGN_UP.toLowerCase()}`,
  ADMIN: `/${APP_PATH.ADMIN.toLowerCase()}`,
  NOT_FOUND: `/${APP_PATH.NOT_FOUND.toLowerCase()}`,
  PROFILE: `/${APP_PATH.PROFILE.toLowerCase()}`,
  TRIP: `/${APP_PATH.TRIP.toLowerCase()}`,
  ORDERS: `/${APP_PATH.ORDERS.toLowerCase()}`,
} as const;

export const ADMIN_PATH = {
  CARRIAGES: 'Carriages',
  ROUTES: 'Routes',
  SCHEDULE: 'Schedule',
  STATIONS: 'Stations',
} as const;
