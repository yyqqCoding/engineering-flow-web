export const playgroundStates = [
  'discover',
  'clarify',
  'checkpoint',
  'approval',
  'implement',
  'verify',
  'complete',
];

/** @typedef {{ stepIndex: number, approved: boolean }} PlaygroundState */

/** @returns {PlaygroundState} */
export function createPlaygroundState() {
  return { stepIndex: 0, approved: false };
}

/** @param {PlaygroundState} state @returns {PlaygroundState} */
export function advancePlayground(state) {
  if (state.stepIndex === 3 && !state.approved) {
    return state;
  }

  return {
    ...state,
    stepIndex: Math.min(state.stepIndex + 1, playgroundStates.length - 1),
  };
}

/** @param {PlaygroundState} state @returns {PlaygroundState} */
export function approvePlayground(state) {
  if (state.stepIndex !== 3) {
    return state;
  }

  return { ...state, approved: true };
}

/** @returns {PlaygroundState} */
export function resetPlayground() {
  return createPlaygroundState();
}
