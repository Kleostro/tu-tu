import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

import { LocalStorageService } from '@/app/core/services/local-storage/local-storage.service';
import { APP_PATH } from '@/app/shared/constants/routes';

export const authGuard: CanActivateFn = () =>
  inject(LocalStorageService).isLoggedIn$$() || inject(Router).navigate([APP_PATH.DEFAULT]);
