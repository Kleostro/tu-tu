import { provideHttpClient } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserMessageService } from '@/app/shared/services/userMessage/user-message.service';

import { RideComponent } from './ride.component';

describe('RideComponent', () => {
  let component: RideComponent;
  let fixture: ComponentFixture<RideComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RideComponent],
      providers: [provideHttpClient(), { provide: UserMessageService, useValue: {} }],
    }).compileComponents();

    fixture = TestBed.createComponent(RideComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
