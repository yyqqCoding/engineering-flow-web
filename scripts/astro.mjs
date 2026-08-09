// Keep local and CI builds deterministic without writing user-global telemetry state.
process.env.ASTRO_TELEMETRY_DISABLED = '1';

await import('../node_modules/astro/bin/astro.mjs');
