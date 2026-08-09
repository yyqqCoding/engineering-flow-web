import assert from 'node:assert/strict';
import test from 'node:test';

import { localizePath, switchLocale } from '../src/lib/routes.mjs';

test('localizes root and nested paths', () => {
  assert.equal(localizePath('en'), '/en');
  assert.equal(localizePath('zh-CN', '/workflows/develop/'), '/zh-CN/workflows/develop');
});

test('switches locale while preserving the current route', () => {
  assert.equal(switchLocale('/en/evidence', 'zh-CN'), '/zh-CN/evidence');
  assert.equal(switchLocale('/docs', 'en'), '/en/docs');
});
