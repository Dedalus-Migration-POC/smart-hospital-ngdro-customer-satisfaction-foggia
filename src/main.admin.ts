import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AdminModule } from './admin/admin.module';

platformBrowserDynamic().bootstrapModule(AdminModule, {
  ngZoneEventCoalescing: true
})
  .catch(err => console.error(err));
