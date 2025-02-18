import type { RouteRecordRaw } from 'vue-router';

import { BasicLayout } from '#/layouts';
import { $t } from '#/locales';

const routes: RouteRecordRaw[] = [
  {
    component: BasicLayout,
    meta: {
      icon: 'mdi:settings',
      title: $t('page.system.title'),
      order: -100,
    },
    name: 'System',
    path: '/system',
    redirect: '/system/user',
    children: [
      {
        name: 'User',
        component: () => import('#/views/system/user/index.vue'),
        path: '/system/user',
        meta: {
          icon: 'mdi:user',
          title: $t('page.system.user'),
        },
      },
      {
        name: 'Role',
        component: () => import('#/views/system/role/index.vue'),
        path: '/system/role',
        meta: {
          icon: 'mdi:shield-account',
          title: $t('page.system.role'),
        },
      },
    ],
  },
];

export default routes;
