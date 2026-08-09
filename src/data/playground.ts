import type { Locale } from './site';
import { developSteps, snapshotMeta } from './site';

const localized = <T>(en: T, zh: T): Record<Locale, T> => ({ en, 'zh-CN': zh });

export const playgroundSnapshot = {
  ...snapshotMeta,
  sourceReport: 'develop-requirement-lifecycle',
  scenario: localized('Customer CSV export', '客户 CSV 导出'),
  request: localized(
    'Add a customer CSV export with filtering, numeric sorting, input preservation, and focused tests.',
    '增加客户 CSV 导出，支持过滤、数字排序、保持输入不变，并添加聚焦测试。',
  ),
  steps: developSteps.map((step, index) => ({ ...step, index })),
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
      body: localized('Goal, accepted behavior, out of scope, assumptions, and verification are ready for approval.', '目标、接受行为、范围外事项、假设和验证方式已准备好等待批准。'),
    },
    {
      actor: 'HUMAN GATE',
      title: localized('Explicit approval required', '需要明确批准'),
      body: localized('Production code and tests remain unchanged until the user approves implementation.', '在用户批准实施前，生产代码和测试保持不变。'),
    },
    {
      actor: 'AGENT',
      title: localized('Focused implementation', '聚焦实施'),
      body: localized('Validation, filtering, sorting, and CSV escaping are applied at the existing module boundary.', '校验、过滤、排序和 CSV 转义在现有模块边界内实现。'),
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
};
