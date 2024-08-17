import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { ApplicationConfig, provideExperimentalZonelessChangeDetection } from '@angular/core';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideRouter, withComponentInputBinding, withInMemoryScrolling, withViewTransitions } from '@angular/router';

// import { provideNzIcons } from 'ng-zorro-antd/icon';

// import { IconDefinition } from '@ant-design/icons-angular';
// import { AccountBookFill, AlertFill, AlertOutline } from '@ant-design/icons-angular/icons';

import { httpInterceptor } from './api/interceptors/http.interceptor';
import routes from './app.routes';

// const icons: IconDefinition[] = [AccountBookFill, AlertOutline, AlertFill];

const appConfig: ApplicationConfig = {
  providers: [
    provideExperimentalZonelessChangeDetection(),
    provideRouter(
      routes,
      withComponentInputBinding(),
      withViewTransitions(),
      withInMemoryScrolling({ scrollPositionRestoration: 'enabled' }),
    ),
    // provideNzIcons(icons),
    provideAnimationsAsync(),
    provideHttpClient(withInterceptors([httpInterceptor])),
  ],
};
export default appConfig;
