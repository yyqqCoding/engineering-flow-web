import type { Locale, WorkflowSlug } from './site';
import { developSteps, snapshotMeta } from './site';

const localized = <T>(en: T, zh: T): Record<Locale, T> => ({ en, 'zh-CN': zh });

type LocalText = Record<Locale, string>;

export interface WorkflowDemo {
  slug: WorkflowSlug;
  /** 人工批准关卡所在步骤下标；全程只读的流程为 null */
  gateIndex: number | null;
  /** 实施类流程完成后展示的文件变更数；只读流程恒为 0 */
  mutationsAfter: number;
  scenario: LocalText;
  request: LocalText;
  steps: Array<{ icon: string; title: LocalText; description: LocalText }>;
  /** 与 steps 一一对应：推进到第 i 步时展示第 i 条轨迹 */
  trace: Array<{ actor: string; title: LocalText; body: LocalText }>;
  evidence: LocalText[];
}

export const playgroundMeta = {
  ...snapshotMeta,
  sourceReport: 'develop-requirement-lifecycle',
} as const;

export const playgroundDemos: WorkflowDemo[] = [
  {
    slug: 'develop',
    // 关卡位置从步骤 id 推导，developSteps 增删节点时不必再手工对齐下标
    gateIndex: developSteps.findIndex((step) => step.id === 'approval'),
    mutationsAfter: 3,
    scenario: localized('Customer CSV export', '客户 CSV 导出'),
    request: localized(
      'Add a customer CSV export with filtering, numeric sorting, input preservation, and focused tests.',
      '增加客户 CSV 导出，支持过滤、数字排序、保持输入不变，并添加聚焦测试。',
    ),
    steps: developSteps.map((step) => ({ icon: step.icon, title: step.title, description: step.description })),
    trace: [
      {
        actor: 'USER',
        title: localized('Request received', '收到用户请求'),
        body: localized('The contract names validation, filtering, sorting, escaping, and verification behavior.', '契约明确了校验、过滤、排序、转义和验证行为。'),
      },
      {
        actor: 'AGENT',
        title: localized('Repository context discovered', '已发现仓库上下文'),
        body: localized('The existing customer export module is the owning boundary. No unrelated files need to change.', '现有客户导出模块是规则所有者，无需修改无关文件。'),
      },
      {
        actor: 'CHECKPOINT',
        title: localized('Implementation boundary recorded', '已记录实施边界'),
        body: localized('Goal, acceptance examples, out of scope, assumptions, and the solution boundary are ready — and approval is stated as still pending.', '目标、验收实例、范围外事项、假设和方案边界已就绪，并明确说明"批准待定"。'),
      },
      {
        actor: 'HUMAN GATE',
        title: localized('Explicit approval required', '需要明确批准'),
        body: localized('Production code, tests, and configuration remain unchanged until the user approves implementation.', '在用户批准实施前，生产代码、测试和配置保持不变。'),
      },
      {
        actor: 'AGENT',
        title: localized('Focused implementation', '聚焦实施'),
        body: localized('Validation, filtering, sorting, and CSV escaping are applied at the existing module boundary, in independently verifiable slices.', '校验、过滤、排序和 CSV 转义在现有模块边界内按可独立验证的切片实现。'),
      },
      {
        actor: 'VERIFY',
        title: localized('Fresh evidence collected', '已收集新鲜证据'),
        body: localized('Five focused assertions, the package test command, and syntax validation pass.', '五项聚焦断言、项目测试命令和语法检查均通过。'),
      },
      {
        actor: 'COMPLETE',
        title: localized('Requirements reconciled', '需求已对齐'),
        body: localized('The durable record reflects actual files and verification. No commit was created.', '持久记录已反映实际文件和验证结果，且没有创建提交。'),
      },
    ],
    evidence: [
      localized('Requirement checkpoint', '需求检查点'),
      localized('Existing module boundary', '现有模块边界'),
      localized('Focused test assertions', '聚焦测试断言'),
      localized('Package test result', '项目测试结果'),
      localized('Syntax validation', '语法验证'),
    ],
  },
  {
    slug: 'diagnose',
    gateIndex: 2,
    mutationsAfter: 2,
    scenario: localized('CSV export sorts numbers as text', 'CSV 导出把数字按文本排序'),
    request: localized(
      'Investigate why exported rows sort "10" before "9". Stay read-only until the repair is authorized.',
      '排查导出的行里 "10" 排在 "9" 前面的原因。修复获得授权前保持只读。',
    ),
    steps: [
      { icon: 'pulse', title: localized('Reproduce', '复现'), description: localized('Recreate the failure with a minimal input.', '用最小输入重现故障。') },
      { icon: 'compass', title: localized('Locate', '定位'), description: localized('Compare expected and actual to find the root cause.', '对比预期与实际，定位根因。') },
      { icon: 'lock', title: localized('Authorize', '授权'), description: localized('Repair starts only after explicit user authorization.', '获得用户明确授权后才修复。') },
      { icon: 'code', title: localized('Repair', '修复'), description: localized('Fix only the evidence-supported root cause.', '只修复有证据支持的根因。') },
      { icon: 'shield', title: localized('Regress', '回归'), description: localized('Leave a test that catches this failure again.', '留下能再次捕捉该故障的测试。') },
    ],
    trace: [
      {
        actor: 'USER',
        title: localized('Bug report received', '收到问题报告'),
        body: localized('The report includes a three-row sample that reproduces the wrong order every time.', '报告附带三行示例数据，每次都能复现错误顺序。'),
      },
      {
        actor: 'AGENT',
        title: localized('Root cause located', '已定位根因'),
        body: localized('The comparator reads cell text without numeric conversion, so "10" sorts before "9".', '排序比较器直接按文本比较，未做数字转换，所以 "10" 排在 "9" 前。'),
      },
      {
        actor: 'HUMAN GATE',
        title: localized('Repair authorization required', '需要修复授权'),
        body: localized('Root cause and repair plan are presented. No file changes until the user authorizes.', '已说明根因与修复方案，用户授权前不修改任何文件。'),
      },
      {
        actor: 'AGENT',
        title: localized('Focused repair', '聚焦修复'),
        body: localized('Numeric conversion is added inside the existing comparator only; all other behavior stays untouched.', '仅在现有比较器内增加数字转换，其它行为保持不变。'),
      },
      {
        actor: 'VERIFY',
        title: localized('Regression evidence collected', '已收集回归证据'),
        body: localized('A new assertion covers numeric ordering, and the original suite still passes.', '新增断言覆盖数字排序，原有用例全部通过。'),
      },
    ],
    evidence: [
      localized('Minimal reproduction record', '最小复现记录'),
      localized('Root-cause explanation', '根因说明'),
      localized('Regression assertion', '回归测试断言'),
      localized('Full test suite result', '完整测试结果'),
    ],
  },
  {
    slug: 'code-design',
    gateIndex: null,
    mutationsAfter: 0,
    scenario: localized('Cache layer for the reporting module', '为报表模块设计缓存层'),
    request: localized(
      'Report generation recomputes everything on each run. Propose a design only — no implementation code.',
      '报表每次生成都全量重算，希望加缓存。只产出设计方案，不写实现代码。',
    ),
    steps: [
      { icon: 'chat', title: localized('Problem', '问题'), description: localized('State the problem before choosing any technique.', '先说清问题，再选择技术。') },
      { icon: 'grid', title: localized('Options', '方案'), description: localized('Compare only options with meaningful differences.', '只比较有实质差异的方案。') },
      { icon: 'check', title: localized('Recommend', '推荐'), description: localized('Recommend the lowest complexity that solves it.', '推荐能解决问题的最低复杂度。') },
      { icon: 'document', title: localized('Record', '记录'), description: localized('Keep decisions and assumptions clearly separated.', '把决定与假设分开记录。') },
    ],
    trace: [
      {
        actor: 'USER',
        title: localized('Design request received', '收到设计请求'),
        body: localized('Goal: remove repeated computation. Constraint: report output must stay identical.', '目标是消除重复计算；约束是报表输出保持不变。'),
      },
      {
        actor: 'AGENT',
        title: localized('Design pressure identified', '已明确设计压力'),
        body: localized('The real pressure is repeated computation time — not concurrency or memory.', '真实压力是重复计算耗时，而不是并发或内存。'),
      },
      {
        actor: 'AGENT',
        title: localized('Options compared', '已比较方案'),
        body: localized('Function-level memoization versus query-result caching; the difference is the invalidation strategy.', '比较了函数级记忆化与查询结果缓存，核心差异在失效策略。'),
      },
      {
        actor: 'COMPLETE',
        title: localized('Design delivered', '已输出设计'),
        body: localized('Query-result caching is recommended for its clear boundary and testability. Assumptions and follow-up checks are recorded.', '推荐查询结果缓存：边界清晰、可测试；失效假设与后续验证点已记录。'),
      },
    ],
    evidence: [
      localized('Problem statement', '问题陈述'),
      localized('Option comparison', '方案对比'),
      localized('Recommendation with assumptions', '推荐结论与假设'),
    ],
  },
  {
    slug: 'review',
    gateIndex: null,
    mutationsAfter: 0,
    scenario: localized('Review the CSV export branch', '评审 CSV 导出分支'),
    request: localized(
      'Review the branch diff for correctness, safety, and maintainability. Report findings only — do not edit.',
      '评审该分支的改动：正确性、安全性、可维护性。只报告问题，不要修改代码。',
    ),
    steps: [
      { icon: 'flag', title: localized('Scope', '范围'), description: localized('Review from one fixed comparison point.', '基于固定比较点评审。') },
      { icon: 'grid', title: localized('Inspect', '检查'), description: localized('Check each dimension against requirements.', '按维度逐项对照需求。') },
      { icon: 'shield', title: localized('Verify', '核实'), description: localized('Confirm every finding against the code.', '每条发现都用代码核实。') },
      { icon: 'document', title: localized('Report', '报告'), description: localized('Rank findings by severity with evidence.', '按严重性排序并附证据。') },
    ],
    trace: [
      {
        actor: 'USER',
        title: localized('Review scope fixed', '已固定评审范围'),
        body: localized('The review target is the diff between the current branch and the main branch.', '评审对象固定为当前分支与主干的差异。'),
      },
      {
        actor: 'AGENT',
        title: localized('Dimensions inspected', '已逐维检查'),
        body: localized('Requirements, correctness, safety, and evidence are checked one by one.', '按需求、正确性、安全性和证据四个维度逐项核对。'),
      },
      {
        actor: 'AGENT',
        title: localized('Finding verified', '已核实发现'),
        body: localized('Escaping misses embedded newlines — confirmed real with a minimal input before reporting.', '转义逻辑漏掉了内嵌换行符——报告前已用最小输入确认缺陷真实存在。'),
      },
      {
        actor: 'COMPLETE',
        title: localized('Report delivered', '已输出报告'),
        body: localized('Three findings ranked by severity, each with cited evidence. The working tree is untouched.', '按严重性列出 3 项发现并附证据；工作区未被修改。'),
      },
    ],
    evidence: [
      localized('Fixed review scope', '固定评审范围'),
      localized('Ranked findings (3)', '分级发现（3 项）'),
      localized('Defect reproduction input', '缺陷复现输入'),
    ],
  },
  {
    slug: 'handoff',
    gateIndex: null,
    mutationsAfter: 0,
    scenario: localized('End-of-session task handoff', '会话结束前的任务交接'),
    request: localized(
      'Summarize this session so the next one can continue directly. Record facts, not the transcript.',
      '整理本次会话的进展，让下一会话能直接继续。记录事实，而不是对话全文。',
    ),
    steps: [
      { icon: 'compass', title: localized('Status', '状态'), description: localized('Inventory what is done and what remains.', '盘点已完成与剩余工作。') },
      { icon: 'document', title: localized('Decisions', '决定'), description: localized('Record key decisions with their evidence.', '记录关键决定及其证据。') },
      { icon: 'shield', title: localized('Risks', '风险'), description: localized('Name risks, blockers, and dirty-worktree ownership.', '说明风险、阻塞和脏工作区归属。') },
      { icon: 'flag', title: localized('Next', '下一步'), description: localized('End with the next safe action.', '以下一安全动作收尾。') },
    ],
    trace: [
      {
        actor: 'USER',
        title: localized('Handoff requested', '收到交接请求'),
        body: localized('The record must let a fresh session continue without rereading the conversation.', '交接记录要让新会话无需重读对话即可继续。'),
      },
      {
        actor: 'AGENT',
        title: localized('Status inventoried', '已盘点状态'),
        body: localized('Implementation is complete and verified. One unrelated working-tree change belongs to someone else and stays untouched.', '实现已完成并通过验证；工作区有一处与本任务无关的改动，归属他人、保持不动。'),
      },
      {
        actor: 'AGENT',
        title: localized('Decisions and risks recorded', '已记录决定与风险'),
        body: localized('Key decisions, verification commands, and the unresolved deployment risk are written down.', '关键决定、验证命令和未解决的部署风险均已写明。'),
      },
      {
        actor: 'COMPLETE',
        title: localized('Handoff ready', '交接就绪'),
        body: localized('The record ends with the next safe action. Nothing is written to disk unless a path is requested.', '记录以下一安全动作收尾；未指定输出路径时不写入文件。'),
      },
    ],
    evidence: [
      localized('Status inventory', '状态盘点'),
      localized('Decisions with evidence', '决定与证据清单'),
      localized('Next safe action', '下一安全动作'),
    ],
  },
];
