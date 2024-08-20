import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { OverriddenHttpErrorResponse } from '../models/errorResponse';
import { User } from '../models/user';
import { SignUpService } from './sign-up.service';
import ENDPOINTS from '../constants/constants';

describe('SignUpService', () => {
  let service: SignUpService;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(SignUpService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('service should correctly send request', (done) => {
    const userData: User = { email: 'test@test.com', password: 'Abcdefghigk' };
    service.signUp(userData).subscribe((res) => {
      expect(res).toEqual({});
      done();
    });

    const req = httpTestingController.expectOne(ENDPOINTS.SIGN_UP);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(userData);
    req.flush({});
  });

  it('should correctly handle error if user already exist', (done) => {
    const userData: User = { email: 'iam@exist.com', password: 'Passwordtest' };

    service.signUp(userData).subscribe({
      next: () => fail('expected error from server'),
      error: (err: OverriddenHttpErrorResponse) => {
        expect(err.status).toBe(400);
        expect(err.error.message).toBe('User already exists');
        expect(err.error.reason).toBe('invalidUniqueKey');
        expect(err.ok).toBe(false);
        done();
      },
    });

    const req = httpTestingController.expectOne(ENDPOINTS.SIGN_UP);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(userData);

    req.flush(
      {
        message: 'User already exists',
        reason: 'invalidUniqueKey',
      },
      { status: 400, statusText: 'Bad Request' },
    );
  });
});
