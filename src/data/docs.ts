import { workflows, type Locale, type WorkflowSlug } from './site';

// 文档内容与站点营销文案分开维护：这里只放"参考手册"口径的深度内容，
// 全部摘自源仓库 skills/<slug>/SKILL.md、docs/user-guide*.md、docs/product-design.md、
// docs/behavior-spec.md 与 docs/benchmark-log.md（v1.0.2, commit eeef0fc）
type L<T> = Record<Locale, T>;

export const docsUi = {
  section: { en: 'Documentation', 'zh-CN': '文档' },
  onThisPage: { en: 'On this page', 'zh-CN': '本页内容' },
  prev: { en: 'Previous', 'zh-CN': '上一页' },
  next: { en: 'Next', 'zh-CN': '下一页' },
  copy: { en: 'Copy', 'zh-CN': '复制' },
  copied: { en: 'Copied', 'zh-CN': '已复制' },
  menu: { en: 'Documentation menu', 'zh-CN': '文档目录' },
  sourceLink: { en: 'Source repository', 'zh-CN': '源仓库' },
  codex: { en: 'Codex CLI', 'zh-CN': 'Codex CLI' },
  claude: { en: 'Claude Code', 'zh-CN': 'Claude Code' },
} satisfies Record<string, L<string>>;

/** 侧边目录：分组 → 条目，条目顺序同时决定页脚上一页/下一页 */
export const docsNav: Array<{ label: L<string>; items: Array<{ path: string; label: L<string> }> }> = [
  {
    label: { en: 'Getting started', 'zh-CN': '开始使用' },
    items: [
      { path: 'docs', label: { en: 'Overview', 'zh-CN': '概览' } },
      { path: 'docs/install', label: { en: 'Installation', 'zh-CN': '安装' } },
      { path: 'docs/quickstart', label: { en: 'Quick start', 'zh-CN': '快速开始' } },
    ],
  },
  {
    label: { en: 'Concepts', 'zh-CN': '核心概念' },
    items: [
      { path: 'docs/philosophy', label: { en: 'Design philosophy', 'zh-CN': '设计思想' } },
      { path: 'docs/engineering', label: { en: 'Design principles', 'zh-CN': '设计原则' } },
    ],
  },
  {
    label: { en: 'Workflow reference', 'zh-CN': '工作流详解' },
    items: workflows.map((workflow) => ({
      path: `docs/workflows/${workflow.slug}`,
      label: workflow.title,
    })),
  },
  {
    label: { en: 'Reference', 'zh-CN': '参考资料' },
    items: [
      { path: 'docs/experiments', label: { en: 'Experiments & results', 'zh-CN': '实验与验证' } },
      { path: 'docs/practices', label: { en: 'Best practices & FAQ', 'zh-CN': '最佳实践与常见问题' } },
    ],
  },
];

export const docsPageOrder = docsNav.flatMap((group) => group.items);

/**
 * 文案里用反引号标记的行内代码渲染成 <code>。
 * 内容全部来自本仓库维护的常量，先转义再替换，避免 set:html 引入注入面。
 */
export function inlineCode(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/`([^`]+)`/g, '<code>$1</code>');
}

export const overviewPage = {
  eyebrow: { en: 'DOCUMENTATION', 'zh-CN': '完整文档' },
  title: { en: 'Engineering Flow docs', 'zh-CN': 'Engineering Flow 文档' },
  lede: {
    en: 'An open-source workflow plugin for Codex CLI and Claude Code. Ordinary tasks keep their existing speed; the five full workflows load only when you invoke one by name.',
    'zh-CN': '一个面向 Codex CLI 与 Claude Code 的开源工作流插件。普通任务保持原有速度；五个完整工作流只在你点名调用时加载。',
  },
  whatTitle: { en: 'What this is', 'zh-CN': '这是什么' },
  whatBody: {
    en: 'Strong coding models already know these engineering techniques; the problem is that they apply them inconsistently, and the occasions they skip are usually the expensive ones. Engineering Flow targets a small number of those high-value failure modes. It does not take control away from you and it does not replace your project’s own instruction files. Each session automatically loads a compact set of engineering, completion, and safety rules. Anything heavier than that must be invoked by name.',
    'zh-CN': '强编码模型已经掌握这些工程技巧，问题在于应用不稳定，而被跳过的那些场合往往代价最高。Engineering Flow 只针对其中少数几种高价值失败模式，既不接管你的控制权，也不取代项目自身的指令文件。每次会话开始时自动加载一组精简规则，涵盖工程习惯、完成标准与安全边界；比这更重的能力，一律需要点名调用。',
  },
  modelTitle: { en: 'How a session runs', 'zh-CN': '一次会话如何运行' },
  modelSteps: [
    {
      title: { en: 'New session', 'zh-CN': '新会话' },
      detail: { en: 'The minimal Engineering Core loads automatically. No planning, TDD, worktree, or release ceremony.', 'zh-CN': '自动加载精简的 Engineering Core，不含计划、TDD、worktree 或发布仪式。' },
    },
    {
      title: { en: 'Ordinary request', 'zh-CN': '普通请求' },
      detail: { en: 'Core only. A clear, routine task is handled directly at full speed.', 'zh-CN': '只使用 Core。清晰的常规任务直接完成，不走流程。' },
    },
    {
      title: { en: 'Named workflow', 'zh-CN': '点名工作流' },
      detail: { en: 'The full workflow loads and owns the whole task, not just the message that named it.', 'zh-CN': '完整工作流加载，并接管整个任务，而不只是点名它的那一条消息。' },
    },
    {
      title: { en: 'Same-task follow-up', 'zh-CN': '同任务后续回复' },
      detail: { en: 'Ordinary replies continue the current phase — no need to repeat the token.', 'zh-CN': '普通回复继续当前阶段，不需要重复输入 token。' },
    },
    {
      title: { en: 'A new session tomorrow', 'zh-CN': '第二天的新会话' },
      detail: { en: 'A substantial task leaves a requirement record that can be finished without the earlier conversation — the phase is recovered from the repository.', 'zh-CN': '实质任务会留下需求记录，不依赖之前的对话也能收尾——进度从仓库状态恢复。' },
    },
  ],
  chooseTitle: { en: 'Choose a workflow', 'zh-CN': '选择工作流' },
  chooseColumns: {
    en: ['Situation', 'Workflow', 'Modifies code?'],
    'zh-CN': ['你的情况', '工作流', '是否修改代码'],
  },
  chooseRows: [
    {
      slug: 'develop' as WorkflowSlug,
      when: { en: 'Feature, refactor, tests, or maintainability work', 'zh-CN': '新功能、重构、补测试、代码完善' },
      edits: { en: 'After your approval', 'zh-CN': '你批准后才改' },
    },
    {
      slug: 'diagnose' as WorkflowSlug,
      when: { en: 'Bug, regression, wrong output, intermittent fault, or slowdown', 'zh-CN': 'bug、回归、错误输出、间歇故障、性能下降' },
      edits: { en: 'Only when you authorize a fix', 'zh-CN': '你授权修复后才改' },
    },
    {
      slug: 'code-design' as WorkflowSlug,
      when: { en: 'A goal with no settled solution, or a design draft to refine', 'zh-CN': '有目标但方案未定，或已有设计需要完善' },
      edits: { en: 'No', 'zh-CN': '否' },
    },
    {
      slug: 'review' as WorkflowSlug,
      when: { en: 'Review a diff, branch, pull request, or uncommitted work', 'zh-CN': '评审 diff、分支、PR 或未提交改动' },
      edits: { en: 'No — strictly read-only', 'zh-CN': '否，严格只读' },
    },
    {
      slug: 'handoff' as WorkflowSlug,
      when: { en: 'Continue in a new session or hand over to another agent', 'zh-CN': '换会话继续，或交给其他 agent' },
      edits: { en: 'No', 'zh-CN': '否' },
    },
  ],
  boundariesTitle: { en: 'Boundaries that always hold', 'zh-CN': '始终成立的边界' },
  boundaries: [
    { en: 'Your current request, the project’s AGENTS.md / CLAUDE.md, and its authoritative documents always win.', 'zh-CN': '你当前的请求，以及项目内的 AGENTS.md、CLAUDE.md 和权威文档，始终优先。' },
    { en: 'A full workflow is never loaded unless you name it. An unknown token triggers nothing.', 'zh-CN': '没有点名的完整工作流不会自动加载；未知 token 不会触发任何工作流。' },
    { en: 'Explicit cancellation, switching workflows, or starting an unrelated task ends the inheritance.', 'zh-CN': '明确取消、切换工作流或开始无关的新任务，都会结束继承。' },
    { en: 'No workflow gains permission to commit, push, publish, open issues, install dependencies, or change global configuration.', 'zh-CN': '任何工作流都不会自动获得提交、推送、发布、创建 issue、安装依赖或修改全局配置的权限。' },
  ],
  startTitle: { en: 'Start here', 'zh-CN': '从这里开始' },
  startCards: [
    {
      path: 'docs/install',
      icon: 'terminal',
      title: { en: 'Installation', 'zh-CN': '安装' },
      detail: { en: 'Add the marketplace and plugin on Codex CLI or Claude Code, then verify it is enabled.', 'zh-CN': '在 Codex CLI 或 Claude Code 里添加 marketplace 和插件，并确认已启用。' },
    },
    {
      path: 'docs/quickstart',
      icon: 'code',
      title: { en: 'Quick start', 'zh-CN': '快速开始' },
      detail: { en: 'Your first ordinary task, your first named workflow, and how approval actually works.', 'zh-CN': '第一个普通任务、第一次点名工作流，以及批准到底怎么生效。' },
    },
    {
      path: 'docs/philosophy',
      icon: 'compass',
      title: { en: 'Design philosophy', 'zh-CN': '设计思想' },
      detail: { en: 'Why ceremony is optional, why approval is explicit, and why nothing auto-triggers.', 'zh-CN': '为什么仪式是可选的、批准必须显式，以及为什么没有任何东西自动触发。' },
    },
    {
      path: 'docs/engineering',
      icon: 'design',
      title: { en: 'Design principles', 'zh-CN': '设计原则' },
      detail: { en: 'The seven classical principles, and exactly which rule in this project encodes each one.', 'zh-CN': '七条经典设计原则，以及本项目中具体由哪条规则承载它们。' },
    },
  ],
};

export const installPage = {
  eyebrow: { en: 'GETTING STARTED / 01', 'zh-CN': '开始使用 / 01' },
  title: { en: 'Installation', 'zh-CN': '安装' },
  lede: {
    en: 'Add the marketplace, install the plugin, confirm it is enabled, then open a new session in your project.',
    'zh-CN': '添加 marketplace、安装插件、确认已启用，然后在你的项目里开一个新会话。',
  },
  requirement: {
    en: 'Supported hosts are Codex CLI and Claude Code. Marketplace commands run in your system terminal for Codex, and in the Claude Code conversation for Claude.',
    'zh-CN': '支持的宿主是 Codex CLI 和 Claude Code。Codex 的安装命令在系统终端里执行，Claude Code 的安装命令在对话框里执行。',
  },
  codexTitle: { en: 'Codex CLI', 'zh-CN': 'Codex CLI' },
  codexSteps: [
    {
      title: { en: 'Add the marketplace and plugin', 'zh-CN': '添加 marketplace 和插件' },
      note: { en: 'Run in your system terminal.', 'zh-CN': '在系统终端执行。' },
      code: 'codex plugin marketplace add yyqqCoding/engineering-flow-skills\ncodex plugin add engineering-flow@engineering-flow',
    },
    {
      title: { en: 'Confirm it is enabled', 'zh-CN': '确认插件已启用' },
      note: { en: 'The output should contain installed and enabled set to true.', 'zh-CN': '输出中 installed 和 enabled 都应为 true。' },
      code: 'codex plugin list --json',
    },
    {
      title: { en: 'Open a new session in your project', 'zh-CN': '在项目里开启新会话' },
      note: { en: 'Close old sessions first — the Core loads at session start.', 'zh-CN': '先关掉旧会话，Core 在会话启动时加载。' },
      code: 'cd /path/to/your-project\ncodex',
    },
  ],
  codexLocalTitle: { en: 'Installing from a local checkout', 'zh-CN': '从本地仓库安装' },
  codexLocalNote: {
    en: 'For local development, point the marketplace at an absolute repository path.',
    'zh-CN': '本地开发时，可以把 marketplace 指向仓库的绝对路径。',
  },
  codexLocalCode: 'codex plugin marketplace add /absolute/path/to/engineering-flow-skills\ncodex plugin add engineering-flow@engineering-flow',
  claudeTitle: { en: 'Claude Code', 'zh-CN': 'Claude Code' },
  claudeNote: {
    en: 'Run these inside the Claude Code conversation, then start a new session. Claude Code invokes workflows with /engineering-flow:<workflow>.',
    'zh-CN': '在 Claude Code 对话中执行，然后开启新会话。Claude Code 用 /engineering-flow:<工作流> 调用。',
  },
  claudeCode: '/plugin marketplace add yyqqCoding/engineering-flow-skills\n/plugin install engineering-flow@engineering-flow',
  updateTitle: { en: 'Updating', 'zh-CN': '更新' },
  updateCodexNote: {
    en: 'Codex has no separate plugin update command. Refresh the marketplace, reinstall, then open a new session.',
    'zh-CN': 'Codex 目前没有独立的 plugin update 命令。刷新 marketplace、重装插件，然后开启新会话。',
  },
  updateCodexCode: 'codex plugin marketplace upgrade engineering-flow\ncodex plugin remove engineering-flow@engineering-flow\ncodex plugin add engineering-flow@engineering-flow',
  updateClaudeNote: {
    en: 'In the Claude Code conversation, refresh the marketplace and update the plugin, then open a new session.',
    'zh-CN': '在 Claude Code 对话中刷新 marketplace 并更新插件，然后开启新会话。',
  },
  updateClaudeCode: '/plugin marketplace update engineering-flow\n/plugin update engineering-flow@engineering-flow',
  removeTitle: { en: 'Uninstalling', 'zh-CN': '卸载' },
  removeNote: {
    en: 'Remove the plugin first, then the marketplace entry.',
    'zh-CN': '先移除插件，再移除 marketplace 条目。',
  },
  removeCode: 'codex plugin remove engineering-flow@engineering-flow\ncodex plugin marketplace remove engineering-flow',
  tip: {
    en: 'Workflow tokens belong in the agent conversation. Typing $engineering-flow:develop in Bash or PowerShell only produces “command not found”.',
    'zh-CN': '工作流 token 要发到智能体对话里。在 Bash 或 PowerShell 里输入 $engineering-flow:develop 只会得到 command not found。',
  },
};

export const quickstartPage = {
  eyebrow: { en: 'GETTING STARTED / 02', 'zh-CN': '开始使用 / 02' },
  title: { en: 'Quick start', 'zh-CN': '快速开始' },
  lede: {
    en: 'Three things to learn: how ordinary tasks behave, how to name a workflow, and what actually counts as approval.',
    'zh-CN': '三件事：普通任务是什么表现、怎么点名工作流，以及到底什么才算批准。',
  },
  step1Title: { en: '1 · Describe clear work directly', 'zh-CN': '1 · 清晰任务直接描述' },
  step1Body: {
    en: 'After installing the plugin and opening a new session, describe routine work exactly as you always have. The basic engineering rules are already active: the model inspects project instructions and relevant code, preserves unrelated work, asks only about decisions that materially change the result, and runs scope-appropriate verification before claiming completion.',
    'zh-CN': '安装插件并开启新会话之后，常规任务照常描述即可。基础工程规则已经生效：模型会检查项目规则和相关代码、保护无关改动、只问会实质改变结果的问题，并在声称完成之前运行范围匹配的验证。',
  },
  step1Code: {
    en: 'Add an optional middleName to formatDisplayName and ignore blank values. Preserve the existing export, add the smallest meaningful verification, and do not commit.',
    'zh-CN': '给 formatDisplayName 增加可选 middleName；空白值忽略。保留现有导出，添加最小验证，不要提交。',
  },
  step2Title: { en: '2 · Name a workflow for deeper work', 'zh-CN': '2 · 复杂任务点名工作流' },
  step2Body: {
    en: 'Send the workflow token together with the task, preferably on the first line. The workflow then owns the whole task — not just that one message.',
    'zh-CN': '把工作流 token 和需求一起发送，建议放在第一行。之后这个工作流会接管整个任务，而不只是那一条消息。',
  },
  step2Code: {
    en: '$engineering-flow:develop\nImplement order batch export. Reuse existing permission and query capabilities, protect critical behavior with necessary evidence, and reconcile the authoritative documentation. Do not commit.',
    'zh-CN': '$engineering-flow:develop\n实现订单批量导出。复用现有权限和查询能力，用必要证据保护关键行为，并同步权威文档。不要提交。',
  },
  formatTitle: { en: 'Invocation format', 'zh-CN': '调用格式' },
  formatColumns: { en: ['Host', 'Format'], 'zh-CN': ['环境', '格式'] },
  formatRows: [
    { host: 'Codex CLI', format: '$engineering-flow:<workflow>' },
    { host: 'Claude Code', format: '/engineering-flow:<workflow>' },
  ],
  step3Title: { en: '3 · Read the checkpoint, then approve', 'zh-CN': '3 · 读完检查点再批准' },
  step3Body: {
    en: 'Develop always returns a checkpoint first — goal, acceptance behavior, out of scope, assumptions, and solution boundary — and then stops, even when the request was already clear. Only action language you send after that checkpoint approves implementation. The initial request, answers to clarification questions, and “got it” do not.',
    'zh-CN': 'Develop 一定会先给出检查点——目标、验收行为、范围外、假设和方案边界——然后停下，哪怕需求本来就很清楚。只有你在检查点之后发出的行动语言才批准实施；初始请求、回答澄清问题、"明白了"都不算。',
  },
  step3Code: { en: 'Proceed with the plan above.', 'zh-CN': '按上述方案执行。' },
  step3Note: {
    en: 'Requirement records move through Draft → Accepted → Implemented, and can be marked Superseded when replaced. The final step is not a status edit: a bundled read-only validator checks the record against the files that actually changed and the verification command that actually ran.',
    'zh-CN': '需求记录的状态依次是 Draft → Accepted → Implemented，被新文档替代时可标记 Superseded。最后一步不是改个状态就行：随包分发的只读校验器会拿记录去核对真正改动的文件和真正执行过的验证命令。',
  },
  continuityTitle: { en: 'Staying in the same task', 'zh-CN': '同一个任务里继续' },
  continuityBody: {
    en: 'Answers, approval, corrections, and reports of omitted acceptance behavior all stay in the same task without repeating the token. An omitted original item reopens implementation directly. New or changed scope gets its own incremental checkpoint and another approval. An unrelated new task never inherits the old workflow.',
    'zh-CN': '回答、批准、纠正和补漏都留在同一个任务里，不必重复输入 token。原验收行为的遗漏会直接重新进入实施；新增或改变范围则只对齐增量，并再次等待批准。无关的新任务不会继承旧工作流。',
  },
  troubleTitle: { en: 'If something looks wrong', 'zh-CN': '看起来不对劲时' },
  troubleColumns: { en: ['Symptom', 'What to do'], 'zh-CN': ['现象', '处理方式'] },
  troubleRows: [
    {
      symptom: { en: 'The terminal says `$engineering-flow:develop: command not found`', 'zh-CN': '终端提示 `$engineering-flow:develop: command not found`' },
      fix: { en: 'The token belongs in the Codex conversation, not the system shell.', 'zh-CN': 'Token 应发送到 Codex 对话，而不是系统终端。' },
    },
    {
      symptom: { en: 'Nothing seems different after installing', 'zh-CN': '安装后看不出变化' },
      fix: { en: 'Confirm the plugin is installed and enabled, then close old sessions and restart.', 'zh-CN': '确认插件已安装并启用，然后关闭旧会话重新启动。' },
    },
    {
      symptom: { en: 'No welcome banner on startup', 'zh-CN': '启动时没有欢迎提示' },
      fix: { en: 'Expected. The Core loads quietly and is not required to announce itself.', 'zh-CN': '正常。Core 在后台加载，不要求显示横幅。' },
    },
    {
      symptom: { en: 'The workflow did not trigger', 'zh-CN': '工作流没有触发' },
      fix: { en: 'Use the complete, exact token, preferably on the first line of the request.', 'zh-CN': '使用完整、准确的 token，建议放在请求第一行。' },
    },
    {
      symptom: { en: 'Still behaving like the old version after an update', 'zh-CN': '更新后仍是旧行为' },
      fix: { en: 'Refresh the marketplace, reinstall the plugin, and open a new session.', 'zh-CN': '刷新 marketplace、重装插件并开启新会话。' },
    },
  ],
};

export const philosophyPage = {
  eyebrow: { en: 'CONCEPTS', 'zh-CN': '核心概念' },
  title: { en: 'Design philosophy', 'zh-CN': '设计思想' },
  lede: {
    en: 'Understand the task well enough to implement safely. Write the smallest clear change at the right boundary. Prove it works with fresh evidence. Make the docs match the facts.',
    'zh-CN': '先把需求理解到足以安全实施，再在正确的边界写最小而清晰的改动，用新鲜证据证明它有效，最后让文档反映事实。',
  },
  problemTitle: { en: 'Three failure modes this corrects', 'zh-CN': '要纠正的三种失败模式' },
  problems: [
    {
      title: { en: 'Ceremony everywhere', 'zh-CN': '仪式泛滥' },
      detail: {
        en: 'General workflow packages force every task through planning, TDD, worktrees, subagents, and release rituals. Hard tasks improve slightly while ordinary work gets slower and more fragile. Here, simple tasks are handled directly and full workflows load only on explicit request.',
        'zh-CN': '通用工作流包把每个任务都塞进计划、TDD、worktree、子智能体和发布仪式。难任务只是略有改善，普通任务却更慢更脆。这里简单任务直接处理，完整工作流只在你显式请求时加载。',
      },
    },
    {
      title: { en: 'Lost multi-turn context', 'zh-CN': '多轮任务中断' },
      detail: {
        en: 'Answers, approvals, corrections, and reports of omitted acceptance items stay inside the same task context. There is no need to invoke the entry point again halfway through.',
        'zh-CN': '回答、批准、纠正和补漏都保持在同一个任务上下文里，任务做到一半不需要重新调用入口。',
      },
    },
    {
      title: { en: 'Clarification mistaken for approval', 'zh-CN': '澄清被当成授权' },
      detail: {
        en: 'Independent questions are asked in one batch, dependent ones follow in order, and answering a question never authorizes code. Approval is a separate, explicit act.',
        'zh-CN': '独立问题批量询问，依赖问题顺序追问；回答问题永远不等于授权编码。批准是一个独立、明确的动作。',
      },
    },
  ],
  layerTitle: { en: 'Two layers, on purpose', 'zh-CN': '刻意分成两层' },
  layers: [
    {
      kind: 'auto' as const,
      label: { en: 'Automatic', 'zh-CN': '自动' },
      title: { en: 'Minimal Engineering Core', 'zh-CN': '极简 Engineering Core' },
      detail: {
        en: 'A minimal set of engineering, completion, and safety rules is injected at session boundaries — start, resume, and compaction. No planning, TDD, worktree, or release ceremony is included.',
        'zh-CN': '会话启动、恢复和压缩时注入一组最小的工程、完成和安全规则。不包含计划、TDD、worktree 或发布仪式。',
      },
    },
    {
      kind: 'explicit' as const,
      label: { en: 'Explicit', 'zh-CN': '显式' },
      title: { en: 'Five full workflows', 'zh-CN': '五个完整工作流' },
      detail: {
        en: 'A full workflow changes the shape and cost of the whole session, so it loads only when you name it — and then stays active at task level until the task ends.',
        'zh-CN': '完整工作流会改变整个会话的形态和成本，所以只有你点名才加载；一旦加载，就在任务级保持活跃直到任务结束。',
      },
    },
  ],
  lifecycleTitle: { en: 'The develop lifecycle', 'zh-CN': 'Develop 生命周期' },
  lifecycleBody: {
    en: 'Develop is the only workflow with a human gate in the middle. Alignment happens before approval; implementation and verification happen after it. A material scope change returns to alignment; an omitted accepted behavior reopens implementation.',
    'zh-CN': 'Develop 是唯一在中间设置人工关卡的工作流。批准之前只对齐，批准之后才实施和验证。实质范围变化回到对齐阶段；原验收行为的遗漏则直接重新进入实施。',
  },
  explicitTitle: { en: 'Why nothing triggers automatically', 'zh-CN': '为什么没有自动触发' },
  lessons: [
    {
      icon: 'pulse',
      title: { en: 'The auto-loaded design skill', 'zh-CN': '自动加载设计技能' },
      detail: {
        en: 'Loading code-design automatically scored 100% trigger precision, but produced no outcome benefit: duration +34.6%, tool calls +75%, input tokens +76.9%. The cost was real and the benefit was not, so it became user-invoked.',
        'zh-CN': '自动加载 code-design 的触发准确率是 100%，但结果没有变好：耗时 +34.6%、工具调用 +75%、输入 token +76.9%。开销是真的，收益不存在，于是改为用户显式调用。',
      },
    },
    {
      icon: 'refresh',
      title: { en: 'The auto-triggered diagnosis', 'zh-CN': '自动触发诊断' },
      detail: {
        en: 'Even after narrowing the description, the model still routed an unrelated policy change into diagnosis. Negative wording is not a deterministic boundary, so every workflow became explicit and only a minimal core stays automatic.',
        'zh-CN': '即使收窄了描述，模型仍然会把无关的策略修改当成诊断任务。负面措辞构不成确定性边界，于是全部工作流改为显式调用，只保留极简核心自动注入。',
      },
    },
  ],
  standardTitle: { en: 'The maintainable-code standard', 'zh-CN': '可维护代码标准' },
  standards: [
    { title: { en: 'Familiar', 'zh-CN': '熟悉' }, detail: { en: 'Established in the repository or idiomatic in the language and framework.', 'zh-CN': '在仓库里已经确立，或在语言与框架中地道。' } },
    { title: { en: 'Explicit', 'zh-CN': '显式' }, detail: { en: 'Control flow, state changes, failures, and external effects are visible.', 'zh-CN': '控制流、状态变化、失败和外部副作用都看得见。' } },
    { title: { en: 'Local', 'zh-CN': '局部' }, detail: { en: 'A maintainer can change behavior without tracing unrelated modules.', 'zh-CN': '维护者不必追踪无关模块就能改动行为。' } },
    { title: { en: 'Named', 'zh-CN': '有名字' }, detail: { en: 'Intermediate concepts carry domain meaning instead of being compressed into expressions.', 'zh-CN': '中间概念带领域含义，而不是压缩成表达式。' } },
    { title: { en: 'Debuggable', 'zh-CN': '可调试' }, detail: { en: 'Meaningful steps can be inspected, logged, and given breakpoints.', 'zh-CN': '有意义的步骤可以检查、打日志、下断点。' } },
    { title: { en: 'Change-resilient', 'zh-CN': '抗变化' }, detail: { en: 'One rule has one authoritative owner; related behavior changes together.', 'zh-CN': '一条规则只有一个权威归属，相关行为一起变化。' } },
    { title: { en: 'Boring', 'zh-CN': '无聊' }, detail: { en: 'It avoids novelty that exists only to reduce lines or show off language cleverness.', 'zh-CN': '避免那种只为减少行数或炫技而存在的新奇写法。' } },
  ],
  nonGoalsTitle: { en: 'Explicit non-goals', 'zh-CN': '明确的非目标' },
  nonGoals: [
    { en: 'Owning issue tracking, branching, pull requests, or release management.', 'zh-CN': '接管问题跟踪、分支管理、Pull Request 或发布流程。' },
    { en: 'Requiring worktrees, subagents, saved plans, or commits for every task.', 'zh-CN': '要求每个任务都用 worktree、子智能体、保存的计划或提交。' },
    { en: 'Replacing an established project documentation layout.', 'zh-CN': '取代项目已有的文档结构。' },
    { en: 'Enforcing a universal language style guide.', 'zh-CN': '强推一套通用的语言风格指南。' },
    { en: 'Optimizing for minimum lines of code.', 'zh-CN': '以最少代码行数为优化目标。' },
    { en: 'Requiring unit tests where they provide no useful feedback.', 'zh-CN': '在没有有效反馈价值的地方也强制写单元测试。' },
  ],
};

export const experimentsPage = {
  eyebrow: { en: 'REFERENCE', 'zh-CN': '参考资料' },
  title: { en: 'Experiments & results', 'zh-CN': '实验与验证' },
  lede: {
    en: 'Every number on this site comes from controlled A/B runs in the project repository — not from intuition.',
    'zh-CN': '本站的每个数字都来自项目仓库里的对照实验，不来自直觉。',
  },
  methodTitle: { en: 'How the benchmark is run', 'zh-CN': '基准测试怎么跑' },
  method: [
    {
      icon: 'shield',
      title: { en: 'Isolated environments', 'zh-CN': '隔离环境' },
      detail: { en: 'Each run uses a temporary HOME and a dedicated workspace with other plugins stripped. Any run showing contamination traces is discarded.', 'zh-CN': '每次运行使用临时 HOME 和独立工作区，并剥离其他插件；发现任何污染痕迹的运行直接作废。' },
    },
    {
      icon: 'grid',
      title: { en: 'Controlled A/B', 'zh-CN': '对照设计' },
      detail: { en: 'Same model, same prompt, same repository state: the baseline arm runs without the plugin, the candidate arm with it. Stochastic scenarios take at least three samples per arm.', 'zh-CN': '同一模型、同一提示词、同一仓库状态：基线组不装插件，候选组装当前插件；随机场景每组至少采样 3 次。' },
    },
    {
      icon: 'terminal',
      title: { en: 'Deterministic scoring', 'zh-CN': '确定性评分' },
      detail: { en: 'Executable scorers check what actually changed — which files, whether existing capabilities were reused, whether any commit was unauthorized — not impressions.', 'zh-CN': '用可执行的评分器检查实际发生了什么：改了哪些文件、是否复用了既有能力、有没有未授权提交，而不是印象分。' },
    },
    {
      icon: 'document',
      title: { en: 'Fingerprinted cohorts', 'zh-CN': '指纹分群' },
      detail: { en: 'Every instruction or grader change produces a new fingerprint; results from different fingerprints are never averaged together, and each published cohort names its exact report files.', 'zh-CN': '每次指令或判据的修改都会产生新指纹；不同指纹的结果绝不混合平均，每个公开 cohort 都精确列出所使用的报告文件。' },
    },
  ],
  resultsTitle: { en: 'Headline results', 'zh-CN': '关键结果' },
  viewResults: { en: 'Open the full results page', 'zh-CN': '打开完整验证结果页' },
  lessonsTitle: { en: 'What the experiments changed', 'zh-CN': '实验改变了什么' },
  chainTitle: { en: 'A worked example: five rounds to one mechanism', 'zh-CN': '一个完整案例：五轮实验换来一个机制' },
  chain: [
    {
      round: '01',
      title: { en: 'Prose rules only', 'zh-CN': '只靠文字规则' },
      score: '1/6',
      detail: {
        en: 'The workflow was told in words to replace every placeholder with real paths and fresh results. Most runs implemented the behavior correctly but still left the record saying tests would be added “after approval”.',
        'zh-CN': '用文字要求工作流把占位内容替换成真实路径和新鲜结果。多数运行行为实现正确，但记录里仍然留着"批准后再补测试"这类说法。',
      },
    },
    {
      round: '02',
      title: { en: 'A bundled validator', 'zh-CN': '随包分发校验器' },
      score: '0/6',
      detail: {
        en: 'A read-only script was shipped with the workflow to check the record. Every run passed the first check and implemented correctly — and then none of them ran the final check, because the fresh session had no way to find the script again.',
        'zh-CN': '随工作流分发一个只读脚本来检查记录。每次运行都通过了第一道检查、也正确实现了行为——然后没有一次跑了最后那道检查，因为新会话根本找不到这个脚本在哪。',
      },
    },
    {
      round: '03',
      title: { en: 'Persist the exact command', 'zh-CN': '把确切命令写进记录' },
      score: '0/6',
      detail: {
        en: 'The record itself now carried the exact command to run. Six of six runs persisted it and five executed it successfully — but every final record still contained the machine-specific path instead of durable evidence.',
        'zh-CN': '让记录自己带上要执行的确切命令。6/6 的运行都写下了它，5 次成功执行——但每一份最终记录里留下的仍是本机专属路径，而不是可长期保存的证据。',
      },
    },
    {
      round: '04',
      title: { en: 'One atomic finalize', 'zh-CN': '一次原子完结' },
      score: '5/6',
      detail: {
        en: 'The validator gained a finalize mode: validate first, then write the completed status and stable evidence in a single atomic step. Five of six passed. The sixth recorded a different passing command than the project’s own.',
        'zh-CN': '给校验器加上完结模式：先校验，再用一次原子写入同时写下完成状态和稳定证据。6 次里过了 5 次，剩下 1 次记录的是另一条能通过的命令，而不是项目自己的那条。',
      },
    },
    {
      round: '05',
      title: { en: 'Pin the canonical command', 'zh-CN': '锁定规范验证命令' },
      score: '6/6',
      detail: {
        en: 'Completion evidence must now record the project’s own verification command exactly as executed, arguments included. A different passing command is not equivalent evidence. This cleared the preregistered gate, so the full release cohort was rerun.',
        'zh-CN': '完成证据必须记录项目自己的验证命令，包含全部参数、与实际执行完全一致。换一条能通过的命令不算等价证据。这一轮通过了预先声明的门槛，因此整个发布 cohort 被重跑。',
      },
    },
  ],
  policyTitle: { en: 'A second chain: how the testing rule was written', 'zh-CN': '第二个案例：测试规则是怎么写定的' },
  policy: [
    {
      round: '01',
      title: { en: 'A test ban invented from silence', 'zh-CN': '从沉默里脑补出测试禁令' },
      score: 'fail',
      detail: {
        en: 'The task never mentioned tests, yet the checkpoint forbade test edits — generalizing unrelated "no dependencies, no commit" constraints — and the run kept only an ephemeral probe. The rule now states that silence about tests is neutral.',
        'zh-CN': '任务只字未提测试，检查点却禁止改测试——把"不加依赖、不提交"这类无关约束推广到了测试上——而且整场只留下一个临时探针。规则现在明确写明：对测试保持沉默是中性的。',
      },
    },
    {
      round: '02',
      title: { en: 'A probe mistaken for coverage', 'zh-CN': '把探针当成了覆盖' },
      score: 'fail',
      detail: {
        en: 'With the invented ban gone, the next sample still treated an ad-hoc probe as a substitute for automated coverage of a money-integrity boundary. A probe may supplement selected coverage; it can never replace it.',
        'zh-CN': '脑补的禁令消失后，下一个样本仍然拿临时探针顶替资金完整性边界的自动化覆盖。探针可以补充已选中的覆盖，但永远不能替代它。',
      },
    },
    {
      round: '03',
      title: { en: 'Two narrow corrections, nothing more', 'zh-CN': '只做两处窄修正' },
      score: 'pass',
      detail: {
        en: 'Only those two sentences changed. The next sample left mutation-sensitive coverage on a money-integrity boundary, and a configuration-only negative control still added no ceremonial tests. Both testing-policy scenarios then passed every run of the release cohort.',
        'zh-CN': '只改了这两句话。下一个样本在资金完整性边界上留下了对变异敏感的覆盖；只改配置的阴性对照依然没有产生仪式性测试。随后两个测试策略场景在发布 cohort 的每一次运行中均通过。',
      },
    },
  ],
  limitsTitle: { en: 'Verification status and limits', 'zh-CN': '验证状态与限制' },
  limits: [
    { en: 'Static and deterministic tests: 219/219 passing.', 'zh-CN': '静态与确定性测试：219/219 通过。' },
    { en: 'Corpus: 45 configured scenarios semantically cover all 47 behavior rules, and 9 of them are holdouts whose results are never used to tune a rule or a grader. Semantic coverage is not a count of completed model runs.', 'zh-CN': '语料库：45 个已配置场景在语义上覆盖全部 47 条行为规则，其中 9 个是留出集，其结果永不用于调整规则或判据。语义覆盖不等于已完成的模型运行次数。' },
    { en: 'Against no workflows at all: 17 scenarios, control 45/51 versus 51/51 with workflows; explicit invocation 51/51, with zero false triggers, misses, collisions, contamination, or unauthorized commits.', 'zh-CN': '与"完全不装"对比：17 个场景，对照组 45/51，安装工作流 51/51；显式调用 51/51，误触发、漏触发、碰撞、污染和未授权提交均为 0。' },
    { en: 'Task-level behavior is sampled separately: multi-turn continuity 12/12, session handoff completeness 3/3, and a six-scenario release cohort at 18/18 with three runs each.', 'zh-CN': '任务级行为单独采样：多轮连续性 12/12、会话交接完整性 3/3；六个场景的发布 cohort 各跑 3 次，18/18 通过。' },
    { en: 'Name a full workflow for material data, permission, or destructive decisions rather than relying on the always-on Core alone.', 'zh-CN': '涉及数据、权限或破坏性操作的重大决定，请点名完整工作流，不要只依赖常驻 Core。' },
    { en: 'Full workflows add context, tool calls, and duration, which is exactly why they are not loaded into every request.', 'zh-CN': '完整工作流会增加上下文、工具调用和耗时，这正是它们不会被加载到每个请求里的原因。' },
  ],
};

export const practicesPage = {
  eyebrow: { en: 'REFERENCE', 'zh-CN': '参考资料' },
  title: { en: 'Best practices & FAQ', 'zh-CN': '最佳实践与常见问题' },
  lede: {
    en: 'How to get the most out of the plugin day to day, and answers to the questions that come up first.',
    'zh-CN': '日常使用怎么用得最顺手，以及最常被问到的问题。',
  },
  advantagesTitle: { en: 'What you get', 'zh-CN': '你会得到什么' },
  advantages: [
    { title: { en: 'Pay for depth only when needed', 'zh-CN': '深度按需付费' }, detail: { en: 'Simple tasks carry zero ceremony; full workflows load only when you ask.', 'zh-CN': '简单任务零仪式；完整工作流只在你要求时加载。' } },
    { title: { en: 'Task-level continuity', 'zh-CN': '任务级连续' }, detail: { en: 'Corrections and omissions continue inside the same flow, with no re-invocation.', 'zh-CN': '纠正和补漏在同一流程内继续，不用重新调用。' } },
    { title: { en: 'Approval is never implied', 'zh-CN': '批准绝不默认' }, detail: { en: 'A separate, explicit human act separates understanding from doing.', 'zh-CN': '理解需求与动手实施之间，隔着一个独立、明确的人工动作。' } },
    { title: { en: 'Evidence-driven completion', 'zh-CN': '证据驱动完成' }, detail: { en: 'Nothing counts as done without fresh, scope-appropriate verification — and a substantial task’s record is validated against the real diff before it can say so.', 'zh-CN': '没有新鲜、范围匹配的验证就不算完成；实质任务的记录还要先对照真实 diff 通过校验，才允许说自己完成了。' } },
    { title: { en: 'Two hosts, one semantics', 'zh-CN': '双平台一致语义' }, detail: { en: 'Codex CLI and Claude Code share synchronized invocation behavior.', 'zh-CN': 'Codex CLI 与 Claude Code 的调用行为保持同步。' } },
    { title: { en: 'Read-only where it matters', 'zh-CN': '该只读时严格只读' }, detail: { en: 'Review and handoff never touch your repository.', 'zh-CN': '评审和交接绝不改动你的仓库。' } },
  ],
  practicesTitle: { en: 'Day-to-day practices', 'zh-CN': '日常做法' },
  practices: [
    { en: 'Use ordinary prompts for clear, routine tasks — naming a workflow adds cost you do not need.', 'zh-CN': '清晰的常规任务直接描述，点名工作流只会增加你不需要的开销。' },
    { en: 'Name a workflow when you want its deeper process, and put the token on the first line.', 'zh-CN': '想要更完整流程时才点名工作流，并把 token 放在第一行。' },
    { en: 'Read the checkpoint before approving. Approval is the one place where your attention pays the most.', 'zh-CN': '批准前先读检查点。这是你的注意力回报最高的一个位置。' },
    { en: 'Treat repository docs and instruction files as domain truth — they always take priority over the plugin.', 'zh-CN': '把仓库文档和指令文件当作领域事实，它们的优先级永远高于插件。' },
    { en: 'Say what is out of scope. It is as useful as saying what you want.', 'zh-CN': '明确写出"范围外"，它和写清楚"要什么"一样有用。' },
    { en: 'For material data, permission, or destructive decisions, name a full workflow instead of relying on the Core.', 'zh-CN': '涉及数据、权限或破坏性操作的重大决定，点名完整工作流，不要只依赖 Core。' },
  ],
  faqTitle: { en: 'Frequently asked questions', 'zh-CN': '常见问题' },
  faq: [
    {
      q: { en: 'Do I have to name a workflow for every task?', 'zh-CN': '每个任务都要点名工作流吗？' },
      a: { en: 'No — and you should not. The always-on Core already covers ordinary work. A full workflow changes the shape and cost of the session, so reach for one when you want its deeper process.', 'zh-CN': '不需要，也不建议。常驻 Core 已经覆盖普通任务。完整工作流会改变会话的形态和成本，只在你需要它那套更深流程时才用。' },
    },
    {
      q: { en: 'Why did it stop and wait even though my request was clear?', 'zh-CN': '需求已经很清楚了，它为什么还是停下来等？' },
      a: { en: 'Invoking Develop is not approval to code. The checkpoint is a fixed step: it states the goal and boundary first, then pauses. Reply with action language such as “proceed with the plan above” and it continues.', 'zh-CN': '调用 Develop 本身不是编码授权。检查点是固定动作：先说清目标和边界，然后暂停。你回一句"按上述方案执行"它就继续。' },
    },
    {
      q: { en: 'Can it commit or push my work?', 'zh-CN': '它会自己提交或推送吗？' },
      a: { en: 'Not without authorization. Committing, pushing, publishing, opening issues, installing dependencies, and changing global configuration all require explicit permission from you.', 'zh-CN': '未获授权不会。提交、推送、发布、创建 issue、安装依赖和修改全局配置都需要你的明确授权。' },
    },
    {
      q: { en: 'Does the plugin override my project instructions?', 'zh-CN': '插件会覆盖我的项目规则吗？' },
      a: { en: 'No. Your current request, the project’s AGENTS.md or CLAUDE.md, and its authoritative documents always take priority. The workflows discover and consume your conventions; they do not replace them.', 'zh-CN': '不会。你当前的请求、项目里的 AGENTS.md 或 CLAUDE.md，以及权威文档始终优先。工作流只会读取并遵循你的约定，不会取代它们。' },
    },
    {
      q: { en: 'How do I stop a workflow that is still active?', 'zh-CN': '工作流还活跃，怎么让它结束？' },
      a: { en: 'Cancel it explicitly, switch to another workflow, or start an unrelated task. Any of the three ends the inheritance; a new unrelated task never inherits a stale workflow or approval.', 'zh-CN': '明确取消、切换到另一个工作流，或者开始一个无关的新任务。三者任一都会结束继承；无关的新任务不会继承旧工作流或旧批准。' },
    },
    {
      q: { en: 'Is there a way to see what actually ran?', 'zh-CN': '有办法看到实际跑了什么吗？' },
      a: { en: 'Yes. Every workflow reports its evidence: which commands ran, what changed, and which acceptance behavior was verified, partially verified, incomplete, or deviated.', 'zh-CN': '有。每个工作流都会报告证据：跑了哪些命令、改了什么，以及每条验收行为是已验证、部分验证、未完成还是有偏差。' },
    },
  ],
};

/** 工作流详解页的固定标题与标签 */
export const guideLabels = {
  eyebrow: { en: 'WORKFLOW REFERENCE', 'zh-CN': '工作流详解' },
  invocation: { en: 'Invocation', 'zh-CN': '调用方式' },
  why: { en: 'Why this workflow exists', 'zh-CN': '为什么需要这个工作流' },
  stages: { en: 'How it runs, stage by stage', 'zh-CN': '流程逐阶段拆解' },
  rules: { en: 'Rules that cannot be bypassed', 'zh-CN': '不可绕过的规则' },
  example: { en: 'A real invocation', 'zh-CN': '一次真实调用' },
  when: { en: 'When to use it', 'zh-CN': '什么时候用它' },
  avoid: { en: 'When to reach for something else', 'zh-CN': '什么时候改用别的' },
  avoidColumns: { en: ['Situation', 'Use instead'], 'zh-CN': ['你的情况', '改用'] },
  faq: { en: 'Questions', 'zh-CN': '常见问题' },
  gate: { en: 'Human gate', 'zh-CN': '人工关卡' },
  you: { en: 'You', 'zh-CN': '你' },
  agent: { en: 'Agent', 'zh-CN': '智能体' },
} satisfies Record<string, L<string> | L<string[]>>;

/** 五个工作流的参考手册内容：阶段规则逐条摘自 skills/<slug>/SKILL.md */
export const workflowGuides: Record<WorkflowSlug, {
  purpose: L<string>;
  why: L<string>;
  stages: L<Array<{ name: string; gate?: boolean; summary: string; rules: string[] }>>;
  hardRules: L<Array<{ icon: string; title: string; detail: string }>>;
  example: L<{ prompt: string; turns: Array<{ who: 'user' | 'agent'; text: string }> }>;
  useWhen: L<string[]>;
  avoidWhen: L<Array<{ situation: string; instead: string }>>;
  faq: L<Array<{ q: string; a: string }>>;
}> = {
  develop: {
    purpose: {
      en: 'Carry one implementation task from understanding to evidence-backed completion, with a human approval gate in the middle.',
      'zh-CN': '把一次实现任务从"理解需求"带到"有证据的完成"，中间隔一道人工批准关卡。',
    },
    why: {
      en: 'Most bad agent output is not bad coding — it is coding before understanding. Develop splits one implementation into two halves. First it states the goal, acceptance behavior, out of scope, assumptions, and solution boundary, then stops. Only action language you send after that checkpoint allows production code to change. Everything after that — corrections, omissions, follow-up questions — stays inside the same task without another invocation.',
      'zh-CN': '智能体写坏代码，多数时候不是因为不会写，而是没搞清楚要做什么就开始写。Develop 把一次实现拆成两段：先把目标、验收行为、范围外、假设和方案边界讲清楚，然后停下；只有你在检查点之后发出的行动语言，才允许它动生产代码。之后的纠正、补漏和追问都留在同一个任务里，不需要重新调用。',
    },
    stages: {
      en: [
        {
          name: 'Align and pause',
          gate: true,
          summary: 'Reach one shared understanding, put it on the table, then stop.',
          rules: [
            'Reuse authoritative requirements, existing designs, and repository evidence instead of restarting discovery or rewriting settled decisions.',
            'Ask only about unresolved choices that materially change behavior, interfaces, data, permissions, security, compatibility, destructive effects, or acceptance; infer reversible implementation details from authoritative same-domain evidence.',
            'Batch every independent material question. An explicitly undefined write or delete result is an unanswered product decision and belongs in that batch.',
            'Present Goal, Acceptance behavior, Out of scope, Assumptions, and Solution boundary, state that approval is pending, and request it.',
            'For non-mechanical behavior, include a Test Contract: the behavior to protect, concrete examples where they distinguish plausible interpretations, and the intended verification boundary.',
            'Keep a self-contained checkpoint in the conversation. Only substantial work needing durable recovery or coordination uses the project’s authoritative convention, or `docs/requirements/<feature-slug>.md` with status `Draft`.',
            'Before approval, production code, tests, and configuration stay unchanged. An existing design supplies checkpoint content; it does not bypass this gate.',
            'Only action language sent after this checkpoint grants approval. The initial request, answers to clarification questions, and reading acknowledgements do not.',
          ],
        },
        {
          name: 'Implement and verify',
          summary: 'Deliver accepted behavior in slices, with the order chosen by risk.',
          rules: [
            'Make the smallest clear change at the owner of the domain rule; design, diagnosis, and self-review techniques stay available within this task without changing their authority.',
            'Work in independently verifiable behavior slices. A local change can be implemented and then tested immediately; important stable rules benefit from early executable examples, and uncertain integrations need early feedback.',
            'Choose implementation and test order by risk rather than finishing all production behavior before authoring any test.',
            'Fulfill the Test Contract through stable public interfaces. Retain automated coverage for critical accepted behavior and established risk boundaries; a temporary probe cannot replace it.',
            'Silence about tests is neutral — a test prohibition is never inferred from restrictions on dependencies, documentation, commits, or other artifacts.',
            'Mechanical, presentation, configuration, documentation, and wiring changes may use build, type, lint, integration, smoke, or visual evidence instead.',
            'A reproducible regression with a stable seam still requires an observed failing test before the fix.',
            'Correct defects exposed by verification and rerun the affected checks; broaden verification when scope or new evidence warrants it.',
          ],
        },
        {
          name: 'Reconcile and complete',
          summary: 'Reconcile every accepted behavior with evidence, and make the documents true again.',
          rules: [
            'Re-read accepted behavior and inspect the diff for omissions, incorrect behavior, scope, and temporary artifacts.',
            'Reconcile each acceptance item with evidence or an explicit gap, and report material deviations without rewriting requirements to excuse them.',
            'For a durable record, write exact implementation paths, test paths or `None`, the complete canonical verification command and result, and deviations; finalization makes `Implemented` the last write.',
            'Reconcile authoritative documentation with actual facts and confirmed decisions; promote only durable cross-task rules to project instructions.',
            'Remove diagnostics and report remaining gaps.',
            'Do not commit, push, merge, publish, create external issues, install dependencies, or change global configuration unless authorized.',
          ],
        },
      ],
      'zh-CN': [
        {
          name: '一次性对齐并暂停',
          gate: true,
          summary: '把理解对齐到一处，摆到桌面上，然后停下。',
          rules: [
            '复用权威需求、既有设计和仓库证据，不重新开始发现，也不改写已经定下的决定。',
            '只问那些会实质改变行为、接口、数据、权限、安全、兼容性、破坏性影响或验收的未决选择；可逆的实现细节从同领域的权威证据推断。',
            '把所有相互独立的实质问题合并成一批。写入或删除的结果被显式标为未定义，就是一条未定的产品决定，应当进这一批。',
            '给出目标、验收行为、范围外、假设和方案边界，明确说明批准尚未给出，并请求批准。',
            '非机械性行为要一并给出 Test Contract：要保护的行为、能区分合理理解的具体实例，以及打算使用的验证边界。',
            '把自包含的检查点留在对话里。只有确实需要跨会话恢复或协作的实质任务，才使用项目既有的权威约定，或 `docs/requirements/<feature-slug>.md`，状态为 `Draft`。',
            '批准之前，生产代码、测试和配置保持不变。已有设计只提供检查点内容，不能绕过这道关卡。',
            '只有检查点之后发出的行动语言才构成批准；最初的请求、对澄清问题的回答和一句"已读"都不算。',
          ],
        },
        {
          name: '按切片实施与验证',
          summary: '按可独立验证的切片交付验收行为，顺序由风险决定。',
          rules: [
            '在领域规则的归属模块做最小的清晰改动；设计、诊断与自查技巧可在本任务内使用，但不改变各自的权限。',
            '按可独立验证的行为切片推进。局部改动可以改完立刻测；重要的稳定规则适合尽早留下可执行实例；不确定的集成需要尽早反馈。',
            '实现与测试的先后由风险决定，而不是先把生产行为全部写完再开始写测试。',
            '通过稳定的公开接口兑现 Test Contract。关键验收行为和既定的风险边界要保留自动化覆盖，临时探针不能顶替。',
            '对测试保持沉默是中性的——绝不从"不加依赖、不改文档、不提交"这类限制里推断出测试禁令。',
            '机械性、展示性、配置、文档和接线类改动，可以改用构建、类型、lint、集成、冒烟或视觉证据。',
            '可稳定复现、且有稳定接缝的回归，仍然要先观察到测试失败再改代码。',
            '修正验证暴露的缺陷并重跑受影响的检查；范围变化或出现新证据时扩大验证，没有理由时不重复跑未变动的检查。',
          ],
        },
        {
          name: '对齐事实并完成',
          summary: '让每条验收行为都有证据，让文档重新变成事实。',
          rules: [
            '重读验收行为，检查 diff 中的遗漏、错误行为、范围问题和临时产物。',
            '逐条对齐每一项验收：有证据，或明确报告缺口；实质偏差如实上报，不改写需求来开脱。',
            '有持久记录时，写下确切的实现路径、测试路径或 `None`、完整的规范验证命令与结果、以及偏差；由完结写入让 `Implemented` 成为最后一次落地。',
            '让权威文档与实际事实和已确认的决定一致；只有跨任务的长期规则才提升进项目指令。',
            '移除诊断代码，并报告剩余缺口。',
            '未获授权不得提交、推送、合并、发布、创建外部 issue、安装依赖或修改全局配置。',
          ],
        },
      ],
    },
    hardRules: {
      en: [
        { icon: 'lock', title: 'Approval gate', detail: 'Coding starts only after explicit post-checkpoint action language. The initial request, clarification answers, and “looks good” never count.' },
        { icon: 'chat', title: 'Batched clarification', detail: 'Independent questions are asked in one batch; only questions created by those answers get follow-ups. No drip-feed interviewing.' },
        { icon: 'refresh', title: 'Task-level continuity', detail: 'Corrections, omissions, and same-task follow-ups continue inside the same flow. An `Implemented` record returns to `Accepted` until the omission is completed.' },
        { icon: 'shield', title: 'Undefined is a question', detail: 'An explicitly undefined result never becomes out of scope by itself — least of all the unknown-resource behavior of a delete or write operation.' },
        { icon: 'grid', title: 'Approval plus scope pauses both', detail: 'A message that approves and expands in one breath authorizes nothing. The turn realigns, presents the revised checkpoint, and waits.' },
        { icon: 'code', title: 'Risk sets the order', detail: 'Implementation and tests advance in independently verifiable slices, in whichever order the risk calls for. Only coverage that protects critical behavior or an established boundary is kept, and a reproducible regression still goes red first.' },
        { icon: 'check', title: 'Completion is validated, not asserted', detail: 'A read-only validator checks the record against the real changed paths and the project’s canonical verification command before the single atomic write that marks it complete.' },
      ],
      'zh-CN': [
        { icon: 'lock', title: '批准关卡', detail: '只有检查点之后的明确行动语言才开始编码。初始请求、澄清回答和"看起来不错"都不算。' },
        { icon: 'chat', title: '批量澄清', detail: '独立问题一次问完；只有这些答案引出的依赖问题才追问，不做挤牙膏式访谈。' },
        { icon: 'refresh', title: '任务级连续', detail: '纠正、补漏和同任务追问都在当前流程内继续。已标 `Implemented` 的记录会退回 `Accepted`，补完后再标回去。' },
        { icon: 'shield', title: '未定义即问题', detail: '显式标注为"未定义"的结果不会自己变成范围外，尤其是删除和写操作对未知资源的行为。' },
        { icon: 'grid', title: '批准加范围＝两边都停', detail: '一条消息里既批准又扩大范围，等于什么都没授权：这一轮重新对齐、给出修订检查点，然后等待。' },
        { icon: 'code', title: '顺序由风险决定', detail: '实现与测试按可独立验证的切片推进，先后由风险决定。只保留能保护关键行为或既定边界的覆盖；可稳定复现的回归仍然先红后绿。' },
        { icon: 'check', title: '完成要被校验，不能自称', detail: '只读校验器会对照真实改动路径和项目规范验证命令核对记录，通过后才由那一次原子写入标记完成。' },
      ],
    },
    example: {
      en: {
        prompt: '$engineering-flow:develop\nImplement order batch export. Reuse existing permission and query capabilities, protect critical behavior with necessary evidence, and reconcile the authoritative documentation. Do not commit.',
        turns: [
          { who: 'agent', text: 'Reads project rules, Git state, the existing export and permission code, then asks the single question that changes the result: what should happen for an order ID that does not exist?' },
          { who: 'user', text: 'Fail with a 404.' },
          { who: 'agent', text: 'Returns the checkpoint — goal, acceptance behavior, out of scope, assumptions, solution boundary — creates `docs/requirements/order-batch-export.md` as `Draft`, and stops.' },
          { who: 'user', text: 'Proceed with the plan above.' },
          { who: 'agent', text: 'Marks the record `Accepted`, makes the change inside the order module boundary, adds a focused test for the 404 branch as the risk requires, runs verification, and marks the record `Implemented` with the real files and fresh results.' },
        ],
      },
      'zh-CN': {
        prompt: '$engineering-flow:develop\n实现订单批量导出。复用现有权限和查询能力，用必要证据保护关键行为，并同步权威文档。不要提交。',
        turns: [
          { who: 'agent', text: '读项目规则、Git 状态、现有的导出与权限代码，然后只提一个会改变结果的问题：导出中包含不存在的订单 ID 时应该怎么办？' },
          { who: 'user', text: '报错，返回 404。' },
          { who: 'agent', text: '给出检查点——目标、验收行为、范围外、假设、方案边界，创建 `docs/requirements/order-batch-export.md`（状态 `Draft`），然后停下。' },
          { who: 'user', text: '按上述方案执行。' },
          { who: 'agent', text: '把记录标为 `Accepted`，在订单模块边界内完成改动，按风险为 404 分支补上聚焦测试，跑验证，最后把记录标为 `Implemented` 并写上真实文件和最新结果。' },
        ],
      },
    },
    useWhen: {
      en: [
        'A feature, refactor, test-only change, or maintainability improvement.',
        'The change affects product behavior and needs alignment before implementation.',
        'The task spans several turns and corrections must keep their context.',
        'You want one explicit approval point before any code is written.',
      ],
      'zh-CN': [
        '新功能、重构、只补测试，或者可维护性改造。',
        '改动会影响产品行为，需要先对齐再动手。',
        '任务跨多轮对话，纠正和补漏要保留上下文。',
        '你希望在写任何代码之前，有一个明确的批准点。',
      ],
    },
    avoidWhen: {
      en: [
        { situation: 'Existing behavior is broken — a bug, regression, or wrong output', instead: 'Diagnose' },
        { situation: 'You have a goal but no settled solution yet', instead: 'Code Design' },
        { situation: 'You only want a findings report, not edits', instead: 'Review' },
        { situation: 'A small, clear, routine change', instead: 'Just describe it — no workflow needed' },
      ],
      'zh-CN': [
        { situation: '现有行为坏了——bug、回归或输出错误', instead: 'Diagnose' },
        { situation: '只有目标，方案还没定', instead: 'Code Design' },
        { situation: '只想要一份问题报告，不希望改代码', instead: 'Review' },
        { situation: '清晰的小改动、常规任务', instead: '直接描述即可，不必调用工作流' },
      ],
    },
    faq: {
      en: [
        { q: 'I already invoked Develop — why is it still waiting for me?', a: 'Invoking the workflow is not approval to code. The checkpoint is a fixed step even when the request is clear: it states the goal and boundary, then pauses. Reply with action language and it continues.' },
        { q: 'I noticed a missing acceptance item. Do I re-invoke?', a: 'No. An omitted original acceptance item belongs to the same task, so Develop reopens implementation and verification directly and returns the record from `Implemented` to `Accepted` until it is done.' },
        { q: 'Is adding a new requirement an omission or new scope?', a: 'Explicitly adding or changing behavior is a scope increment. Develop aligns only that increment, presents an incremental checkpoint, and waits for approval again. If your message both approves the old checkpoint and adds the increment, nothing is implemented that turn — the revised checkpoint comes back and waits.' },
        { q: 'What happens to the requirement record if I come back tomorrow?', a: 'A substantial task leaves a record that a fresh session can finish without this conversation: the current phase is recoverable from the repository, and the record carries the exact command needed to validate and complete it.' },
        { q: 'Will it write the tests first?', a: 'Not by a fixed rule. It works in independently verifiable slices and chooses the order of implementation and tests by risk, then keeps only coverage that protects critical behavior or an established boundary. A reproducible regression is the exception — it still gets its failing test before the fix.' },
        { q: 'Will it commit my work?', a: 'No. Committing, pushing, publishing, opening issues, installing dependencies, and changing global configuration all require separate authorization.' },
      ],
      'zh-CN': [
        { q: '我已经调用 Develop 了，它为什么还在等我？', a: '调用工作流不是编码授权。哪怕需求很清楚，检查点也是固定动作：先讲清目标和边界，然后暂停。你回一句行动指令它就继续。' },
        { q: '发现漏了一条验收行为，要重新调用吗？', a: '不用。原验收行为的遗漏属于同一个任务，Develop 会直接重新进入实施和验证，并把记录从 `Implemented` 退回 `Accepted`，补完后再标回去。' },
        { q: '追加新需求算遗漏还是新范围？', a: '明确新增或改变行为算范围增量。Develop 只对齐这个增量，给出增量检查点，然后再次等待你批准。如果你同一条消息里既批准了旧检查点又加了增量，这一轮什么都不会实施——它会给出修订后的检查点继续等。' },
        { q: '如果我明天再回来，需求记录会怎样？', a: '实质任务会留下一份记录，让新会话不依赖这次对话也能收尾：当前阶段可以从仓库状态恢复，记录本身也带着验证并完成它所需的确切命令。' },
        { q: '它会先写测试吗？', a: '不按固定顺序。它按可独立验证的切片推进，实现与测试的先后由风险决定，只保留能保护关键行为或既定边界的覆盖。可稳定复现的回归是例外：仍然先看到测试失败再修复。' },
        { q: '它会自己提交代码吗？', a: '不会。提交、推送、发布、创建 issue、安装依赖和修改全局配置，都需要你另外授权。' },
      ],
    },
  },

  diagnose: {
    purpose: {
      en: 'Carry one broken behavior from reproduction to an evidence-backed root cause, and — once you authorize it — to a repair that leaves a regression test behind.',
      'zh-CN': '把一个坏掉的行为从"复现"带到"根因有证据"，并在你授权后完成修复，同时留下防回归的测试。',
    },
    why: {
      en: 'The most common bug-fixing failure is patching while guessing: no reproduction, a speculative cause, and no proof the fix worked. Diagnose forces evidence first — reproduce, locate, then repair — and stays completely read-only until you authorize a fix. After authorization, the first write must be a regression test that is observed failing before any production code changes.',
      'zh-CN': '修 bug 最常见的失败是边猜边改：没复现就断定原因，改完也说不清有没有治好。Diagnose 强制证据先行——先复现、再定位、后修复——并且在你授权修复之前完全只读。授权之后，第一次写入只能是回归测试，必须亲眼看到它失败，才允许改生产代码。',
    },
    stages: {
      en: [
        {
          name: 'Establish evidence and cause',
          summary: 'Turn a symptom into a supported cause, read-only.',
          rules: [
            'State expected versus actual behavior from requirements and repository facts; inspect the relevant implementation, tests, callers, and changes.',
            'Establish the fastest reliable signal for the exact symptom — a focused test or command, request replay, minimal harness, stress loop, or performance measurement — and record relevant inputs, environment, frequency, and evidence limits.',
            'Trace the failing boundary to the owner of the violated rule. Compare falsifiable hypotheses with distinguishing observations, and separate the trigger, the cause, and the symptom.',
            'Inspect related callers and boundaries when the evidence implicates them.',
            'If the symptom cannot be reproduced, stay read-only and report that no cause is supported. If the user rejects the diagnosis, discard that conclusion and gather new evidence within the same task.',
            'Diagnosis is read-only unless the initial request or a later message clearly authorizes a fix.',
          ],
        },
        {
          name: 'Repair within authority',
          gate: true,
          summary: 'Repair only once you have authorized it, and leave the regression behind.',
          rules: [
            'An initial request to fix grants repair authority. Otherwise report the supported cause, evidence, repair boundary, and uncertainty, then pause; later same-task action language authorizes repair without a Develop invocation.',
            'With a stable public regression seam, turn the reproduction into a test and observe its failure before editing production behavior. Diagnostic probes and pre-existing passing tests do not replace this gate.',
            'Apply the smallest clear fix at the owning boundary and observe the regression pass. Without a correct automated seam, use the strongest relevant signal and report the limitation.',
            'Verify the original symptom and the affected callers. Add adjacent boundary coverage only when its expected behavior is established and it prevents the same class of defect.',
            'Improve design only where structure contributed to the cause, and rerun checks whose result may have changed.',
            'Remove temporary diagnostics, reconcile affected documentation, and report the cause, the evidence, the fix, retained protection, and remaining gaps.',
            'Undefined product behavior or materially expanded scope needs an incremental alignment checkpoint before implementation.',
          ],
        },
      ],
      'zh-CN': [
        {
          name: '确立证据与根因',
          summary: '把症状变成有证据支持的根因，全程只读。',
          rules: [
            '对照需求和仓库事实说明期望行为与实际行为；检查相关实现、测试、调用方和改动。',
            '为确切的症状建立最快且可靠的信号——聚焦测试或命令、请求重放、最小复现装置、压力循环或性能测量——并记录相关输入、环境、频率和证据的边界。',
            '顺着失效边界追到被违反规则的归属者。用能相互区分的观察比较可证伪的假设，把触发条件、原因和症状分开。',
            '当证据指向相关调用方和边界时，一并检查它们。',
            '如果症状无法复现，保持只读并报告没有任何原因得到支持。如果用户否定诊断，放弃该结论，在同一任务内重新收集证据。',
            '除非最初的请求或后续消息明确授权修复，否则诊断全程只读。',
          ],
        },
        {
          name: '在授权范围内修复',
          gate: true,
          summary: '只在获得授权后修复，并留下防回归的测试。',
          rules: [
            '一开始就要求修复即视为授予修复权限；否则先报告有支持的根因、证据、修复边界和不确定性，然后暂停。之后同一任务里的"修一下"这类行动语言即可授权修复，不需要重新调用 Develop。',
            '存在稳定的公开回归接缝时，把复现变成测试并先观察它失败，再改生产行为。诊断探针和本来就通过的测试都不能替代这道关卡。',
            '在归属边界做最小的清晰修复，并观察回归测试通过。没有正确的自动化接缝时，使用最强的相关信号并报告这一限制。',
            '验证原始症状和受影响的调用方。只有当相邻边界行为的预期已经确立、且能防住同一类缺陷时才补充覆盖。',
            '只在结构确实是成因之一时才改进设计；结果可能已变化的检查要重跑。',
            '移除临时诊断代码，同步受影响的文档，并报告根因、证据、修复、保留的防护和剩余缺口。',
            '未定义的产品行为或实质扩大的范围，需要先走一次增量对齐检查点。',
          ],
        },
      ],
    },
    hardRules: {
      en: [
        { icon: 'shield', title: 'Read-only until authorized', detail: 'No file changes before explicit repair authority. Rejecting the conclusion keeps it read-only and sends it back for new evidence.' },
        { icon: 'pulse', title: 'Red before green', detail: 'The first write after authorization is the regression test, and its failure must be observed. No probe or workaround bypasses this gate.' },
        { icon: 'compass', title: 'One hypothesis at a time', detail: 'Each observation is chosen to distinguish between ranked hypotheses. Two variables are never changed at once.' },
        { icon: 'flag', title: 'Honest limitations', detail: 'When no correct regression seam exists, the limitation is reported instead of shipping a test that cannot detect the defect.' },
        { icon: 'chat', title: 'A failed reproduction is a result', detail: 'If the reported behavior cannot be reproduced, the diagnosis says exactly that and stops. It does not substitute a plausible-sounding cause the repository cannot support.' },
      ],
      'zh-CN': [
        { icon: 'shield', title: '授权前只读', detail: '没有明确的修复授权就不动任何文件。你否定结论时它保持只读，回去找新证据。' },
        { icon: 'pulse', title: '先红后绿', detail: '授权后的第一次写入是回归测试，并且必须观察到它失败。任何探针或变通都绕不过这道关卡。' },
        { icon: 'compass', title: '逐假设证伪', detail: '每次观察都用来区分排好序的假设，绝不同时改变两个变量。' },
        { icon: 'flag', title: '如实说限制', detail: '确实没有正确的回归缝隙时，如实报告限制，而不是交一个测不到缺陷的测试。' },
        { icon: 'chat', title: '复现失败也是结论', detail: '复现不出报告的行为时，诊断就明说这一点并到此为止，不会用一个仓库证据支撑不了、但听起来合理的原因顶上。' },
      ],
    },
    example: {
      en: {
        prompt: '$engineering-flow:diagnose\nFix calculateRenewalDate moving January 31 into March. Reproduce it first, locate the root cause, and leave a test that detects the regression.',
        turns: [
          { who: 'agent', text: 'States expected (February 28/29) versus actual (March 3) and builds the smallest reliable reproduction.' },
          { who: 'agent', text: 'Strips the case down and locates month-end overflow inside the date utility module — not in the caller that reported the symptom.' },
          { who: 'agent', text: 'The initial request already said “fix”, so repair authority exists: it writes only the regression test first and shows it failing.' },
          { who: 'agent', text: 'Applies the smallest fix inside the date utility, observes focused green, and checks sibling callers of the same module.' },
          { who: 'agent', text: 'Reports the root cause, the evidence, what was repaired, what was hardened, and what remains uncertain.' },
        ],
      },
      'zh-CN': {
        prompt: '$engineering-flow:diagnose\n修复 calculateRenewalDate 在 1 月 31 日加一个月后进入 3 月的问题。先复现，定位根因，留下能检测该回归的测试。',
        turns: [
          { who: 'agent', text: '写清预期（2 月 28/29 日）与实际（3 月 3 日），并搭出最小可靠复现。' },
          { who: 'agent', text: '逐层剥离，把根因定位到日期工具模块里的月末溢出，而不是报告症状的那个调用方。' },
          { who: 'agent', text: '初始请求已经说了"修复"，修复权限已经具备：先只写回归测试，并展示它失败。' },
          { who: 'agent', text: '在日期工具模块内做最小修复，观察聚焦测试变绿，并检查同模块的兄弟调用方。' },
          { who: 'agent', text: '报告根因、证据、修复了什么、加固了什么，以及还有什么不确定。' },
        ],
      },
    },
    useWhen: {
      en: [
        'A bug, regression, intermittent fault, wrong output, or measured slowdown.',
        'You want an evidence-backed root cause before anyone changes code.',
        'The repair must leave behind a test that catches this regression.',
        'A previous fix did not hold and you need to know why.',
      ],
      'zh-CN': [
        'bug、回归、间歇性故障、输出错误，或者实测到的性能下降。',
        '想在任何人动代码之前，拿到有证据支持的根因。',
        '修复必须留下一个能捕捉该回归的测试。',
        '上次修复没治住，需要知道为什么。',
      ],
    },
    avoidWhen: {
      en: [
        { situation: 'Nothing is broken — you want new behavior', instead: 'Develop' },
        { situation: 'You want a findings report on a diff or branch', instead: 'Review' },
        { situation: 'The architecture itself is the question', instead: 'Code Design' },
      ],
      'zh-CN': [
        { situation: '没有东西坏掉，你要的是新行为', instead: 'Develop' },
        { situation: '想对某个 diff 或分支拿一份问题报告', instead: 'Review' },
        { situation: '真正的问题是架构本身', instead: 'Code Design' },
      ],
    },
    faq: {
      en: [
        { q: 'I only want the cause, not a fix. Is that possible?', a: 'Yes — that is the default. Invoke it without asking for a fix and it stays read-only, presents the root cause, evidence, repair boundary, and uncertainty, then stops until you authorize repair.' },
        { q: 'What if I disagree with the diagnosis?', a: 'Say so. It stays read-only, discards the rejected cause as a conclusion, and looks for new distinguishing evidence. You do not need to invoke the workflow again.' },
        { q: 'Why must the test fail first?', a: 'A test that has never been observed failing cannot prove it detects this defect. Red before green is a hard gate, and earlier debugging probes do not satisfy it.' },
        { q: 'What if this bug cannot be tested?', a: 'It reports that no correct regression seam exists, rather than adding a test that would pass either way.' },
      ],
      'zh-CN': [
        { q: '我只想知道原因，不想它改代码，可以吗？', a: '可以，这就是默认行为。不带修复意图地调用，它会保持只读，给出根因、证据、修复边界和不确定性，然后停下来等你授权。' },
        { q: '它给的根因我不认可怎么办？', a: '直接说不对。它会保持只读，丢掉这个结论，去寻找新的区分证据——你不需要重新调用工作流。' },
        { q: '为什么一定要先看到测试失败？', a: '一个从没被观察到失败的测试，无法证明它真的能发现这个缺陷。先红后绿是硬关卡，之前的调试探针不能顶替。' },
        { q: '如果这个 bug 写不了测试呢？', a: '它会如实报告"没有正确的回归缝隙"，而不是加一个无论有没有 bug 都会通过的测试。' },
      ],
    },
  },

  'code-design': {
    purpose: {
      en: 'Produce an implementation-ready solution proposal — or repair an existing design until it is implementation-ready — without writing production code.',
      'zh-CN': '产出一份可实施的方案，或者把已有设计改到可实施——全程不写生产代码。',
    },
    why: {
      en: 'The enemy of design is not simplicity but unjustified complexity. Code Design requires naming the real design pressure before choosing a technique: no observed pressure means no new abstraction. Every uncommon construct pays a novelty tax in concrete benefit — correctness, measured performance, framework alignment, or lower total maintenance cost. The output is a proposal, never code.',
      'zh-CN': '设计的敌人不是简单，而是没有根据的复杂。Code Design 要求先命名真实的设计压力，再选技术：没有观察到压力，就不引入新抽象。任何不常见的写法都要交"新奇税"——在正确性、实测性能、框架一致性或总维护成本上给出具体收益。它的产出是方案，不是代码。',
    },
    stages: {
      en: [
        {
          name: 'Establish the decision',
          summary: 'Decide on the smallest coherent solution, from demonstrated pressure.',
          rules: [
            'Use the user’s goal, authoritative documents, existing capabilities, representative code, and tests.',
            'Distinguish accepted behavior, repository facts, assumptions, and unresolved product decisions; ask only about material choices this evidence cannot resolve.',
            'For an existing proposal, preserve settled decisions and focus on missing behavior, contradictions, feasibility, ownership, and unnecessary complexity.',
            'Report changed decisions and their reasons instead of repeating the full background, unless a complete rewrite is requested.',
            'Recommend the smallest coherent solution. Put rules with their owner and prefer existing boundaries.',
            'An abstraction or dependency needs demonstrated pressure and a concrete benefit; visual duplication and hypothetical variation are insufficient.',
            'Compare alternatives only when their trade-offs materially differ.',
          ],
        },
        {
          name: 'Explain the proposal',
          summary: 'Give the decision everything it needs, without writing production code.',
          rules: [
            'State the goal, accepted behavior, constraints, and remaining scope questions.',
            'Give the recommended responsibilities, interfaces, data and state ownership, and important failure, security, compatibility, migration, or operational behavior.',
            'Give decisions and reasons, material alternatives, assumptions, and unresolved choices.',
            'Tie verification intent to acceptance: concrete distinguishing examples and appropriate evidence for applicable interactions and boundaries. Expected results come from requirements or authoritative precedent, not from the proposed implementation.',
            'Add an implementation sequence when dependencies or risk make it useful.',
            'Never present assumptions as accepted requirements.',
            'Write a design document only when requested; otherwise return the proposal in the response, and do not implement production code.',
          ],
        },
      ],
      'zh-CN': [
        {
          name: '确立决策',
          summary: '在真实压力下，给出最小且自洽的方案。',
          rules: [
            '使用用户的目标、权威文档、既有能力、有代表性的代码和测试。',
            '区分验收行为、仓库事实、假设和未定的产品决定；只问这些证据无法解决的实质选择。',
            '对已有方案，保留已定下的决定，把注意力放在缺失的行为、矛盾、可行性、归属和不必要的复杂度上。',
            '报告改变了的决定及其理由，而不是重复全部背景——除非明确要求完整重写。',
            '推荐最小且自洽的方案；把规则放在它的归属者那里，优先沿用既有边界。',
            '抽象或依赖必须有被证实的压力和具体收益；仅仅长得像的重复和设想中的变化都不构成理由。',
            '只有取舍实质不同时才比较备选方案。',
          ],
        },
        {
          name: '讲清方案',
          summary: '把决策需要的内容给全，但不写生产代码。',
          rules: [
            '说明目标、验收行为、约束和尚未解决的范围问题。',
            '给出建议的职责、接口、数据与状态归属，以及重要的失败、安全、兼容性、迁移或运维行为。',
            '给出决定与理由、实质备选方案、假设和未决选择。',
            '把验证意图与验收挂钩：给出能相互区分的具体实例，以及适用于交互和边界的证据。预期结果来自需求或权威先例，不来自所提议的实现。',
            '当依赖或风险使顺序有意义时，给出实施顺序。',
            '绝不把假设当作已验收的需求。',
            '只有被要求时才写设计文档；否则直接在回复里返回方案，并且不写生产代码。',
          ],
        },
      ],
    },
    hardRules: {
      en: [
        { icon: 'design', title: 'No pressure, no abstraction', detail: 'If the real design pressure cannot be named — hidden effects, semantic duplication, a true variation axis — no new abstraction is introduced.' },
        { icon: 'document', title: 'Novelty tax', detail: 'Reflection, metaprogramming, new dependencies, and design patterns must show concrete benefit and explain why they exist.' },
        { icon: 'grid', title: 'Reuse by semantics', detail: 'Code is shared only when it implements the same domain rule and should evolve together. Looking similar is not a reason.' },
        { icon: 'shield', title: 'No production code', detail: 'The proposal is returned in the response. Design documents are updated only when you explicitly ask; implementation belongs to Develop.' },
      ],
      'zh-CN': [
        { icon: 'design', title: '无压力不抽象', detail: '说不出真实设计压力（隐藏副作用、语义重复、真实变化轴……），就不引入新抽象。' },
        { icon: 'document', title: '新奇税', detail: '反射、元编程、新依赖和设计模式必须给出具体收益，并说明它为什么存在。' },
        { icon: 'grid', title: '按语义复用', detail: '只有实现同一条领域规则、且应共同演进时才共享代码。看起来像不构成理由。' },
        { icon: 'shield', title: '不写生产代码', detail: '方案直接返回在回复里。只有你明确要求时才更新设计文档；实施交给 Develop。' },
      ],
    },
    example: {
      en: {
        prompt: '$engineering-flow:code-design\nWe need multi-channel notifications, but the modules and interfaces are unsettled. Use this repository to propose the lowest necessary complexity, trade-offs, open questions, and implementation sequence. Do not code.',
        turns: [
          { who: 'agent', text: 'Selects greenfield/discovery mode and reads the existing notification and queue capabilities in the repository.' },
          { who: 'agent', text: 'Names the actual pressure: channels differ only in delivery, which is one real variation axis; the remaining rules should change together.' },
          { who: 'agent', text: 'Offers two options with materially different trade-offs, compares ownership, testability, and migration cost, and recommends the simpler one.' },
          { who: 'agent', text: 'Explicitly rejects a plugin registry for hypothetical future channels — no observed pressure, so no abstraction.' },
          { who: 'agent', text: 'Returns boundaries, contracts, data ownership, open questions, acceptance evidence, and an implementation sequence. No production code is written.' },
        ],
      },
      'zh-CN': {
        prompt: '$engineering-flow:code-design\n我们要增加多渠道通知，但模块和接口还没确定。结合当前仓库给出最低必要复杂度的方案、权衡、开放问题和实施顺序。不要编码。',
        turns: [
          { who: 'agent', text: '判定为"全新 / 探索"模式，读取仓库里既有的通知和队列能力。' },
          { who: 'agent', text: '命名真实压力：各渠道只有投递方式不同，这是一条真实变化轴；其余规则应该共同变化。' },
          { who: 'agent', text: '给出两个取舍实质不同的方案，从归属、可测性和迁移成本比较，并推荐更简单的那个。' },
          { who: 'agent', text: '明确拒绝"为将来可能出现的渠道预留插件注册表"——没有观察到压力，就不引入抽象。' },
          { who: 'agent', text: '输出边界、契约、数据归属、开放问题、验收证据和实施顺序，不写一行生产代码。' },
        ],
      },
    },
    useWhen: {
      en: [
        'You have a goal or problem but no settled solution yet.',
        'An existing design or proposal needs correction, completion, or simplification.',
        'You want trade-offs compared and rejected options recorded before anyone writes code.',
        'You suspect a proposed architecture is more complex than the problem requires.',
      ],
      'zh-CN': [
        '有目标或问题，但方案还没定下来。',
        '已有的设计或提案需要纠错、补全或简化。',
        '希望在写代码之前，先把取舍比较清楚、把被拒绝的选项记下来。',
        '怀疑某个架构方案比问题本身还复杂。',
      ],
    },
    avoidWhen: {
      en: [
        { situation: 'The design is already accepted and needs implementing', instead: 'Develop' },
        { situation: 'Existing behavior is broken', instead: 'Diagnose' },
        { situation: 'You want findings on code that already exists', instead: 'Review' },
      ],
      'zh-CN': [
        { situation: '设计已经确定，只差实施', instead: 'Develop' },
        { situation: '现有行为坏了', instead: 'Diagnose' },
        { situation: '想对已经写好的代码拿一份问题清单', instead: 'Review' },
      ],
    },
    faq: {
      en: [
        { q: 'Will it edit my design documents?', a: 'Only when you explicitly ask. By default the proposal is returned in the response and no repository file is silently changed.' },
        { q: 'How do I turn the proposal into code?', a: 'Accept it, then invoke Develop. Code Design never implements production code in the same invocation.' },
        { q: 'Can I use it on a draft I already wrote?', a: 'Yes — that is refinement mode. It looks for missing behavior, contradictions, unclear ownership, infeasible assumptions, and decisions that lack evidence.' },
        { q: 'Why did it reject the abstraction I proposed?', a: 'Because no real design pressure was observed. Without pressure an abstraction only adds indirection, so the rejection is written down with its reason rather than silently accepted.' },
      ],
      'zh-CN': [
        { q: '它会直接改我的设计文档吗？', a: '只有你明确要求时才会。默认只把方案返回在回复里，不会静默修改仓库文件。' },
        { q: '方案怎么变成代码？', a: '你接受方案后调用 Develop。Code Design 在同一次调用里绝不实现生产代码。' },
        { q: '我已经写了草案，也能用吗？', a: '能，这就是"完善"模式。它会找出缺失行为、矛盾、归属不清、不可行假设，以及缺乏证据的决定。' },
        { q: '我提的抽象为什么被拒绝了？', a: '因为没有观察到真实设计压力。没有压力的抽象只会增加间接层，所以它会写明拒绝理由，而不是默默照做。' },
      ],
    },
  },

  review: {
    purpose: {
      en: 'Perform an evidence-backed, strictly read-only review from a fixed comparison point, and report findings ordered by impact.',
      'zh-CN': '从一个固定的比较点出发，做有证据、严格只读的评审，并按影响排序输出发现。',
    },
    why: {
      en: 'A review is only as good as two things: whether the target is pinned, and whether every finding carries evidence. Review freezes the comparison point first — a diff, a branch merge-base, or uncommitted work — then checks eight independent axes one by one. Every finding cites its location, its evidence, and the smallest credible correction. Finding a defect never grants permission to fix it.',
      'zh-CN': '一次评审的价值取决于两件事：评审对象是否被钉死，以及每条结论是否带证据。Review 先把比较点冻结——某个 diff、分支合并基，或当前未提交的改动——再从八个独立维度逐轴检查。每条发现都给出位置、证据和最小可信的修正方向。发现缺陷不等于获得修复权限。',
    },
    stages: {
      en: [
        {
          name: 'Fix the scope and recover intent',
          summary: 'One comparison point, and the intent it is measured against.',
          rules: [
            'Use the supplied comparison point: for a branch, resolve its merge base and inspect commits plus the three-dot diff; for uncommitted work, inspect staged, unstaged, and relevant untracked files against `HEAD`.',
            'Fail clearly on a bad reference or an empty scope instead of reviewing a different change.',
            'Read the user’s request, project instructions, originating requirements or design, and relevant tests and documentation.',
            'Without a specification, state the limit this places on assessing requirement fidelity.',
          ],
        },
        {
          name: 'Check and report',
          summary: 'Independent axes, assessed read-only, reported by impact.',
          rules: [
            'Compare accepted behavior with the diff for missing, partial, incorrect, or unrequested behavior.',
            'Trace credible failure conditions through affected callers, state, permissions, trust, data integrity, compatibility, and accessibility.',
            'Apply repository engineering standards to ownership, semantic reuse, explicit effects, abstraction cost, and dependencies.',
            'Check whether tests detect the protected behavior, and whether documentation still describes the accepted requirement.',
            'Include unrelated edits and temporary artifacts in the scope check.',
            'Report substantive findings by impact, with severity, precise location, triggering conditions or evidence, and the consequence; give a correction direction when supported.',
            'Skip tooling-enforced style and subjective alternatives without a concrete impact.',
            'If no material findings exist, say so and identify the verification gaps. Internal review dimensions do not require separate output sections.',
          ],
        },
        {
          name: 'Repair on request',
          gate: true,
          summary: 'Findings alone never authorize repair.',
          rules: [
            'A later explicit request to fix selected findings grants authority for that scope only.',
            'Verify the findings against the original requirements before applying them.',
            'Carry the authorized repair through verification without requiring another workflow token.',
            'With a stable public seam, observe the focused regression test fail before editing production behavior.',
            'Preserve any existing task approval gate, and align unresolved product decisions or added scope before implementing them.',
            'Do not edit files, commit, or push during the review itself.',
          ],
        },
      ],
      'zh-CN': [
        {
          name: '锁定比较范围并还原意图',
          summary: '一个固定的比较点，以及用来衡量它的意图。',
          rules: [
            '使用给定的比较点：分支先求出 merge base，再检查提交和三点 diff；未提交的改动则对照 `HEAD` 检查已暂存、未暂存和相关未跟踪文件。',
            '引用无效或范围为空时直接明确失败，而不是去评审另一处改动。',
            '阅读用户的请求、项目指令、来源需求或设计，以及相关的测试和文档。',
            '没有规格说明时，明确说出这给"判断是否符合需求"带来的限制。',
          ],
        },
        {
          name: '检查并报告',
          summary: '各条轴独立评估，全程只读，按影响排序报告。',
          rules: [
            '把验收行为与 diff 对照，找出缺失、部分完成、错误或未被要求的行为。',
            '把可信的失效条件追到受影响的调用方、状态、权限、信任、数据完整性、兼容性和可访问性上。',
            '用仓库的工程标准检查归属、语义复用、显式副作用、抽象成本和依赖。',
            '检查测试能否捕捉受保护的行为，以及文档是否仍在描述已验收的需求。',
            '把无关改动和临时产物一并纳入范围检查。',
            '按影响报告实质发现，给出严重程度、精确位置、触发条件或证据以及后果；有依据时给出纠正方向。',
            '工具强制执行的风格问题，以及没有具体影响的个人偏好，直接跳过。',
            '没有实质发现时如实说明，并指出验证上的缺口。内部的审查维度不需要各自单独成节。',
          ],
        },
        {
          name: '应要求修复',
          gate: true,
          summary: '发现本身永远不构成修复授权。',
          rules: [
            '之后明确要求修复部分发现，才授予对应范围的权限。',
            '应用之前，先对照原始需求核实这些发现。',
            '获得授权的修复直接推进到验证完成，不需要再调用另一个工作流。',
            '存在稳定公开接缝时，先观察聚焦的回归测试失败，再改生产行为。',
            '保留任务上已有的批准关卡；未定的产品决定或新增范围要先对齐再实施。',
            '评审本身不编辑文件、不提交、不推送。',
          ],
        },
      ],
    },
    hardRules: {
      en: [
        { icon: 'flag', title: 'Fixed comparison point', detail: 'The target is frozen at an explicit reference. A missing reference or empty scope fails loudly — no reviewing a moving target.' },
        { icon: 'grid', title: 'Eight independent axes', detail: 'Requirements, correctness, safety, design, readability, tests, documentation, and scope are checked one by one.' },
        { icon: 'shield', title: 'Strictly read-only', detail: 'No edits, no commits, no pushes. Finding a defect does not grant permission to repair it.' },
        { icon: 'check', title: 'Evidence per finding', detail: 'Every finding cites diff evidence and the requirement or invariant it violates, plus the smallest credible correction.' },
      ],
      'zh-CN': [
        { icon: 'flag', title: '固定比较点', detail: '评审对象冻结在明确参照上。参照缺失或范围为空时明确报错，不追移动目标。' },
        { icon: 'grid', title: '八轴独立审查', detail: '需求、正确性、安全、设计、可读性、测试、文档、范围，逐轴检查。' },
        { icon: 'shield', title: '严格只读', detail: '不编辑、不提交、不推送。发现缺陷不等于获得修复权限。' },
        { icon: 'check', title: '每条都有证据', detail: '每条发现都引用 diff 证据和被违反的需求或不变式，并给出最小可信的修正方向。' },
      ],
    },
    example: {
      en: {
        prompt: '$engineering-flow:review\nReview the current access-control changes against docs/access-policy.md. Report findings by severity with files and lines. Do not edit anything.',
        turns: [
          { who: 'agent', text: 'Resolves the scope: staged, unstaged, and relevant untracked files compared against `HEAD`.' },
          { who: 'agent', text: 'Reads docs/access-policy.md and the project instructions to recover what the change was supposed to do.' },
          { who: 'agent', text: 'Walks the eight axes one at a time, flagging a permission check that runs after the mutation as the highest-impact finding.' },
          { who: 'agent', text: 'Reports findings ordered by severity — each with file, line, diff evidence, impact, and the smallest credible correction — and edits nothing.' },
        ],
      },
      'zh-CN': {
        prompt: '$engineering-flow:review\n依据 docs/access-policy.md 评审当前权限改动。按严重程度报告问题并给出文件和行号，不要修改文件。',
        turns: [
          { who: 'agent', text: '先确定范围：已暂存、未暂存和相关未跟踪文件，与 `HEAD` 比较。' },
          { who: 'agent', text: '读 docs/access-policy.md 和项目指令，还原这次改动"应该做什么"。' },
          { who: 'agent', text: '逐轴走完八个维度，把"权限校验发生在写操作之后"标为影响最大的发现。' },
          { who: 'agent', text: '按严重程度输出发现，每条附文件、行号、diff 证据、影响和最小修正方向——一个文件也没改。' },
        ],
      },
    },
    useWhen: {
      en: [
        'You want an independent check before merging.',
        'The target is a diff, a branch, a pull request, or uncommitted work.',
        'You want a findings report rather than silent edits.',
        'You need severity-ordered findings you can hand to whoever will fix them.',
      ],
      'zh-CN': [
        '合并前想要一次独立检查。',
        '评审对象是某个 diff、分支、PR 或未提交的改动。',
        '你要的是问题报告，而不是被人默默改掉。',
        '需要一份按严重程度排序、可以直接交给修复者的清单。',
      ],
    },
    avoidWhen: {
      en: [
        { situation: 'You want the findings fixed as well', instead: 'Develop (new behavior) or Diagnose (broken behavior)' },
        { situation: 'The code does not exist yet', instead: 'Code Design' },
        { situation: 'A test is failing and you need the cause', instead: 'Diagnose' },
      ],
      'zh-CN': [
        { situation: '你还希望顺手把问题修掉', instead: 'Develop（新行为）或 Diagnose（坏行为）' },
        { situation: '代码还不存在', instead: 'Code Design' },
        { situation: '测试挂了，你要的是原因', instead: 'Diagnose' },
      ],
    },
    faq: {
      en: [
        { q: 'Can it fix what it finds?', a: 'No. Review is strictly read-only. When you decide to act, use Develop for new behavior or Diagnose for broken behavior.' },
        { q: 'Can it review without a requirement document?', a: 'Yes, but it will say up front that it can assess correctness risk and maintainability without being able to judge complete requirement fidelity.' },
        { q: 'What if I give it a bad reference?', a: 'It fails clearly and tells you the reference is invalid, instead of silently reviewing a different change.' },
        { q: 'Will it flag style preferences?', a: 'No. Preferences already enforced by tooling and subjective alternatives with no maintenance impact are deliberately left out.' },
      ],
      'zh-CN': [
        { q: '它能顺手把发现的问题改掉吗？', a: '不能。Review 严格只读。你决定动手时，新行为用 Develop，坏行为用 Diagnose。' },
        { q: '没有需求文档也能评审吗？', a: '能，但它会先说明：这次只能评估正确性风险和可维护性，无法完整判断需求符合度。' },
        { q: '我给的比较点是错的会怎样？', a: '它会明确报错并告诉你参照无效，而不是默默去评审另一份改动。' },
        { q: '它会挑代码风格吗？', a: '不会。工具已经强制的偏好，以及没有维护影响的主观替代写法，都被刻意排除。' },
      ],
    },
  },

  handoff: {
    purpose: {
      en: 'Capture the minimum durable state another session or agent needs to continue safely — nothing missing, nothing extra.',
      'zh-CN': '把另一个会话或 agent 安全继续所需的最小状态记录下来——一项不缺，一字不多。',
    },
    why: {
      en: 'Handoff is information compression. The next session does not need the transcript; it needs the smallest complete set of facts required to continue safely. An eight-item checklist guarantees completeness, and an empty category must say “None” rather than quietly disappearing — because omission and absence look identical to whoever reads it next.',
      'zh-CN': '交接的本质是信息压缩。下一个会话需要的不是对话全文，而是能安全继续的最小事实集。八项清单保证完整性，空的类别必须写"无"而不是悄悄消失——因为在下一个读者眼里，"漏写"和"确实没有"长得一模一样。',
    },
    stages: {
      en: [
        {
          name: 'Task and state',
          summary: 'What the task is, where it stands, and what is actually authorized.',
          rules: [
            'Check version-control status and the relevant diff, authoritative documents, and the latest verification output; separate current facts from unverified assumptions.',
            'Objective, accepted behavior, source workflow, and current phase.',
            'What is approved, and what is still awaiting approval.',
            'Preserve unknown authority as unknown — a handoff records existing authority, it never grants implementation permission or erases a pending checkpoint.',
          ],
        },
        {
          name: 'Work and evidence',
          summary: 'What exists now, and the commands that prove it.',
          rules: [
            'Current implementation state and the key files that carry it.',
            'Authoritative documents that constrain the work.',
            'Commands run and their latest results.',
          ],
        },
        {
          name: 'Decisions',
          summary: 'What was settled, and why.',
          rules: [
            'Settled decisions together with their reasons.',
            'References support these facts rather than replace them.',
          ],
        },
        {
          name: 'Continuation',
          summary: 'What is left, in the order it has to happen.',
          rules: [
            'Remaining work in dependency order.',
            'Risks, blockers, unresolved decisions, and unverified areas.',
            'Version-control state, including unrelated changes that must be preserved.',
            'State `None` explicitly for empty blockers, unresolved decisions, or unrelated changes.',
            'Link existing documents, commits, diffs, and test output without copying their contents.',
            'The next action must respect the recorded phase and approval boundary.',
            'Write to the requested path when one is given; otherwise return the record in the response without silently creating a repository file.',
          ],
        },
      ],
      'zh-CN': [
        {
          name: '任务与状态',
          summary: '任务是什么、走到哪一步、以及真正获得授权的部分。',
          rules: [
            '检查版本控制状态与相关 diff、权威文档和最新的验证输出，把当前事实与未经验证的假设分开。',
            '目标、验收行为、来源工作流和当前阶段。',
            '哪些已获批准，哪些仍在等待批准。',
            '权限未知就保持未知——交接记录已有的权限，绝不授予实施权限，也不抹掉尚未批准的检查点。',
          ],
        },
        {
          name: '工作与证据',
          summary: '现在有什么，以及证明它的命令。',
          rules: [
            '当前的实现状态，以及承载它的关键文件。',
            '约束这项工作的权威文档。',
            '跑过的命令和它们最新的结果。',
          ],
        },
        {
          name: '决定',
          summary: '定下了什么，以及为什么。',
          rules: [
            '已定下的决定及其理由。',
            '引用是用来支持这些事实的，不能替代它们。',
          ],
        },
        {
          name: '接续',
          summary: '剩下什么，以及必须按什么顺序做。',
          rules: [
            '按依赖顺序排列的剩余工作。',
            '风险、阻塞项、未决问题和尚未验证的部分。',
            '版本控制状态，包括必须保留的无关改动。',
            '阻塞项、未决问题或无关改动为空时，显式写出 `None`。',
            '链接已有的文档、提交、diff 和测试输出，而不是复制其内容。',
            '下一步动作必须尊重记录中的阶段与批准边界。',
            '给了路径就写到那个路径；没给就在回复里返回记录，不悄悄在仓库里新建文件。',
          ],
        },
      ],
    },
    hardRules: {
      en: [
        { icon: 'document', title: 'The eight-item checklist', detail: 'Objective, state, key files, decisions, command results, remaining tasks, risks, and version state. An empty category says “None” — it is never omitted.' },
        { icon: 'check', title: 'Facts, not transcripts', detail: 'Conclusions and their reasons are recorded; documents and test output are referenced. The conversation is never copied wholesale.' },
        { icon: 'lock', title: 'No silent files', detail: 'A file is written only when you give an explicit path; otherwise the handoff comes back in the reply.' },
        { icon: 'refresh', title: 'Fresh state only', detail: 'Version-control status, diffs, and verification output are re-read at handoff time rather than recalled from earlier in the session.' },
      ],
      'zh-CN': [
        { icon: 'document', title: '八项清单', detail: '目标、状态、关键文件、决定、命令结果、剩余任务、风险、版本状态。空的类别写"无"，绝不省略。' },
        { icon: 'check', title: '事实而非流水账', detail: '记录结论和原因，文档与测试结果用引用。绝不整段复制对话内容。' },
        { icon: 'lock', title: '默认不落盘', detail: '只有你明确给出路径时才写文件，否则交接内容直接返回在回复里。' },
        { icon: 'refresh', title: '只用新鲜状态', detail: '版本状态、diff 和验证输出都在交接时重新读取，而不是回忆会话早些时候的内容。' },
      ],
    },
    example: {
      en: {
        prompt: '$engineering-flow:handoff\nCreate a continuation record with the objective, completed state, key files, decisions, latest verification, remaining work, risks, and Git status.',
        turns: [
          { who: 'agent', text: 'Re-reads Git status and the diff, the authoritative requirement record, and the most recent test output.' },
          { who: 'agent', text: 'Organizes the facts into the eight items, writing “None” for blockers rather than dropping the category.' },
          { who: 'agent', text: 'Summarizes each decision with its reason, and references the requirement document and test results instead of pasting them.' },
          { who: 'agent', text: 'Returns the record in the response — no path was given, so no file is created.' },
        ],
      },
      'zh-CN': {
        prompt: '$engineering-flow:handoff\n生成当前任务的续接记录，包含目标、已完成状态、关键文件、决定、最新验证、剩余任务、风险和 Git 状态。',
        turns: [
          { who: 'agent', text: '重新读取 Git 状态和 diff、权威需求记录，以及最近一次测试输出。' },
          { who: 'agent', text: '把事实组织成八项，"阻塞"这一项写"无"，而不是直接省略掉。' },
          { who: 'agent', text: '逐条简述决定和它的原因，需求文档和测试结果用引用而不是粘贴全文。' },
          { who: 'agent', text: '把记录直接返回在回复里——因为没有给路径，所以没有创建任何文件。' },
        ],
      },
    },
    useWhen: {
      en: [
        'The session is ending and work passes to another session or teammate.',
        'The context window is nearly full and state must be saved before compaction.',
        'You need an executable record of exactly where the task stands.',
        'Someone else will continue and must not repeat decisions you already made.',
      ],
      'zh-CN': [
        '会话即将结束，工作要交给下一个会话或同事。',
        '上下文窗口快满了，压缩之前需要把状态保存下来。',
        '需要一份可执行的记录，说清任务到底停在哪里。',
        '别人要接着做，不能让他重复你已经做过的决定。',
      ],
    },
    avoidWhen: {
      en: [
        { situation: 'You want a summary for a human reader, not a continuation record', instead: 'Just ask for a summary' },
        { situation: 'The work itself is unfinished and you want it finished', instead: 'Develop' },
        { situation: 'You want an assessment of the change quality', instead: 'Review' },
      ],
      'zh-CN': [
        { situation: '你要的是给人看的总结，不是续接记录', instead: '直接要一份总结即可' },
        { situation: '工作本身没做完，你希望把它做完', instead: 'Develop' },
        { situation: '你想要的是对改动质量的评估', instead: 'Review' },
      ],
    },
    faq: {
      en: [
        { q: 'Will it write the handoff to a file?', a: 'Only when you give an explicit output path. Otherwise the record is returned in the reply and no repository file is created.' },
        { q: 'Why does it write “None” instead of skipping a section?', a: 'Because omission and genuine absence look the same to the next reader. Writing “None” proves the category was actually checked.' },
        { q: 'Does it paste the whole conversation?', a: 'No. It records conclusions and reasons, and references documents, commits, diffs, and test output rather than copying them.' },
        { q: 'Can I use it mid-task?', a: 'Yes. It captures the current state at any point — including unresolved decisions and unrelated work that must be preserved.' },
      ],
      'zh-CN': [
        { q: '它会把交接写成文件吗？', a: '只有你明确给出输出路径时才会。否则记录直接返回在回复里，不创建任何仓库文件。' },
        { q: '为什么空的部分要写"无"而不是跳过？', a: '因为在下一个读者眼里，"漏写"和"确实没有"看不出区别。写"无"才能证明这一类真的被检查过。' },
        { q: '它会把整段对话粘进去吗？', a: '不会。它记录结论和原因，文档、提交、diff 和测试输出都用引用而不是复制。' },
        { q: '任务做到一半也能用吗？', a: '可以。它会记录当前时刻的真实状态，包括未决决定和必须保留的无关改动。' },
      ],
    },
  },
};
