import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

import { APP_PATH } from '@/app/shared/constants/routes';

import { AuthService } from '../services/auth-service/auth.service';

export const adminGuard: CanActivateFn = () =>
  inject(AuthService).isAdmin$$() || inject(Router).navigate([APP_PATH.DEFAULT]);
