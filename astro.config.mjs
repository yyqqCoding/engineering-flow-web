import { defineConfig } from 'astro/config';

export default defineConfig({
  output: 'static',
  trailingSlash: 'never',
  // 悬停即预取内部链接，配合 ClientRouter 让换页近乎零等待
  prefetch: { prefetchAll: true, defaultStrategy: 'hover' },
});
