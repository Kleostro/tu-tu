import { APP_ROUTE } from '@/app/shared/constants/routes';

export const NAVIGATION_LINKS = [
  {
    path: APP_ROUTE.SIGN_UP,
    icon: 'pi pi-user-plus',
    title: 'Sign Up',
    auth: false,
  },
  {
    path: APP_ROUTE.SIGN_IN,
    icon: 'pi pi-sign-in',
    title: 'Sign In',
    auth: false,
  },
  {
    path: APP_ROUTE.ORDERS,
    icon: 'pi pi-receipt',
    title: 'Orders',
    auth: true,
  },
];

export const USER_LINK = {
  path: APP_ROUTE.PROFILE,
  icon: 'account_circle',
  title: 'Profile',
  auth: true,
};

export const ADMIN_LINK = {
  path: APP_ROUTE.ADMIN,
  icon: 'admin_panel_settings',
  title: 'Profile',
  auth: true,
};
