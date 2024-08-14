import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { NzButtonModule } from 'ng-zorro-antd/button';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  standalone: true,
  imports: [RouterOutlet, NzButtonModule],
})
export class AppComponent {}
