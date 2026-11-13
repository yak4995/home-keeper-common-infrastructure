# HomeKeeper common infrastructure

Shared NestJS modules, service facades, RabbitMQ gateways, Redis cache,
configuration, tracing and persistence helpers for HomeKeeper services.

Version 0.1.1 requires Node.js 24.15+ (24.x) and NestJS 12.5+ (12.x).
See [MIGRATION.md](MIGRATION.md) before updating any consuming service.

```sh
nvm install 24.22.3
nvm use 24.22.3
npm ci
npm run typecheck
npm run lint
npm test
npm run build
npm audit
```

The package publishes CommonJS JavaScript and TypeScript declarations from
`lib/`. Nest packages are peer dependencies owned by the host application.
The build clears `lib/` before compilation and excludes test files. Vitest runs
the persistence utility tests; Oxlint checks the TypeScript sources. Use
`npm run test:watch` for watch mode.
