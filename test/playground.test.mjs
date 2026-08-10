import assert from 'node:assert/strict';
import test from 'node:test';

import {
  advancePlayground,
  approvePlayground,
  createPlaygroundState,
  resetPlayground,
} from '../src/lib/playground.mjs';

const gatedConfig = { steps: 7, gateIndex: 3 };
const openConfig = { steps: 4, gateIndex: null };

test('advances through ordinary states', () => {
  assert.deepEqual(advancePlayground(createPlaygroundState(), gatedConfig), {
    stepIndex: 1,
    approved: false,
  });
});

test('stops at the final step', () => {
  const last = { stepIndex: 6, approved: true };
  assert.deepEqual(advancePlayground(last, gatedConfig), last);
});

test('cannot pass the approval gate before explicit approval', () => {
  const waiting = { stepIndex: 3, approved: false };
  assert.deepEqual(advancePlayground(waiting, gatedConfig), waiting);
  assert.deepEqual(advancePlayground(approvePlayground(waiting, gatedConfig), gatedConfig), {
    stepIndex: 4,
    approved: true,
  });
});

test('read-only flows have no gate and reject approval', () => {
  const state = { stepIndex: 2, approved: false };
  assert.deepEqual(advancePlayground(state, openConfig), { stepIndex: 3, approved: false });
  assert.deepEqual(approvePlayground(state, openConfig), state);
});

test('reset returns the initial state', () => {
  assert.deepEqual(resetPlayground(), { stepIndex: 0, approved: false });
});
