import { provideHttpClient } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserMessageService } from '@/app/shared/services/userMessage/user-message.service';

import { CreateRideFormComponent } from './create-ride-form.component';

describe('CreateRideFormComponent', () => {
  let component: CreateRideFormComponent;
  let fixture: ComponentFixture<CreateRideFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateRideFormComponent],
      providers: [provideHttpClient(), { provide: UserMessageService, useValue: {} }],
    }).compileComponents();

    fixture = TestBed.createComponent(CreateRideFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
