import { test } from 'node:test';
import assert from 'node:assert/strict';
import { clampNode, edgeGeometry, fitViewHeight, EDGE_GAP, MAP_VIEWBOX, VIEW_HEIGHT_LIMITS } from '../src/lib/map-geometry.mjs';

const A = { x: 118, y: 322, r: 40 };
const B = { x: 480, y: 322, r: 58 };

test('edgeGeometry clamps endpoints to the circle borders plus the gap', () => {
  const geom = edgeGeometry(A, B, { offA: -16, offB: 16, bend: -28 });
  assert.ok(Math.abs(Math.hypot(geom.sx - A.x, geom.sy - A.y) - (A.r + EDGE_GAP)) < 0.2);
  assert.ok(Math.abs(Math.hypot(geom.ex - B.x, geom.ey - B.y) - (B.r + EDGE_GAP)) < 0.2);
});

test('zero offsets and zero bend produce a straight edge whose control sits on the chord', () => {
  const geom = edgeGeometry(A, B, { offA: 0, offB: 0, bend: 0 });
  // 直线边：起终点纵坐标相等，标签锚点落在弦中点
  assert.equal(geom.sy, geom.ey);
  assert.equal(geom.ly, geom.sy);
  assert.ok(Math.abs(geom.lx - (geom.sx + geom.ex) / 2) < 0.2);
  assert.match(geom.d, /^M [\d.]+ [\d.]+ Q [\d.]+ [\d.]+ [\d.]+ [\d.]+$/);
});

test('the chip anchor is the t=0.5 point of the quadratic curve', () => {
  // 手算一条已知边：A(0,0) B(100,0) r=0 gap=0 bend=20 → S(0,0) E(100,0) C(50,20)
  const geom = edgeGeometry({ x: 0, y: 0, r: 0 }, { x: 100, y: 0, r: 0 }, { bend: 20, gap: 0 });
  // t=0.5: (S + 2C + E) / 4 = (50, 10)
  assert.equal(geom.lx, 50);
  assert.equal(geom.ly, 10);
  assert.equal(geom.d, 'M 0 0 Q 50 20 100 0');
});

test('offset angles bend the departure side of the circle', () => {
  const up = edgeGeometry(A, B, { offA: -16, offB: 16, bend: -28 });
  const down = edgeGeometry(A, B, { offA: 16, offB: -16, bend: 28 });
  assert.ok(up.sy < A.y, 'negative offA departs above the center line');
  assert.ok(down.sy > A.y, 'positive offA departs below the center line');
});

test('clampNode keeps the node circle plus title room inside the viewBox', () => {
  assert.deepEqual(clampNode({ x: -50, y: -50 }, 40), { x: 64, y: 64 });
  assert.deepEqual(clampNode({ x: 2000, y: 2000 }, 40), { x: MAP_VIEWBOX.width - 64, y: MAP_VIEWBOX.height - 84 });
  assert.deepEqual(clampNode({ x: 300, y: 200 }, 40), { x: 300, y: 200 });
});

test('fitViewHeight follows the canvas aspect within limits', () => {
  // 740×572 画布 → 960*572/740 ≈ 742，原样通过
  assert.equal(fitViewHeight(740, 572), Math.round((960 * 572) / 740));
  // 画布过窄（推算视区过高）时收敛到上限，避免图形被拉得过于稀疏
  assert.equal(fitViewHeight(470, 572), VIEW_HEIGHT_LIMITS.max);
  // 画布过宽时收敛到下限，保留最低拖拽高度
  assert.equal(fitViewHeight(1600, 500), VIEW_HEIGHT_LIMITS.min);
});
