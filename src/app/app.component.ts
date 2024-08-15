import { Component, inject, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import LocalStorageService from './core/services/local-storage.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  standalone: true,
  imports: [RouterOutlet],
  providers: [LocalStorageService],
})
export class AppComponent implements OnInit {
  private localStorageService = inject(LocalStorageService);

  public ngOnInit(): void {
    this.localStorageService.init();
  }
}
