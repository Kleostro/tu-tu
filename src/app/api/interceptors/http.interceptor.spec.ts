import { HttpClient, HttpInterceptorFn, provideHttpClient, withInterceptors } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import LocalStorageService from '../../core/services/local-storage.service';
import { httpInterceptor } from './http.interceptor';

describe('httpInterceptorInterceptor', () => {
  const interceptor: HttpInterceptorFn = (req, next) => TestBed.runInInjectionContext(() => httpInterceptor(req, next));
  let httpTestingController: HttpTestingController;
  let httpClient: HttpClient;
  let localStorageService: LocalStorageService;
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(withInterceptors([httpInterceptor])), provideHttpClientTesting()],
    });

    localStorageService = TestBed.inject(LocalStorageService);
    httpTestingController = TestBed.inject(HttpTestingController);
    httpClient = TestBed.inject(HttpClient);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('should be created', () => {
    expect(interceptor).toBeTruthy();
  });

  it.each([
    { token: 'mocktoken', expectedHeader: 'Bearer mocktoken' },
    { token: null, expectedHeader: null },
  ])('should correctly add token to header or not if token is not exist', ({ token, expectedHeader }) => {
    jest.spyOn(localStorageService, 'getValueByKey').mockReturnValue(token);
    httpClient.get('mock').subscribe();

    const req = httpTestingController.expectOne('/api/mock');

    if (expectedHeader) {
      expect(req.request.headers.get('Authorization')).toEqual(expectedHeader);
    } else {
      expect(req.request.headers.has('Authorization')).toBe(false);
    }

    req.flush({});
  });
});
