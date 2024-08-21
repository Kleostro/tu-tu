import { HttpHeaders, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';

import { LocalStorageService } from '../../core/services/local-storage/local-storage.service';
import ENDPOINTS from '../constants/constants';

export const httpInterceptor: HttpInterceptorFn = (req, next) => {
  const localStorageService = inject(LocalStorageService);
  const token = localStorageService.getValueByKey('token');
  let headers = new HttpHeaders();
  if (typeof token === 'string') {
    headers = headers.append('Authorization', `Bearer ${token}`);
  }
  const newReq = req.clone({
    url: `/${ENDPOINTS.BASE_URL}/${req.url}`,
    headers,
  });

  return next(newReq);
};
