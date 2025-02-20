import type { TableApi } from '#/types/table';

import { requestClient } from '#/api/request';

/**
 * 获取菜单列表
 */
export async function getMenuListApi(params: TableApi['PageFetchParams']) {
  return requestClient.get<TableApi['PageFetchResult']>('api/menus', {
    params,
  });
}

/**
 * 创建菜单
 */
export async function createMenuApi(data: any) {
  return requestClient.post('api/menus', data);
}

/**
 * 更新菜单
 */
export async function updateMenuApi(data: any) {
  return requestClient.put(`api/menus`, data);
}

/**
 * 删除用户
 */
export async function deleteMenuApi(data: any) {
  return requestClient.delete(`api/menus`, {
    data,
  });
}
