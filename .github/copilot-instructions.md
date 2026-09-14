# Copilot Instructions — customer-satisfaction-foggia

Angular 18 app for "Policlinico Foggia - Questionario di gradimento" (patient
satisfaction survey). Public survey UI + a separate admin back-office, built
from the same Angular workspace but as two distinct bundles.

## Commands

Package manager is **yarn** (see `packageManager` in `package.json`), but npm
scripts work too.

- `npm start` — serve the public survey app (`ng serve --proxy-config proxy.conf.js`), http://localhost:4200
- `npm run start:admin` — serve the admin app on port 4201, proxied via `src/proxy.conf.js`
- `npm run start:admin-dev` — same as above but using `src/proxy-dev.conf.js`
- `npm run build` — builds the public app (`ng build`, default config `production`)
- `npm run watch` — incremental dev build (`ng build --watch --configuration development`)
- `npm test` — runs Karma/Jasmine unit tests
- `npm run format` — Prettier write across `css,scss,js,ts,html,svg`

To build/serve the **admin** bundle for a specific environment, pass the
matching Angular configuration, e.g.:
`ng build --configuration admin/staging`, `ng serve --configuration admin/development`.
Valid configurations: `production` (default), `development`, `integration`,
`staging`, and their `admin/*` counterparts.

**Running a single test**: Karma doesn't support file filtering via CLI flags
easily; use Karma's `--grep`-like behavior isn't built in — instead scope with
Jasmine `fdescribe`/`fit` in the spec file, or run `ng test --include='**/path/to/file.spec.ts'`.

There is no lint script configured; only Prettier formatting is enforced.

## Architecture

This is **one Angular workspace with two independent app roots**, sharing
most infrastructure:

- **Public survey app**: entry `src/main.ts` → `src/app/app.module.ts` →
  `AppRoutingModule`. Routes are lazy-loaded feature modules:
  - `questionario/:id` → `pages/auth/auth.module.ts` (OTP-based access to a survey link)
  - `questionnaire/:surveyId` → `pages/questionnaire/quest.module.ts` (the actual survey form)
  - `privacy` → static `PrivacyComponent`
- **Admin app**: entry `src/main.admin.ts` → `src/app/admin/admin.module.ts` →
  `admin/admin-routing.module.ts`. Manages surveys, sections, templates,
  healthcare units, and operator/role access, behind Keycloak auth.

Both apps are built from the **same `angular.json` project** using different
`browser` entry points and style sheets per configuration (see `admin/*`
configurations in `angular.json`), and different `APP_BASE_HREF` values
(`/ui/` for public, `/admin-ui/` for admin) so both can be deployed under the
same origin.

### State management (NgRx, per-feature)

Each app composes its own root reducer/effects map from independent feature
slices — there is no shared store between the two apps:

- Public app: `src/app/store/reducers.ts` and `store/effects.ts` combine
  `pages/auth/state/*` and `pages/questionnaire/state/*`.
- Admin app: `src/app/admin/store/store.ts` combines
  `admin/store/application`, `admin/store/section`, `admin/store/survey`
  (reused for both `survey` and `allSurvey` keys), and `admin/store/units`.

Every feature state folder follows the same file layout:
`actions.ts`, `reducer.ts`, `selectors.ts`, `effects.ts`, `service.ts`
(HTTP calls), and `mock.ts` (test fixtures). Follow this structure when adding
a new feature slice.

### HTTP / auth interceptors

- `BaseUrlInterceptor` exists **twice** (`src/app/utils/baseUrl.interceptor.ts`
  for the public app, `src/app/admin/config/baseUrl.interceptor.ts` for admin)
  — keep them in sync if the URL-rewriting logic changes. It rewrites relative
  request URLs to absolute ones (`window.location.origin + url`), except
  Keycloak token requests which go to `environment.keycloakEndpoint`.
- Admin app additionally registers `AuthInterceptor`
  (`admin/config/auth.interceptor.ts`), which attaches the JWT from
  `localStorage.profile`, silently refreshes it via Keycloak when it's close
  to expiring, and dispatches `AppActions.logout()` on 401/refresh failure.
- Route guards live in `admin/config/*.route-guard.ts`
  (`admin.route-guard`, `not-role.route-guard`, `operator.route-guard`).

### Environments

`src/environments/environment.ts` is the default (used by `fileReplacements`
in each Angular configuration). Public app environments:
`environment.development.ts`, `environment.integration.ts`,
`environment.staging.ts`. Admin app environments live under
`src/environments/environment.admin/{development,integration,staging,production}.ts`.
Each exposes `production`, `keycloakEndpoint`, and `viewAnalyticsEndpoint`.

### i18n

Uses `@ngx-translate/core` with `ngx-translate-multi-http-loader`, loading
`design-angular-kit`'s bundled translations first, then `src/assets/i18n/`
(project-specific overrides/additions), via `provideDesignAngularKit`'s
`translateLoader` factory (duplicated in both `app.module.ts` and
`admin.module.ts`).

### UI kit

Built on **Bootstrap Italia** / `design-angular-kit` (Italian public
administration design system) plus Angular Material (admin only, e.g.
paginator, slide-toggle, date adapter with Moment). `PostBuild.js` runs after
`ng build` to stamp the built `dist/index.html` with app title/version and
rewrite placeholders (`TITLE_PLACEHOLDER`, favicon, deploy URL) — invoke it as
a separate step after `ng build` when producing a release artifact.

## Conventions

- Prettier config: no semicolons, single quotes, trailing commas, 2-space
  indent, 80 print width (`.prettierrc.js`). New components default to
  non-standalone with `scss` styles (`angular.json` schematics defaults).
- New feature modules should be lazy-loaded from the relevant routing module,
  following the existing `loadChildren` pattern in `app-routing.module.ts` /
  `admin-routing.module.ts`.
