import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

import { LocalStorageService } from '@/app/core/services/local-storage/local-storage.service';
import { APP_PATH } from '@/app/shared/constants/routes';

export const adminGuard: CanActivateFn = () =>
  inject(LocalStorageService).isAdmin$$() || inject(Router).navigate([APP_PATH.DEFAULT]);
