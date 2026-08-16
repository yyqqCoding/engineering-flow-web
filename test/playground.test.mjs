import assert from 'node:assert/strict';
import test from 'node:test';

import {
  advancePlayground,
  approvePlayground,
  createPlaygroundState,
  resetPlayground,
  retreatPlayground,
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

test('retreat steps back and keeps approval while staying at or past the gate', () => {
  const approved = { stepIndex: 4, approved: true };
  assert.deepEqual(retreatPlayground(approved, gatedConfig), { stepIndex: 3, approved: true });
});

test('retreat behind the gate revokes approval so it must be granted again', () => {
  const approved = { stepIndex: 3, approved: true };
  const steppedBack = retreatPlayground(approved, gatedConfig);
  assert.deepEqual(steppedBack, { stepIndex: 2, approved: false });
  const replayed = advancePlayground(advancePlayground(steppedBack, gatedConfig), gatedConfig);
  assert.deepEqual(replayed, { stepIndex: 3, approved: false }, 'gate blocks again until re-approved');
});

test('retreat never goes below the first step', () => {
  assert.deepEqual(retreatPlayground(createPlaygroundState(), gatedConfig), createPlaygroundState());
  assert.deepEqual(retreatPlayground({ stepIndex: 2, approved: false }, openConfig), {
    stepIndex: 1,
    approved: false,
  });
});
