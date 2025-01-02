import type { RouteRecordRaw } from 'vue-router';

import { BasicLayout } from '#/layouts';
import { $t } from '#/locales';

const routes: RouteRecordRaw[] = [
  {
    component: BasicLayout,
    meta: {
      icon: 'mdi:account-group',
      title: $t('page.employeeManagement.title'),
    },
    name: 'EmployeeManagement',
    path: '/employeeManagement',
    redirect: '/employeeManagement/employee',
    children: [
      {
        name: 'Employee',
        path: '/employeeManagement/employee',
        component: () =>
          import('#/views/employeeManagement/employee/index.vue'),
        meta: {
          icon: 'mdi:account-group',
          title: $t('page.employeeManagement.employee'),
        },
      },
    ],
  },
];

export default routes;
