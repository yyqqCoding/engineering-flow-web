import type { Locale } from './site';

// 验证结果页文案：全部摘自源仓库 docs/benchmark-log.md 与 docs/testing-strategy.md（v1.0.1, commit 3a70929）。
// 按仓库安全约定，这里不出现供应商、模型名、端点、本地路径或原始日志。
type L<T> = Record<Locale, T>;

export const evidencePage = {
  lede: {
    en: 'The same tasks were run under two configurations: one with these workflows installed, one without. Everything else was identical. This page reports the difference between the two, and what the process cost.',
    'zh-CN': '同一批任务在两种配置下各跑一遍：一组安装了这些工作流，一组没有，其余条件完全一致。本页给出两组结果的差异，以及为流程付出的成本。',
  },

  methodTitle: { en: 'How the comparison was run', 'zh-CN': '对比是如何进行的' },
  methodIntro: {
    en: 'No result is self-reported. Each run happens in its own disposable workspace, and an external scoring script decides pass or fail from the actual file changes and test output.',
    'zh-CN': '结果不由智能体自述。每次运行都在独立的一次性工作区中进行，是否通过由外部评分脚本判定，依据是实际的文件变更与测试输出。',
  },
  methodSteps: [
    {
      icon: 'grid',
      title: { en: 'One model, one configuration', 'zh-CN': '同一模型，同一配置' },
      detail: {
        en: 'Both groups run the identical setup. The only variable is whether the workflows are installed.',
        'zh-CN': '两组使用完全相同的设置，唯一的变量是是否安装了这些工作流。',
      },
    },
    {
      icon: 'document',
      title: { en: 'Fixed engineering scenarios', 'zh-CN': '固定的工程场景' },
      detail: {
        en: 'Seventeen everyday engineering scenarios, each a prepared repository with a hidden grader, plus continuity tasks that span several turns.',
        'zh-CN': '17 个日常工程场景，每个都是一个预置仓库加一套隐藏判据；另有跨多轮消息的连续性任务。',
      },
    },
    {
      icon: 'refresh',
      title: { en: 'Three valid runs per group', 'zh-CN': '每组各三次有效运行' },
      detail: {
        en: 'At least three per scenario per group. Runs that crashed, timed out, or escaped the sandbox are excluded entirely rather than counted either way.',
        'zh-CN': '每个场景每组至少三次。崩溃、超时或越出沙箱的运行整体剔除，既不计入通过也不计入失败。',
      },
    },
    {
      icon: 'check',
      title: { en: 'Scored on observed behavior', 'zh-CN': '按观察到的行为判定' },
      detail: {
        en: 'The grader inspects the diff, the test output, and whether unrelated work was disturbed. A claim of having verified something scores nothing.',
        'zh-CN': '评分脚本检查实际改动、测试输出，以及无关改动是否被打扰。仅声明"已验证"不计分。',
      },
    },
  ],

  resultsTitle: { en: 'Measured difference', 'zh-CN': '实测差异' },
  resultsIntro: {
    en: 'Each bar shows how many runs passed in that group.',
    'zh-CN': '每根条表示该组通过的运行次数。',
  },
  withoutLabel: { en: 'Without workflows', 'zh-CN': '未安装工作流' },
  withLabel: { en: 'With workflows', 'zh-CN': '已安装工作流' },
  results: [
    {
      icon: 'code',
      name: { en: 'Everyday engineering behavior', 'zh-CN': '日常工程行为' },
      note: { en: '17 scenarios × 3 runs', 'zh-CN': '17 个场景 × 3 次' },
      without: 45, with: 51, total: 51,
    },
    {
      icon: 'chat',
      name: { en: 'Multi-turn task continuity', 'zh-CN': '多轮任务连续性' },
      note: { en: '4 scenarios × 3 runs', 'zh-CN': '4 个场景 × 3 次' },
      without: 0, with: 12, total: 12,
    },
    {
      icon: 'flag',
      name: { en: 'Session handoff completeness', 'zh-CN': '会话交接完整性' },
      note: { en: '1 scenario × 3 runs', 'zh-CN': '1 个场景 × 3 次' },
      without: 0, with: 3, total: 3,
    },
  ],
  routingTitle: { en: 'Invocation stayed exact', 'zh-CN': '调用路由保持精确' },
  routingFacts: [
    { icon: 'terminal', value: '51/51', label: { en: 'Named workflow loaded correctly', 'zh-CN': '点名的工作流被正确加载' } },
    { icon: 'compass', value: '0', label: { en: 'Workflow loaded without being named', 'zh-CN': '未经点名而加载的工作流' } },
    { icon: 'pulse', value: '0', label: { en: 'Named but not loaded', 'zh-CN': '点名后未加载' } },
    { icon: 'check', value: '50/50', label: { en: 'Deterministic project tests', 'zh-CN': '项目确定性测试' } },
  ],

  casesTitle: { en: 'Where the two groups diverged', 'zh-CN': '两组在哪里分开' },
  casesIntro: {
    en: 'Most scenarios produced the same outcome in both groups — a capable model already handles them. These four did not.',
    'zh-CN': '多数场景两组结果一致，能力足够的模型本来就能处理。以下四个场景不一致。',
  },
  cases: [
    {
      tone: 'orange',
      icon: 'chat',
      situation: { en: 'A request to delete a customer that never states what happens to their orders', 'zh-CN': '请求删除一个客户，但未说明其关联订单如何处理' },
      without: { en: 'Silently chose cascade deletion and implemented it.', 'zh-CN': '自行选择了级联删除，并直接写入了实现。' },
      with: { en: 'Named the three candidate policies, asked for the decision, and left the workspace unchanged.', 'zh-CN': '列出三种候选策略，请求你做出决定，工作区未发生任何改动。' },
      score: { without: '0/3', with: '3/3' },
    },
    {
      tone: 'purple',
      icon: 'pulse',
      situation: { en: 'A defect fix that should leave a regression test behind', 'zh-CN': '修复缺陷，并留下能防止其复发的回归测试' },
      without: { en: 'Fixed the behavior and left a sensitive test — but wrote it after the fix, so its failure was never observed.', 'zh-CN': '修复了行为，也留下了敏感的测试，但测试写在修复之后，从未观察到它失败。' },
      with: { en: 'Wrote the regression test first, observed it fail, then changed production code and observed it pass.', 'zh-CN': '先写回归测试并观察其失败，再修改生产代码并观察其通过。' },
      score: { without: '0/3', with: '3/3' },
    },
    {
      tone: 'green',
      icon: 'lock',
      situation: { en: 'Approval arrives several messages in, not in the first one', 'zh-CN': '批准出现在后续消息中，而不是首条请求里' },
      without: { en: 'Treated the opening request as approval and began editing files before alignment finished.', 'zh-CN': '把首条请求当作批准，在对齐完成前就开始修改文件。' },
      with: { en: 'Asked the independent questions in one batch, presented a written implementation boundary, then waited for post-checkpoint action language.', 'zh-CN': '将独立问题合并为一批问完，给出书面的实施边界，然后等待检查点之后的明确指令。' },
      score: { without: '0/12', with: '12/12' },
    },
    {
      tone: 'blue',
      icon: 'document',
      situation: { en: 'A session ends and the work must continue in the next one', 'zh-CN': '会话结束，工作需要由下一个会话接续' },
      without: { en: 'Linked the decision record but omitted the reason behind the decision, leaving it unrecoverable.', 'zh-CN': '引用了决策记录，却省略了做出该决策的理由，接续方无法还原。' },
      with: { en: 'Stated the decision and its reason, declared the empty blocker state explicitly, and attached a concrete passing test result.', 'zh-CN': '写明了决策及其理由，显式声明了无阻塞项，并附上一次真实通过的测试结果。' },
      score: { without: '0/3', with: '3/3' },
    },
  ],

  scenariosTitle: { en: 'The seventeen scenarios', 'zh-CN': '17 个场景' },
  scenariosIntro: {
    en: 'These make up the behavior score. Both groups were graded against the same expectation for each one.',
    'zh-CN': '行为得分由这些场景构成，两组按同一条期望标准评分。',
  },
  scenarioColumns: {
    en: ['#', 'Scenario', 'Expected behavior'],
    'zh-CN': ['#', '场景', '期望行为'],
  },

  costTitle: { en: 'What the process costs', 'zh-CN': '流程的成本' },
  costIntro: {
    en: 'Process is not free. Averaged across the behavior cohort, the workflow group used more of both:',
    'zh-CN': '流程本身有成本。在行为对照组上取平均，安装工作流的一组两项指标都更高：',
  },
  costs: [
    { icon: 'terminal', label: { en: 'Tool calls per run', 'zh-CN': '每次运行的工具调用次数' }, delta: '+17.6%', from: '7.47', to: '8.78' },
    { icon: 'document', label: { en: 'Input tokens per run', 'zh-CN': '每次运行的输入 token 量' }, delta: '+16.5%', from: '75,956', to: '88,525' },
  ],
  costNote: {
    en: 'This is precisely why all five workflows are invoked by name. Ordinary requests never load them, so the cost lands only on the tasks where you asked for the deeper process.',
    'zh-CN': '这正是五个工作流都必须点名调用的原因：普通请求不会加载它们，这份成本只落在你主动要求更深流程的任务上。',
  },

  sourceTitle: { en: 'Source of the figures', 'zh-CN': '数据来源' },
  sourceNote: {
    en: 'Every figure comes from the project’s own published test records for the release below. Nothing is recomputed here, and no raw logs, prompts, or environment details are published.',
    'zh-CN': '所有数字均来自项目自己公开的测试记录，对应下方所列版本。本页不做二次计算，也不发布原始日志、提示词或环境细节。',
  },
} satisfies Record<string, unknown>;

export type EvidenceCopy = typeof evidencePage;
export type EvidenceLocalized = L<string>;
