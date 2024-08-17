import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { OverriddenHttpErrorResponse } from '../models/errorResponse';
import { User } from '../models/user';
import { SignInService } from './sign-in.service';

describe('SignInService', () => {
  let service: SignInService;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(SignInService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('service should correctly send request and receive token', (done) => {
    const userData: User = { email: 'test@test.com', password: 'Abracadabra' };
    const mockResponse = { token: 'testingtoken' };
    service.signIn(userData).subscribe((res) => {
      expect(res).toEqual(mockResponse);
      done();
    });

    const req = httpTestingController.expectOne('signin');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(userData);
    req.flush(mockResponse);
  });

  it('should correctly handle error if email is not found or password is incorrect', (done) => {
    const userData: User = { email: 'iam@not-exist.com', password: 'Passwordtest' };

    service.signIn(userData).subscribe({
      next: () => fail('expected error from server because user is not found or password is incorrect'),
      error: (err: OverriddenHttpErrorResponse) => {
        expect(err.status).toBe(400);
        expect(err.error.message).toBe('User is not found');
        expect(err.error.reason).toBe('userNotFound');
        expect(err.ok).toBe(false);
        done();
      },
    });

    const req = httpTestingController.expectOne('signin');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(userData);

    req.flush(
      {
        message: 'User is not found',
        reason: 'userNotFound',
      },
      { status: 400, statusText: 'Bad Request' },
    );
  });
});
