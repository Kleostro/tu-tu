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

export const ADMIN_PATH = {
  CARRIAGES: 'Carriages',
  ROUTES: 'Routes',
  SCHEDULE: 'Schedule',
  STATIONS: 'Stations',
} as const;

export const APP_ROUTE = {
  ADMIN: `/${APP_PATH.ADMIN}`,
  NOT_FOUND: `/${APP_PATH.NOT_FOUND}`,
  SIGN_IN: `/${APP_PATH.SIGN_IN}`,
  SIGN_UP: `/${APP_PATH.SIGN_UP}`,
  PROFILE: `/${APP_PATH.PROFILE}`,
  TRIP: `/${APP_PATH.TRIP}`,
} as const;
