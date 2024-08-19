import { ChangeDetectionStrategy, Component, inject, OnDestroy, OnInit, signal } from '@angular/core';

import { Subject, takeUntil } from 'rxjs';

import { ProfileService } from '@/app/api/profileService/profile.service';

import { UserInfoComponent } from '../../components/user-info/user-info.component';
import { PersonalInfoService } from '../../services/personalInfo/personal-info.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [UserInfoComponent],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProfileComponent implements OnInit, OnDestroy {
  private profileService = inject(ProfileService);
  private personalInfoService = inject(PersonalInfoService);

  private destroy$ = new Subject<void>();

  public userInfoLoaded$$ = signal(false);

  public ngOnInit(): void {
    this.profileService
      .getProfile()
      .pipe(takeUntil(this.destroy$))
      .subscribe((data) => {
        const { email, name } = data;
        this.personalInfoService.setUserInfo(email, name);
        this.userInfoLoaded$$.set(true);
      });
  }

  public ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
