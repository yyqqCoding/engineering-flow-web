/**
 * 演示状态机：与具体工作流解耦。
 * config.steps 为步骤总数；config.gateIndex 为人工批准关卡的下标（只读流程传 null）。
 */
/** @typedef {{ steps: number, gateIndex: number | null }} PlaygroundConfig */
/** @typedef {{ stepIndex: number, approved: boolean }} PlaygroundState */

/** @returns {PlaygroundState} */
export function createPlaygroundState() {
  return { stepIndex: 0, approved: false };
}

/** @param {PlaygroundState} state @param {PlaygroundConfig} config @returns {PlaygroundState} */
export function advancePlayground(state, config) {
  if (state.stepIndex === config.gateIndex && !state.approved) {
    return state;
  }

  return {
    ...state,
    stepIndex: Math.min(state.stepIndex + 1, config.steps - 1),
  };
}

/** @param {PlaygroundState} state @param {PlaygroundConfig} config @returns {PlaygroundState} */
export function approvePlayground(state, config) {
  if (config.gateIndex === null || state.stepIndex !== config.gateIndex) {
    return state;
  }

  return { ...state, approved: true };
}

/** @returns {PlaygroundState} */
export function resetPlayground() {
  return createPlaygroundState();
}

/**
 * 键盘回退：退一步用于重看上一幕。退到关卡之前会撤销批准，
 * 再次前进时仍需人工批准，保证「未经批准不得越过关卡」在回放中同样成立。
 * @param {PlaygroundState} state @param {PlaygroundConfig} config @returns {PlaygroundState}
 */
export function retreatPlayground(state, config) {
  if (state.stepIndex <= 0) {
    return state;
  }

  const stepIndex = state.stepIndex - 1;
  const approved = config.gateIndex === null
    ? state.approved
    : state.approved && stepIndex >= config.gateIndex;
  return { ...state, stepIndex, approved };
}
