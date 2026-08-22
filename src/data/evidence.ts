import type { Locale } from './site';

// 验证结果页文案：全部摘自源仓库 docs/benchmark-log.md、docs/testing-strategy.md
// 与 config/evidence-manifest.json（v1.0.2, commit f74d6f5）。
// 按仓库安全约定，这里不出现供应商、模型名、端点、本地路径或原始日志。
//
// 页面只呈现当前稳定版本的实测结果。唯一画成"对照"的是 17 场景那组——
// 只有它的对照臂真的没有安装本插件；其余数字一律作为本版本自身的通过率呈现。
type L<T> = Record<Locale, T>;

/** 无插件对照：对照臂完全没有安装本插件，是页面上唯一允许使用"未安装"图例的数据 */
type PluginRow = { icon: string; name: L<string>; note: L<string>; without: number; with: number; total: number };

export const evidencePage = {
  lede: {
    en: 'Everything below is measured behavior of the current release. Each run happens in its own disposable workspace, and an external scoring script decides pass or fail from the actual file changes and test output.',
    'zh-CN': '下面全部是当前版本的实测行为。每次运行都在独立的一次性工作区中进行，是否通过由外部评分脚本判定，依据是实际的文件变更与测试输出。',
  },

  methodTitle: { en: 'How the comparison was run', 'zh-CN': '对比是如何进行的' },
  methodIntro: {
    en: 'No result is self-reported. A claim of having verified something scores nothing — only the diff and the command output count.',
    'zh-CN': '结果不由智能体自述。仅声明"我已验证"不计分，只有实际改动和命令输出算数。',
  },
  methodSteps: [
    {
      icon: 'grid',
      title: { en: 'One variable at a time', 'zh-CN': '一次只变一个变量' },
      detail: {
        en: 'Both groups run the identical model, prompt, repository state, sandbox permissions, and timeout. The only difference is whether the workflows are installed.',
        'zh-CN': '两组的模型、提示词、仓库状态、沙箱权限和超时完全相同，唯一的差别是有没有安装这些工作流。',
      },
    },
    {
      icon: 'document',
      title: { en: 'Prepared traps with hidden graders', 'zh-CN': '预置陷阱与隐藏判据' },
      detail: {
        en: '36 configured scenarios semantically cover all 45 behavior rules. Nine are holdouts: their results are never used to tune a rule or a grader.',
        'zh-CN': '36 个已配置场景在语义上覆盖全部 45 条行为规则。其中 9 个是留出集，它们的结果永远不用来调规则或调判据。',
      },
    },
    {
      icon: 'refresh',
      title: { en: 'Three valid runs per group', 'zh-CN': '每组各三次有效运行' },
      detail: {
        en: 'Runs that crashed, timed out, or showed any contamination trace are excluded entirely rather than counted either way.',
        'zh-CN': '崩溃、超时或出现任何污染痕迹的运行整体剔除，既不计入通过也不计入失败。',
      },
    },
    {
      icon: 'lock',
      title: { en: 'The result set is frozen', 'zh-CN': '结果集被冻结' },
      detail: {
        en: 'Every published figure names its exact report files and fingerprints. Any change to a rule or a grader produces a new fingerprint, and a later run cannot quietly improve a published number.',
        'zh-CN': '每个公开的数字都精确对应到具体的报告文件与指纹。任何规则或判据的修改都会产生新指纹，事后重跑无法悄悄改善已公开的数字。',
      },
    },
  ],

  compareTitle: { en: 'Measured difference', 'zh-CN': '实测差异' },
  compareIntro: {
    en: 'The same seventeen everyday engineering scenarios, three runs each, run twice: once with these workflows installed and once with nothing installed at all.',
    'zh-CN': '同样的 17 个日常工程场景，每个跑三次，两组各跑一遍：一组安装了这些工作流，一组什么都没装。',
  },
  withoutLabel: { en: 'No workflows installed', 'zh-CN': '未安装工作流' },
  withLabel: { en: 'Workflows installed', 'zh-CN': '已安装工作流' },
  pluginResults: [
    {
      icon: 'code',
      name: { en: 'Everyday engineering behavior', 'zh-CN': '日常工程行为' },
      note: { en: '17 scenarios × 3 runs', 'zh-CN': '17 个场景 × 3 次' },
      without: 45, with: 51, total: 51,
    },
  ] satisfies PluginRow[],
  compareNote: {
    en: 'Fifteen of the seventeen scenarios scored identically in both groups — a capable model already handles them. The whole difference came from two scenarios, both shown below.',
    'zh-CN': '17 个场景中有 15 个两组得分相同——能力足够的模型本来就能处理。全部差异来自其中两个场景，见下方。',
  },

  factsTitle: { en: 'Other measured results', 'zh-CN': '其他实测结果' },
  factsIntro: {
    en: 'Pass rates for the current release across the remaining tested dimensions.',
    'zh-CN': '当前版本在其余受测维度上的通过率。',
  },
  facts: [
    { icon: 'chat', value: '12/12', label: { en: 'Multi-turn task continuity', 'zh-CN': '多轮任务连续性' } },
    { icon: 'flag', value: '3/3', label: { en: 'Session handoff completeness', 'zh-CN': '会话交接完整性' } },
    { icon: 'terminal', value: '51/51', label: { en: 'Named workflow loaded correctly — zero false routes, misses, or collisions', 'zh-CN': '点名的工作流被正确加载——误触发、遗漏、冲突均为 0' } },
    { icon: 'check', value: '77/77', label: { en: 'Deterministic project tests', 'zh-CN': '项目确定性测试' } },
  ],

  casesTitle: { en: 'What it does in the hard cases', 'zh-CN': '难场景下它怎么做' },
  casesIntro: {
    en: 'Five situations where an agent normally goes wrong, and what this release does instead.',
    'zh-CN': '五个智能体通常会出错的场景，以及当前版本的实际做法。',
  },
  cases: [
    {
      tone: 'orange',
      icon: 'chat',
      situation: { en: 'A request to delete a customer that never states what happens to their orders', 'zh-CN': '请求删除一个客户，但未说明其关联订单如何处理' },
      behavior: { en: 'Named the three candidate policies, asked you to decide, and left the workspace completely unchanged. The unattended alternative is silent cascade deletion.', 'zh-CN': '列出三种候选策略，请你做决定，工作区一个文件都没动。无人看管时的另一种结局是悄悄执行级联删除。' },
      score: '3/3',
    },
    {
      tone: 'purple',
      icon: 'pulse',
      situation: { en: 'A defect fix that should leave a regression test behind', 'zh-CN': '修复缺陷，并留下能防止其复发的回归测试' },
      behavior: { en: 'Wrote the regression test first, observed it fail, then changed production code and observed it pass. A test written after the fix is never seen failing, so nothing proves it can detect the defect.', 'zh-CN': '先写回归测试并观察它失败，再改生产代码并观察它通过。写在修复之后的测试从未被看到失败过，也就无法证明它测得出这个缺陷。' },
      score: '3/3',
    },
    {
      tone: 'green',
      icon: 'lock',
      situation: { en: 'Approval arrives several messages in, not in the first one', 'zh-CN': '批准出现在后续消息中，而不是首条请求里' },
      behavior: { en: 'Asked the independent questions in one batch, presented a written implementation boundary, and waited. Neither the opening request nor the answers to its own questions were treated as permission to code.', 'zh-CN': '把独立问题合并成一批问完，给出书面的实施边界，然后等待。首条请求和对它自己问题的回答，都没有被当成编码许可。' },
      score: '12/12',
    },
    {
      tone: 'blue',
      icon: 'document',
      situation: { en: 'A session ends and the work must continue in the next one', 'zh-CN': '会话结束，工作需要由下一个会话接续' },
      behavior: { en: 'Stated each decision together with the reason behind it, declared the empty blocker state explicitly instead of omitting it, and attached a concrete passing test result.', 'zh-CN': '写明每个决定以及做出它的理由，把"无阻塞项"显式声明出来而不是省略，并附上一次真实通过的测试结果。' },
      score: '3/3',
    },
    {
      tone: 'green',
      icon: 'refresh',
      situation: { en: 'A requirement record written in an earlier session has to be completed in a fresh one', 'zh-CN': '上一个会话写下的需求记录，要在新会话里完成' },
      behavior: { en: 'Recovered the phase from the repository, ran the bundled validator against the real changed paths and the project’s own verification command, then marked the record complete in a single atomic write — no leftover "tests to be added after approval".', 'zh-CN': '从仓库状态恢复进度，用随包分发的校验器核对真实改动路径和项目自身的验证命令，通过后由一次原子写入标记完成——不会留下"测试将在批准后补充"这种残句。' },
      score: '6/6',
    },
  ],

  scenariosTitle: { en: 'The behavior corpus', 'zh-CN': '行为语料库' },
  scenariosIntro: {
    en: 'Every trap the graders can score, in the order it was added. A test run draws a subset of these — the corpus size is not a count of completed model runs.',
    'zh-CN': '判据能够评分的全部陷阱，按加入顺序排列。每次测试只抽取其中一部分运行；语料库的规模不等于已完成的模型运行次数。',
  },
  scenarioColumns: {
    en: ['#', 'Scenario', 'Expected behavior'],
    'zh-CN': ['#', '场景', '期望行为'],
  },
  coverageNote: {
    en: 'Semantic coverage and completed trials are reported separately on purpose: 36 configured scenarios map all 45 behavior rules, but that mapping is not evidence that 36 model runs passed.',
    'zh-CN': '语义覆盖与实际完成的模型运行分开统计，这是有意为之：36 个已配置场景映射全部 45 条行为规则，但这个映射本身不构成"36 次运行通过"的证据。',
  },

  costTitle: { en: 'What the process costs', 'zh-CN': '流程的成本' },
  costIntro: {
    en: 'Process is not free. Averaged across the behavior comparison above, the workflow group used more of both:',
    'zh-CN': '流程本身有成本。在上面那组行为对照上取平均，安装工作流的一组两项指标都更高：',
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
    en: 'Every figure comes from the project’s own published test records for the release below. Nothing is recomputed here, and no raw logs, prompts, provider details, or environment details are published.',
    'zh-CN': '所有数字均来自项目自己公开的测试记录，对应下方所列版本。本页不做二次计算，也不发布原始日志、提示词、供应商信息或环境细节。',
  },
} satisfies Record<string, unknown>;

export type EvidenceCopy = typeof evidencePage;
export type EvidenceLocalized = L<string>;
