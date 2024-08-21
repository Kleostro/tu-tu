import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

import { APP_PATH } from '@/app/shared/constants/routes';

import { AuthService } from '../services/auth-service/auth.service';

export const authGuard: CanActivateFn = () =>
  inject(AuthService).isLoggedIn$$() || inject(Router).navigate([APP_PATH.DEFAULT]);

export const loginGuard: CanActivateFn = () =>
  !inject(AuthService).isLoggedIn$$() || inject(Router).navigate([APP_PATH.DEFAULT]);
