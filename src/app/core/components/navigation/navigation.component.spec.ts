import { HttpClient } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';

import { of } from 'rxjs';

import { UserMessageService } from '@/app/shared/services/userMessage/user-message.service';

import LocalStorageData from '../../models/store.model';
import { LocalStorageService } from '../../services/local-storage/local-storage.service';
import { NavigationComponent } from './navigation.component';

describe('NavigationComponent', () => {
  let component: NavigationComponent;
  let fixture: ComponentFixture<NavigationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NavigationComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            queryParams: of({}),
          },
        },
        { provide: HttpClient, useValue: {} },
        {
          provide: UserMessageService,
          useValue: {
            showSuccessMessage: (): void => {},
            showErrorMessage: (): void => {},
            showInfoMessage: (): void => {},
            showWarningMessage: (): void => {},
          },
        },
        {
          provide: LocalStorageService,
          useValue: {
            getValueByKey: (key: string): unknown => {
              if (key === 'token') {
                return 'mockToken';
              }
              if (key === 'email') {
                return 'mockEmail';
              }
              return null;
            },
            addValueByKey: (): void => {},
            removeValueByKey: (): void => {},
            clear: (): void => {},
            save: (): void => {},
            saveCurrentUser: (): void => {},
            init: (): LocalStorageData => ({}),
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(NavigationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
