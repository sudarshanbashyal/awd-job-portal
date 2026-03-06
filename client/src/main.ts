// packages
import { bootstrapApplication } from '@angular/platform-browser';

// module
import { App } from './app/app';

// config
import { appConfig } from './app/app.config';

bootstrapApplication(App, appConfig).catch((err) => console.error(err));
