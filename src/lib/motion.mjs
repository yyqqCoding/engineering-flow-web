/**
 * 动效助手：纯函数（可测试）+ DOM 绑定（幂等、可清理）。
 * 所有 DOM 初始化都返回 cleanup，配合 ClientRouter 在页面切换时回收副作用。
 */

/** @param {number} t 0..1 @returns {number} 缓出后的 0..1 */
export function easeOutCubic(t) {
  const clamped = Math.min(Math.max(t, 0), 1);
  return 1 - Math.pow(1 - clamped, 3);
}

/**
 * 把「51/51」这类统计文本拆成可动画的整数头部和静态尾部。
 * @param {string} text @returns {{ head: number | null, tail: string }}
 */
export function splitCountText(text) {
  const match = /^\s*(\d+)([\s\S]*)$/.exec(text);
  return match ? { head: Number(match[1]), tail: match[2] } : { head: null, tail: text };
}

/** @param {number} target @param {number} progress 0..1 @returns {number} 当前帧的整数值 */
export function countUpFrame(target, progress) {
  return Math.round(target * easeOutCubic(progress));
}

const finePointer = () => matchMedia('(pointer: fine)').matches;
const reducedMotion = () => matchMedia('(prefers-reduced-motion: reduce)').matches;

/**
 * ClientRouter 生命周期适配：每次进入页面执行 init（先回收上一次的副作用），
 * 离开页面前执行 cleanup。无 ClientRouter 时等同于立即执行一次。
 * @param {() => (void | (() => void))} init
 */
export function onPageLife(init) {
  let cleanup = () => {};
  const boot = () => {
    cleanup();
    const result = init();
    cleanup = typeof result === 'function' ? result : () => {};
  };
  document.addEventListener('astro:page-load', boot);
  document.addEventListener('astro:before-swap', () => {
    cleanup();
    cleanup = () => {};
  });
  boot();
}

/**
 * 数字滚动：元素进入视口一次后，从 0 数到目标值，静态尾部保持不变。
 * @param {ParentNode} root @returns {() => void}
 */
export function initCountUps(root = document) {
  const targets = [...root.querySelectorAll('[data-countup]')];
  if (targets.length === 0) return () => {};
  if (reducedMotion() || !('IntersectionObserver' in window)) return () => {};

  const timers = /** @type {Set<number>} */ (new Set());
  /** @param {Element} el */
  const run = (el) => {
    if (!(el instanceof HTMLElement)) return;
    // 始终以首次读到的文本为目标：页面生命周期重放时当前文本可能停在动画中帧
    const source = el.dataset.countText ?? el.textContent ?? '';
    el.dataset.countText = source;
    const { head, tail } = splitCountText(source);
    if (head === null) return;
    const duration = 950;
    const start = performance.now();
    /** @param {number} now */
    const step = (now) => {
      const progress = (now - start) / duration;
      el.textContent = `${countUpFrame(head, progress)}${tail}`;
      if (progress < 1) {
        const id = requestAnimationFrame(step);
        timers.add(id);
      }
    };
    timers.add(requestAnimationFrame(step));
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      observer.unobserve(entry.target);
      run(entry.target);
    });
  }, { threshold: 0.4 });
  targets.forEach((target) => observer.observe(target));

  return () => {
    observer.disconnect();
    timers.forEach((id) => cancelAnimationFrame(id));
    timers.clear();
  };
}

/**
 * 指针光斑：跟随指针在元素上写入 --mx/--my，供 CSS 径向渐变使用。
 * 仅精细指针设备启用；rAF 合帧避免高频写入。
 * @param {ParentNode} root @param {string} selector @returns {() => void}
 */
export function initSpotlights(root = document, selector = '[data-spot]') {
  if (!finePointer()) return () => {};
  const elements = /** @type {HTMLElement[]} */ ([...root.querySelectorAll(selector)].filter((el) => el instanceof HTMLElement));
  const cleanups = elements.map((el) => {
    let frame = 0;
    /** @param {PointerEvent} event */
    const move = (event) => {
      if (frame) return;
      frame = requestAnimationFrame(() => {
        frame = 0;
        const rect = el.getBoundingClientRect();
        el.style.setProperty('--mx', `${event.clientX - rect.left}px`);
        el.style.setProperty('--my', `${event.clientY - rect.top}px`);
      });
    };
    el.addEventListener('pointermove', move);
    return () => {
      el.removeEventListener('pointermove', move);
      if (frame) cancelAnimationFrame(frame);
    };
  });
  return () => cleanups.forEach((fn) => fn());
}

/**
 * 磁吸按钮：指针靠近时向指针方向轻微吸附，离开时弹簧回位。
 * @param {ParentNode} root @param {string} selector @param {number} strength 最大位移 px
 * @returns {() => void}
 */
export function initMagnets(root = document, selector = '[data-magnet]', strength = 5) {
  if (!finePointer() || reducedMotion()) return () => {};
  const elements = /** @type {HTMLElement[]} */ ([...root.querySelectorAll(selector)].filter((el) => el instanceof HTMLElement));
  const cleanups = elements.map((el) => {
    /** @param {PointerEvent} event */
    const move = (event) => {
      const rect = el.getBoundingClientRect();
      const dx = ((event.clientX - rect.left) / rect.width - 0.5) * 2;
      const dy = ((event.clientY - rect.top) / rect.height - 0.5) * 2;
      el.classList.remove('snap');
      el.style.transform = `translate(${(dx * strength).toFixed(2)}px, ${(dy * strength).toFixed(2)}px)`;
    };
    const leave = () => {
      el.classList.add('snap');
      el.style.transform = '';
    };
    el.addEventListener('pointermove', move);
    el.addEventListener('pointerleave', leave);
    return () => {
      el.removeEventListener('pointermove', move);
      el.removeEventListener('pointerleave', leave);
    };
  });
  return () => cleanups.forEach((fn) => fn());
}
