import assert from 'node:assert/strict';
import test from 'node:test';

import { countUpFrame, easeOutCubic, splitCountText } from '../src/lib/motion.mjs';

test('splitCountText separates an integer head from a static tail', () => {
  assert.deepEqual(splitCountText('51/51'), { head: 51, tail: '/51' });
  assert.deepEqual(splitCountText('5'), { head: 5, tail: '' });
  assert.deepEqual(splitCountText('0'), { head: 0, tail: '' });
});

test('splitCountText leaves non-numeric text untouched', () => {
  assert.deepEqual(splitCountText('beta'), { head: null, tail: 'beta' });
  assert.deepEqual(splitCountText(''), { head: null, tail: '' });
});

test('easeOutCubic clamps to the 0..1 range and keeps endpoints', () => {
  assert.equal(easeOutCubic(0), 0);
  assert.equal(easeOutCubic(1), 1);
  assert.equal(easeOutCubic(-0.5), 0);
  assert.equal(easeOutCubic(1.5), 1);
  assert.ok(easeOutCubic(0.5) > 0.85, 'eases out fast early');
});

test('countUpFrame starts at 0 and lands exactly on the target', () => {
  assert.equal(countUpFrame(50, 0), 0);
  assert.equal(countUpFrame(50, 1), 50);
  assert.equal(countUpFrame(50, 2), 50);
  const mid = countUpFrame(50, 0.5);
  assert.ok(mid > 25 && mid < 50, 'mid-flight value is monotonic and below target');
});
