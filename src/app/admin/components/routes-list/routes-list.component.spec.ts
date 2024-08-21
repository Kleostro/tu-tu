import { provideHttpClient } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserMessageService } from '@/app/shared/services/userMessage/user-message.service';

import { RoutesListComponent } from './routes-list.component';

describe('RoutesListComponent', () => {
  let component: RoutesListComponent;
  let fixture: ComponentFixture<RoutesListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RoutesListComponent],
      providers: [provideHttpClient(), { provide: UserMessageService, useValue: {} }],
    }).compileComponents();

    fixture = TestBed.createComponent(RoutesListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
