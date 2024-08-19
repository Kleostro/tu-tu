import { ChangeDetectionStrategy, Component } from '@angular/core';

import { UserInfoComponent } from '../../components/user-info/user-info.component';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [UserInfoComponent],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProfileComponent {}
