import type { RouteRecordRaw } from 'vue-router';

import { BasicLayout, IFrameView } from '#/layouts';
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
      {
        name: 'Menu',
        component: () => import('#/views/system/menu/index.vue'),
        path: '/system/menu',
        meta: {
          icon: 'mdi:menu',
          title: $t('page.system.menu'),
        },
      },
      {
        name: 'Post',
        component: () => import('#/views/system/post/index.vue'),
        path: '/system/post',
        meta: {
          icon: 'mdi:post',
          title: $t('page.system.post'),
        },
      },
      {
        name: 'SelfTarget',
        path: '/outside/iframe/self-target',
        component: IFrameView,
        meta: {
          icon: 'devicon:tailwindcss',
          iframeSrc:
            'http://it-qa.seasungame.com:34444/management/#/Performance/SelfTarget',
          // keepAlive: true,
          title: 'SelfTarget',
        },
      },
    ],
  },
];

export default routes;
