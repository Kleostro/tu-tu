import { Component, inject, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { PrimeNGConfig } from 'primeng/api';

import { HeaderComponent } from './core/components/header/header.component';
import { LocalStorageService } from './core/services/local-storage/local-storage.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  standalone: true,
  imports: [RouterOutlet, HeaderComponent],
})
export class AppComponent implements OnInit {
  private localStorageService = inject(LocalStorageService);
  private primengConfig = inject(PrimeNGConfig);

  public ngOnInit(): void {
    this.localStorageService.init();
    this.primengConfig.ripple = true;
  }
}
