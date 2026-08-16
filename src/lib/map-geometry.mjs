// 衔接图连线几何（框架无关，SSR 与客户端拖拽共用同一份实现，保证首屏与逐帧一致）。
// 端点钳在节点圆周上：沿中心线方向分别偏转 offA/offB 度，再外扩 gap 像素；
// 路径为二次贝塞尔，控制点 = 弦中点 + 行进方向法线(-dy, dx) * bend；
// 标签锚点取 t=0.5 处（即 (S + 2C + E) / 4）。

export const MAP_VIEWBOX = { width: 960, height: 680 };
export const EDGE_GAP = 6;

// 视区高度跟随画布实际高宽比（图区与左侧列表列同高）；超出范围时收敛，退化为中心留白
export const VIEW_HEIGHT_LIMITS = { min: 600, max: 920 };

/**
 * @param {number} width 画布渲染宽度
 * @param {number} height 画布渲染高度
 */
export const fitViewHeight = (width, height) =>
  Math.min(Math.max(Math.round((MAP_VIEWBOX.width * height) / width), VIEW_HEIGHT_LIMITS.min), VIEW_HEIGHT_LIMITS.max);

/** @param {number} value */
const round1 = (value) => Math.round(value * 10) / 10;

// 屏幕坐标系（y 向下）标准旋转：正角度转向 (-dy, dx) 一侧
/** @param {number} x @param {number} y @param {number} degrees */
const rotate = (x, y, degrees) => {
  const rad = (degrees * Math.PI) / 180;
  const cos = Math.cos(rad);
  const sin = Math.sin(rad);
  return { x: x * cos - y * sin, y: x * sin + y * cos };
};

/**
 * @param {{x: number, y: number, r: number}} a 源节点圆
 * @param {{x: number, y: number, r: number}} b 目标节点圆
 * @param {{offA?: number, offB?: number, bend?: number, gap?: number}} edge 偏转与弯曲参数
 * @returns {{d: string, sx: number, sy: number, ex: number, ey: number, lx: number, ly: number}}
 */
export const edgeGeometry = (a, b, { offA = 0, offB = 0, bend = 0, gap = EDGE_GAP } = {}) => {
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  const len = Math.hypot(dx, dy) || 1;
  const ux = dx / len;
  const uy = dy / len;
  const depart = rotate(ux, uy, offA);
  const arrive = rotate(-ux, -uy, offB);
  const sx = a.x + depart.x * (a.r + gap);
  const sy = a.y + depart.y * (a.r + gap);
  const ex = b.x + arrive.x * (b.r + gap);
  const ey = b.y + arrive.y * (b.r + gap);
  const cx = (sx + ex) / 2 - uy * bend;
  const cy = (sy + ey) / 2 + ux * bend;
  return {
    d: `M ${round1(sx)} ${round1(sy)} Q ${round1(cx)} ${round1(cy)} ${round1(ex)} ${round1(ey)}`,
    sx: round1(sx),
    sy: round1(sy),
    ex: round1(ex),
    ey: round1(ey),
    lx: round1((sx + 2 * cx + ex) / 4),
    ly: round1((sy + 2 * cy + ey) / 4),
  };
};

/**
 * 拖拽位置钳制：留出节点光晕与下方标题的空间，不出视区
 * @param {{x: number, y: number}} pos 期望位置
 * @param {number} r 节点半径
 * @param {{width: number, height: number}} view 视区尺寸
 */
export const clampNode = (pos, r, view = MAP_VIEWBOX) => ({
  x: Math.min(Math.max(pos.x, r + 24), view.width - r - 24),
  y: Math.min(Math.max(pos.y, r + 24), view.height - r - 44),
});
