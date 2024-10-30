import {platformBrowserDynamic} from '@angular/platform-browser-dynamic';

import {AdminModule} from './app/admin/admin.module';

platformBrowserDynamic().bootstrapModule(AdminModule, {
  ngZoneEventCoalescing: true
})
  .catch(err => console.error(err));
