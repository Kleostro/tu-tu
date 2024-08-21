import { APP_ROUTE } from '@/app/shared/constants/routes';

export const AUTH_LINKS = [
  {
    path: APP_ROUTE.SIGN_UP,
    icon: 'pi pi-user-plus',
    title: 'Sign Up',
  },
  {
    path: APP_ROUTE.SIGN_IN,
    icon: 'pi pi-sign-in',
    title: 'Sign In',
  },
];

export const USER_LINKS = [
  {
    path: APP_ROUTE.ORDERS,
    icon: 'pi pi-receipt',
    title: 'Orders',
  },
];

export const USER_LINK = {
  path: APP_ROUTE.PROFILE,
  icon: 'account_circle',
  title: 'Profile',
};

export const ADMIN_LINK = {
  path: APP_ROUTE.ADMIN,
  icon: 'admin_panel_settings',
  title: 'Profile',
};
