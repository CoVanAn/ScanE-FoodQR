import {defineRouting} from 'next-intl/routing';

export const routing = defineRouting({
  locales: ['en', 'vi'],
  defaultLocale: 'vi',
  localePrefix: 'always' // Thay đổi về 'always' để tránh conflic
});
