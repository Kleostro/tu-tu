import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { MessageModule } from 'primeng/message';
import { MessagesModule } from 'primeng/messages';
import { PasswordModule } from 'primeng/password';
import { of } from 'rxjs';

import { SignUpService } from '../../../api/signUpService/sign-up.service';
import { RegisterComponent } from './register.component';

describe('RegisterComponent', () => {
  let component: RegisterComponent;
  let fixture: ComponentFixture<RegisterComponent>;
  let signUpService: SignUpService;

  beforeEach(async () => {
    const signUpServiceMock = {
      signUp: jest.fn(),
    };
    const messageServiceMock = {
      add: jest.fn(),
    };

    await TestBed.configureTestingModule({
      imports: [
        RegisterComponent,
        ReactiveFormsModule,
        InputTextModule,
        ButtonModule,
        MessagesModule,
        MessageModule,
        PasswordModule,
      ],
      providers: [
        { provide: SignUpService, useValue: signUpServiceMock },
        { provide: MessageService, useValue: messageServiceMock },
        { provide: FormBuilder, useValue: new FormBuilder() },
        { provide: ActivatedRoute, useValue: { snapshot: { queryParams: {} } } },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(RegisterComponent);
    component = fixture.componentInstance;
    signUpService = TestBed.inject(SignUpService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize the registration form', () => {
    expect(component.registrationForm).toBeDefined();
    expect(component.registrationForm.controls.email).toBeDefined();
    expect(component.registrationForm.controls.password).toBeDefined();
    expect(component.registrationForm.controls.confirm).toBeDefined();
  });

  it('should validate password match', () => {
    const passwordControl = component.registrationForm.controls.password;
    const confirmControl = component.registrationForm.controls.confirm;
    passwordControl.setValue('password123');
    confirmControl.setValue('password1234');
    fixture.detectChanges();
    expect(component.registrationForm.errors?.['passwordMismatch']).toBeTruthy();
    confirmControl.setValue('password123');
    fixture.detectChanges();
    expect(component.registrationForm.errors?.['passwordMismatch']).toBeUndefined();
  });

  it('should reset the form on successful registration', () => {
    jest.spyOn(signUpService, 'signUp').mockReturnValue(of({}));
    component.submitForm();
    fixture.detectChanges();
    expect(component.registrationForm.pristine).toBeTruthy();
    expect(component.registrationForm.untouched).toBeFalsy();
  });
});
