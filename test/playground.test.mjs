import assert from 'node:assert/strict';
import test from 'node:test';

import {
  advancePlayground,
  approvePlayground,
  createPlaygroundState,
  resetPlayground,
} from '../src/lib/playground.mjs';

test('advances through ordinary states', () => {
  assert.deepEqual(advancePlayground(createPlaygroundState()), {
    stepIndex: 1,
    approved: false,
  });
});

test('cannot pass the approval gate before explicit approval', () => {
  const waiting = { stepIndex: 3, approved: false };
  assert.deepEqual(advancePlayground(waiting), waiting);
  assert.deepEqual(advancePlayground(approvePlayground(waiting)), {
    stepIndex: 4,
    approved: true,
  });
});

test('reset returns the initial state', () => {
  assert.deepEqual(resetPlayground(), { stepIndex: 0, approved: false });
});
