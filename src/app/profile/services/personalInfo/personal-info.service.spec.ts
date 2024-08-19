import { TestBed } from '@angular/core/testing';

import { of } from 'rxjs';

import { Profile } from '@/app/api/models/profile';
import { ProfileService } from '@/app/api/profileService/profile.service';
import { LocalStorageService } from '@/app/core/services/local-storage/local-storage.service';

import { PersonalInfoService } from './personal-info.service';

describe('PersonalInfoService', () => {
  let service: PersonalInfoService;
  let profileServiceMock: jest.Mocked<Partial<ProfileService>>;
  let localStorageServiceMock: jest.Mocked<Partial<LocalStorageService>>;

  beforeEach(() => {
    profileServiceMock = {
      getProfile: jest.fn(),
      updateProfile: jest.fn(),
      updatePassword: jest.fn(),
    } as jest.Mocked<Partial<ProfileService>>;

    localStorageServiceMock = {
      getValueByKey: jest.fn(),
      addValueByKey: jest.fn(),
      removeValueByKey: jest.fn(),
      clear: jest.fn(),
      save: jest.fn(),
      saveCurrentUser: jest.fn(),
      updateCurrentUser: jest.fn(),
      init: jest.fn(),
    } as jest.Mocked<Partial<LocalStorageService>>;

    TestBed.configureTestingModule({
      providers: [
        PersonalInfoService,
        { provide: ProfileService, useValue: profileServiceMock },
        { provide: LocalStorageService, useValue: localStorageServiceMock },
      ],
    });

    service = TestBed.inject(PersonalInfoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should initialize currentUserName and currentUserEmail from localStorage', () => {
    expect(localStorageServiceMock.getValueByKey).toBeDefined();

    (localStorageServiceMock.getValueByKey as jest.Mock).mockImplementation(() => '');

    expect(service.currentUserName()).toBe('');
    expect(service.currentUserEmail()).toBe('');
  });

  it('should set user info', () => {
    service.setUserInfo('new.email@example.com', 'New Name');
    expect(service.currentUserEmail()).toBe('new.email@example.com');
    expect(service.currentUserName()).toBe('New Name');
  });

  it('should update profile', (done) => {
    const profileData: Profile = { email: 'updated.email@example.com', name: 'Updated Name' };
    (profileServiceMock.updateProfile as jest.Mock).mockReturnValue(of(profileData));

    service.updateProfile('updated.email@example.com', 'Updated Name');

    expect(profileServiceMock.updateProfile).toHaveBeenCalledWith('updated.email@example.com', 'Updated Name');

    setTimeout(() => {
      expect(service.currentUserEmail()).toBe('updated.email@example.com');
      expect(service.currentUserName()).toBe('Updated Name');
      expect(localStorageServiceMock.updateCurrentUser).toHaveBeenCalledWith(
        'updated.email@example.com',
        'Updated Name',
      );
      done();
    }, 0);
  });
});
