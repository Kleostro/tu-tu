export const NAVIGATION_LINKS = [
  {
    path: 'sign-up',
    icon: 'pi pi-user-plus',
    title: 'Sign Up',
    auth: false,
  },
  {
    path: 'sign-in',
    icon: 'pi pi-sign-in',
    title: 'Sign In',
    auth: false,
  },
  {
    path: 'orders',
    icon: 'pi pi-receipt',
    title: 'Orders',
    auth: true,
  },
];

export const USER_LINK = {
  path: 'profile',
  icon: 'account_circle',
  title: 'Profile',
  auth: true,
};

export const ADMIN_LINK = {
  path: 'admin',
  icon: 'admin_panel_settings',
  title: 'Profile',
  auth: true,
};
