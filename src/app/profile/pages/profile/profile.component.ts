import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';

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
export class ProfileComponent implements OnInit {
  private profileService = inject(ProfileService);
  private personalInfoService = inject(PersonalInfoService);
  public userInfoLoaded$$ = signal(false);

  public ngOnInit(): void {
    this.profileService.getProfile().subscribe((data) => {
      const { email, name } = data;
      this.personalInfoService.setUserInfo(email, name);
      this.userInfoLoaded$$.set(true);
    });
  }
}
