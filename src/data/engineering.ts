import type { Locale } from './site';

// 设计原则页：先给出通用原则的标准定义，再逐条对照源仓库 skills/*/SKILL.md 与
// docs/behavior-spec.md 中真实存在的规则。没有对应规则的原则如实标注，不做附会。
type L<T> = Record<Locale, T>;

/** direct：有直接对应的规则条款；conditional：采纳但附加了触发条件；indirect：无独立条款，由其他规则间接覆盖 */
export type PrincipleStatus = 'direct' | 'conditional' | 'indirect';

export const engineeringPage = {
  eyebrow: { en: 'CONCEPTS', 'zh-CN': '核心概念' },
  title: { en: 'Design principles', 'zh-CN': '设计原则' },
  lede: {
    en: 'The rules these workflows enforce are not new inventions. This page states each classical design principle, then shows exactly which rule in the project encodes it — and where the project deliberately qualifies or omits one.',
    'zh-CN': '这些工作流所强制的规则并非新造。本页先给出每条经典设计原则的标准定义，再指出项目中具体由哪条规则承载它，以及项目在哪些地方刻意附加了条件或未作规定。',
  },

  statusLabels: {
    direct: { en: 'Encoded directly', 'zh-CN': '有直接条款' },
    conditional: { en: 'Adopted with a condition', 'zh-CN': '附条件采纳' },
    indirect: { en: 'No dedicated rule', 'zh-CN': '无独立条款' },
  },

  readingTitle: { en: 'How to read this page', 'zh-CN': '如何阅读本页' },
  readingBody: {
    en: 'Each principle below carries a status. **Encoded directly** means a rule states it as an obligation. **Adopted with a condition** means the principle applies only once a stated trigger is observed — the project treats unconditional application as a cost with no buyer. **No dedicated rule** means the project does not legislate it; the reason and the nearest related constraint are given instead.',
    'zh-CN': '下面每条原则都标有状态。**有直接条款**表示存在一条规则把它写成义务；**附条件采纳**表示只有在规定的触发条件被观察到之后才适用——项目把无条件套用视为一笔没有买家的成本；**无独立条款**表示项目没有为它立规矩，此时会说明原因，并给出最接近的相关约束。',
  },
  readingNote: {
    en: 'Rule identifiers such as REQ-01 or DESIGN-02 refer to the behavioral specification in the source repository. Every rule there must map to a failure mode that was actually observed.',
    'zh-CN': 'REQ-01、DESIGN-02 之类的规则编号对应源仓库中的行为规范。那里的每条规则都必须对应一个被真实观察到的失败模式。',
  },

  principlesTitle: { en: 'Object-oriented design principles', 'zh-CN': '面向对象设计原则' },
  principlesIntro: {
    en: 'Seven principles, in the order they matter to this project.',
    'zh-CN': '七条原则，按它们在本项目中的分量排序。',
  },
  principles: [
    {
      abbr: 'SRP',
      status: 'direct' as PrincipleStatus,
      icon: 'grid',
      name: { en: 'Single Responsibility Principle', 'zh-CN': '单一职责原则' },
      definition: {
        en: 'A module should have one, and only one, reason to change.',
        'zh-CN': '一个模块应当有且只有一个引起它变化的原因。',
      },
      encoded: {
        en: 'This is the principle the project enforces hardest. The maintainability standard requires that one rule have one authoritative owner, and "scattered ownership of one invariant" is listed as a legitimate design pressure. When placing a change, business behavior belongs in the module that owns the relevant data and invariant; entry points stay thin. When several callers break because of one faulty rule beneath them, the shared owner is fixed rather than each symptom.',
        'zh-CN': '这是项目执行得最严格的一条。可维护性标准要求"一条规则只有一个权威归属者"，而"一个不变量的归属被打散"被列为合法的设计压力信号。选择改动位置时，业务行为必须放在拥有相关数据与不变量的模块内，入口层保持轻薄；多个调用方因为下层同一条规则出错时，修复共同归属者，而不是逐个修补症状。',
      },
      rules: ['CODE-02', 'CODE-04', 'DESIGN-04', 'DOC-01'],
    },
    {
      abbr: 'LoD',
      status: 'direct' as PrincipleStatus,
      icon: 'compass',
      name: { en: 'Law of Demeter', 'zh-CN': '迪米特法则' },
      definition: {
        en: 'A unit should know as little as possible about the internals of other units.',
        'zh-CN': '一个单元应当尽可能少地了解其他单元的内部结构。',
      },
      encoded: {
        en: 'Present as the local-reasoning requirement, which is part of the always-on rules rather than any single workflow. A maintainer must be able to understand control flow, state changes, external effects, and failure behavior without mentally executing dense expressions or tracing unrelated modules. The same wording appears in the design workflow’s maintainability standard, so it constrains proposed boundaries as well as written code.',
        'zh-CN': '以"局部可推理"的形式存在，属于常驻规则而非某个工作流独有。维护者必须能在不心算复杂表达式、不追踪无关模块的前提下，理解控制流、状态变化、外部副作用与失败行为。同样的表述也写在设计工作流的可维护性标准里，因此它同时约束提出的边界和写下的代码。',
      },
      rules: ['READ-02', 'READ-03', 'DESIGN-04'],
    },
    {
      abbr: 'OCP',
      status: 'conditional' as PrincipleStatus,
      icon: 'design',
      name: { en: 'Open-Closed Principle', 'zh-CN': '开闭原则' },
      definition: {
        en: 'Software entities should be open for extension but closed for modification.',
        'zh-CN': '软件实体应当对扩展开放，对修改关闭。',
      },
      encoded: {
        en: 'Adopted only after the variation axis exists. "Repeated conditionals along one real variation axis" and "multiple real algorithms or policies" are named as legitimate signals — the latter is where Strategy becomes justified. The inverse is refused just as explicitly: interfaces with one implementation, factories with one product, configuration nobody changes, and extension points created for hypothetical needs are all rejected by name. An extension point built before the second implementation exists is indirection with no buyer.',
        'zh-CN': '只有在变化轴真实出现之后才采纳。"同一条真实变化轴上重复出现的条件分支"与"存在多种真实的算法或策略"被列为合法信号，后者正是策略模式成立的地方。反向要求同样明确：单实现的接口、单产品的工厂、无人修改的配置项，以及只为设想中的需求预留的扩展点，全部被逐项拒绝。在第二个实现出现之前就建好的扩展点，只是没有买家的间接层。',
      },
      rules: ['DESIGN-01', 'DESIGN-02', 'DESIGN-03'],
    },
    {
      abbr: 'DIP',
      status: 'conditional' as PrincipleStatus,
      icon: 'shield',
      name: { en: 'Dependency Inversion Principle', 'zh-CN': '依赖倒置原则' },
      definition: {
        en: 'High-level modules should not depend on low-level modules; both should depend on abstractions.',
        'zh-CN': '高层模块不应依赖低层模块，两者都应依赖抽象。',
      },
      encoded: {
        en: 'Dependency direction is a required section of every design proposal, alongside boundaries, responsibilities, contracts, and data ownership — so the question is always asked. Inversion itself is triggered by instability: "an unstable external dependency" is a named pressure, and an unstable third-party interface is the stated case where an Adapter is justified. Dependency isolation is also one of the targets of maintainability hardening. What the project does not require is an abstraction layer over a stable dependency; that falls back under the rejected speculative extension point.',
        'zh-CN': '依赖方向是每份设计方案的必填内容，与边界、职责、契约、数据归属并列，因此这个问题一定会被问到。倒置本身由不稳定性触发："不稳定的外部依赖"是被点名的设计压力，而不稳定的第三方接口正是适配器成立的既定场景；依赖隔离也是可维护性加固的对象之一。项目不要求的是：为一个稳定依赖统一加抽象层——那会落回被拒绝的预留扩展点。',
      },
      rules: ['DESIGN-02', 'DESIGN-03', 'DESIGN-04'],
    },
    {
      abbr: 'CRP',
      status: 'conditional' as PrincipleStatus,
      icon: 'code',
      name: { en: 'Composite Reuse Principle', 'zh-CN': '合成复用原则' },
      definition: {
        en: 'Prefer object composition over class inheritance to achieve reuse.',
        'zh-CN': '优先使用对象组合而非类继承来实现复用。',
      },
      encoded: {
        en: 'The project does not rank composition against inheritance — enforcing a universal style guide is an explicit non-goal, and the repository’s own idiom wins. What it does legislate is the test that must pass before anything is shared at all: does it implement the same domain rule, should every caller change together when that rule changes, and does the proposed owner hold the relevant data and invariant? Code that merely looks alike stays duplicated. In practice this lands on the same side as composite reuse, because it forbids the coupling that inheritance-for-reuse creates.',
        'zh-CN': '项目不对组合与继承排序——强推统一的语言风格指南是明确的非目标，仓库自身的惯例优先。它真正立规矩的是"共享之前必须通过的判据"：是否实现同一条领域规则、这条规则变化时是否所有调用方都应当一起变、被提议的归属者是否持有相关数据与不变量。仅仅长得像的代码保持各自独立。落到实践上，它与合成复用同向，因为它禁止的正是"为复用而继承"所制造的耦合。',
      },
      rules: ['CODE-01', 'CODE-03', 'DESIGN-03'],
    },
    {
      abbr: 'ISP',
      status: 'indirect' as PrincipleStatus,
      icon: 'document',
      name: { en: 'Interface Segregation Principle', 'zh-CN': '接口隔离原则' },
      definition: {
        en: 'No client should be forced to depend on methods it does not use.',
        'zh-CN': '客户端不应被迫依赖它不使用的接口。',
      },
      encoded: {
        en: 'There is no rule that legislates interface granularity, because granularity is a design decision the proposal is supposed to make, not a rule that can be checked from the outside. Two constraints reach it indirectly: "a missing stable public seam" counts as design pressure, and entry points are required to stay thin with behavior placed on the module that owns the invariant. Interface shape is therefore decided inside Code Design, under the same complexity budget as everything else.',
        'zh-CN': '项目没有为接口粒度立条款，因为粒度属于设计方案要做的决定，而不是一条能从外部检查的规则。有两处间接触及它："缺少稳定的公开接缝"被计为设计压力；入口层必须保持轻薄，行为归于拥有不变量的模块。因此接口形态在代码设计工作流内部决定，与其他一切一样接受同一份复杂度预算的约束。',
      },
      rules: ['DESIGN-02', 'CODE-04'],
    },
    {
      abbr: 'LSP',
      status: 'indirect' as PrincipleStatus,
      icon: 'check',
      name: { en: 'Liskov Substitution Principle', 'zh-CN': '里氏替换原则' },
      definition: {
        en: 'Objects of a subtype must be substitutable for their base type without breaking correctness.',
        'zh-CN': '子类型的对象必须能替换其基类型，且不破坏程序的正确性。',
      },
      encoded: {
        en: 'The project states no rule about type hierarchies, and this page will not pretend otherwise. Contract conformance is nevertheless checked, just at a different level: Review inspects correctness, failure behavior, and compatibility as separate axes, and completion requires every accepted behavior to be reconciled against fresh verification rather than assumed. A substitution that breaks a caller shows up there as a compatibility or correctness finding.',
        'zh-CN': '项目没有关于类型层次的任何规则，本页不做附会。契约一致性仍然会被检查，只是在另一个层面：评审把正确性、失败行为、兼容性作为彼此独立的审查轴；完成阶段要求每条验收行为都与新的验证结果逐条对账，而不是假定成立。一次破坏调用方的替换，会在那里以兼容性或正确性发现的形式暴露出来。',
      },
      rules: ['REVIEW-01', 'DONE-01', 'DONE-02'],
    },
  ],

  budgetTitle: { en: 'The complexity budget', 'zh-CN': '复杂度预算' },
  budgetIntro: {
    en: 'Three of the principles above are conditional for the same reason. The project’s stated objective is minimum necessary complexity — not minimum syntax, not maximum principle coverage. Three mechanisms enforce that.',
    'zh-CN': '上面有三条原则是附条件的，原因相同：项目的既定目标是"必要的最小复杂度"，既不是最少的语法，也不是最高的原则覆盖率。三个机制负责守住这一点。',
  },
  budgetItems: [
    {
      icon: 'design',
      title: { en: 'No observed pressure, no new abstraction', 'zh-CN': '没有观察到压力，就不新增抽象' },
      detail: {
        en: 'Pressure must be nameable: hard-to-follow control flow, hidden mutation or I/O, semantic duplication that must change together, repeated conditionals along one real axis, an unstable external dependency, scattered ownership of an invariant, real construction combinations, or a missing stable public seam.',
        'zh-CN': '压力必须能被指名：难以跟踪的控制流、隐藏的状态修改或 I/O、必须一起变化的语义重复、同一条真实变化轴上的重复条件、不稳定的外部依赖、被打散的不变量归属、真实存在的构造组合，或缺少稳定的公开接缝。',
      },
    },
    {
      icon: 'document',
      title: { en: 'The novelty tax', 'zh-CN': '新奇税' },
      detail: {
        en: 'An uncommon construct, reflection, metaprogramming, implicit runtime behavior, a new dependency, or a design pattern must deliver a concrete benefit in correctness, measured performance, framework alignment, or total maintenance cost. When justified, it is localized behind a clear boundary, named for intent, and explained by why it exists rather than how it works.',
        'zh-CN': '不常见的写法、反射、元编程、隐式运行期行为、新依赖或设计模式，必须在正确性、实测性能、框架一致性或总维护成本上给出具体收益。成立时，它要被局部化在清晰的边界之后、按意图命名，并解释它为什么存在，而不是它怎么工作。',
      },
    },
    {
      icon: 'grid',
      title: { en: 'Patterns are priced, not scored', 'zh-CN': '模式要计价，不计分' },
      detail: {
        en: 'A design pattern is accepted only when the complexity and coupling it removes exceed the interfaces, classes, files, and indirection it introduces. A pattern name is not evidence of quality.',
        'zh-CN': '一个设计模式只有在"它消除的复杂度与耦合，大于它引入的接口、类、文件和间接层"时才被接受。模式的名字本身不构成质量证据。',
      },
    },
  ],

  processTitle: { en: 'Constraints the classical principles do not cover', 'zh-CN': '经典原则未覆盖的约束' },
  processIntro: {
    en: 'Object-oriented principles govern the shape of code. They say nothing about how an agent should behave around your repository, which is where the remaining failure modes live.',
    'zh-CN': '面向对象原则约束的是代码的形态，它们没有规定一个智能体在你的仓库周围应当如何行事——而剩下的失败模式恰恰出现在那里。',
  },
  processItems: [
    {
      icon: 'chat',
      title: { en: 'Ambiguity is resolved before implementation', 'zh-CN': '歧义在实施前解决' },
      detail: {
        en: 'A question is only allowed to block when different answers materially change user-visible behavior, interfaces, data semantics, permissions, security, compatibility, destructive effects, or acceptance criteria. Independent questions are batched; reversible internal details are inferred from the repository instead of asked.',
        'zh-CN': '只有当不同答案会实质改变用户可见行为、接口、数据语义、权限、安全、兼容性、破坏性影响或验收标准时，一个问题才被允许阻塞流程。相互独立的问题合并成一批问完；可逆的内部细节从仓库推断，不拿来提问。',
      },
      rules: ['REQ-01', 'REQ-02', 'REQ-04'],
    },
    {
      icon: 'lock',
      title: { en: 'Approval is a separate, explicit act', 'zh-CN': '批准是独立且明确的动作' },
      detail: {
        en: 'The checkpoint carries five fixed items: goal, acceptance behavior, out of scope, assumptions, and solution boundary. Only action language sent after that checkpoint authorizes implementation. The initial request, answers to clarification questions, and a reading acknowledgement do not.',
        'zh-CN': '检查点固定包含五项：目标、验收行为、范围外、假设、方案边界。只有在检查点之后发出的行动指令才授权实施；最初的请求、对澄清问题的回答、以及一句"已读"，都不构成批准。',
      },
      rules: ['REQ-03', 'REQ-05', 'REQ-06'],
    },
    {
      icon: 'pulse',
      title: { en: 'Evidence precedes the claim', 'zh-CN': '证据先于结论' },
      detail: {
        en: 'Where a stable automated seam exists, the first write after repair authorization is the regression test, and its failure must be observed before production code changes. Completion is not claimed without fresh, scope-appropriate command output, and each accepted behavior is either supported by that evidence or reported as incomplete.',
        'zh-CN': '存在稳定的自动化接缝时，修复授权后的第一次写入必须是回归测试，并且必须先观察到它失败，才允许修改生产代码。没有新鲜且范围匹配的命令输出，不得声称完成；每条验收行为要么有证据支持，要么被明确报告为未完成。',
      },
      rules: ['TEST-01', 'TEST-03', 'DONE-01', 'DONE-02'],
    },
    {
      icon: 'flag',
      title: { en: 'Authority does not expand with invocation', 'zh-CN': '权限不随调用而扩大' },
      detail: {
        en: 'Invoking a workflow grants no permission to commit, push, merge, publish, open issues, install dependencies, or modify global configuration. Repository state is inspected without disturbing unrelated changes, and work the agent did not do is never reverted, overwritten, or absorbed.',
        'zh-CN': '调用一个工作流不授予提交、推送、合并、发布、创建 issue、安装依赖或修改全局配置的任何权限。查看仓库状态时不打扰无关改动，也绝不回滚、覆盖或吸收不是自己做出的工作。',
      },
      rules: ['SAFE-01', 'SAFE-02'],
    },
  ],

  ownerTitle: { en: 'Which workflow owns which activity', 'zh-CN': '各项活动的归属工作流' },
  ownerIntro: {
    en: 'A compact set of rules applies to every session automatically. The five workflows each deepen one segment of the loop, which is why they are invoked by name rather than loaded together.',
    'zh-CN': '一组精简规则在每次会话自动生效；五个工作流各自加深其中一段，这也是它们需要点名调用、而不是一起加载的原因。',
  },
  ownerColumns: {
    en: ['Activity', 'Owner', 'Guarantee'],
    'zh-CN': ['工程活动', '归属', '它保证什么'],
  },
  ownerRows: [
    {
      activity: { en: 'Requirement alignment and change control', 'zh-CN': '需求对齐与变更控制' },
      owner: { en: 'Develop', 'zh-CN': '开发' },
      guarantee: { en: 'Nothing is written before you approve a stated boundary.', 'zh-CN': '在你批准一份写明的边界之前，不写入任何内容。' },
    },
    {
      activity: { en: 'Defect analysis and regression prevention', 'zh-CN': '缺陷分析与回归防护' },
      owner: { en: 'Diagnose', 'zh-CN': '诊断' },
      guarantee: { en: 'The root cause is evidenced; the test is red before the fix is green.', 'zh-CN': '根因有证据支持；修复变绿之前，测试必须先变红。' },
    },
    {
      activity: { en: 'Boundary and complexity decisions', 'zh-CN': '边界与复杂度决策' },
      owner: { en: 'Code Design', 'zh-CN': '代码设计' },
      guarantee: { en: 'Materially different options compared; lowest necessary complexity recommended; no production code written.', 'zh-CN': '比较取舍实质不同的方案，推荐必要的最小复杂度，不写生产代码。' },
    },
    {
      activity: { en: 'Independent quality inspection', 'zh-CN': '独立质量检查' },
      owner: { en: 'Review', 'zh-CN': '评审' },
      guarantee: { en: 'Eight axes checked from a fixed comparison point; the repository is never modified.', 'zh-CN': '从固定比较点按八条轴检查；全程不修改仓库。' },
    },
    {
      activity: { en: 'Cross-session continuity', 'zh-CN': '跨会话连续性' },
      owner: { en: 'Handoff', 'zh-CN': '交接' },
      guarantee: { en: 'Eight required items, re-read from the repository rather than recalled.', 'zh-CN': '八项必填内容，从仓库重新读取而非凭记忆写出。' },
    },
    {
      activity: { en: 'Everyday discipline: reuse, readability, fresh verification', 'zh-CN': '日常纪律：复用、可读性、新鲜验证' },
      owner: { en: 'Engineering Core', 'zh-CN': 'Engineering Core' },
      guarantee: { en: 'Applies to every request with no command, and stays deliberately small.', 'zh-CN': '不需要任何命令即对每个请求生效，并刻意保持精简。' },
    },
  ],

  measuredTitle: { en: 'The trade-off is measured', 'zh-CN': '这份取舍是实测得出的' },
  measuredBody: {
    en: 'The same discipline applies to the tooling. Controlled runs showed that loading a full workflow automatically for an ordinary task cost roughly a third more tool calls and input tokens while changing no outcome. The workflows were therefore made user-invoked and the always-on core was reduced rather than extended. A rule that cannot show a failure behind it does not get added; a rule that buys nothing gets removed.',
    'zh-CN': '同一套纪律也适用于工具本身。对照实验显示：给普通任务自动加载完整工作流，工具调用与输入 token 大约多出三分之一，而结果没有变化。因此这些工作流改为用户点名调用，常驻 Core 被削减而非扩充。拿不出背后失败模式的规则不会被加入；买不到任何东西的规则会被移除。',
  },
  measuredNote: {
    en: 'The runs and the measured cost behind these decisions are on the Experiments & results page.',
    'zh-CN': '这些决定背后的实验记录与实测成本，见「实验与验证」页。',
  },
} satisfies Record<string, unknown>;

export type EngineeringCopy = typeof engineeringPage;
export type EngineeringLocalized = L<string>;
