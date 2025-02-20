import type { TableApi } from '#/types/table';

import { requestClient } from '#/api/request';

/**
 * 获取用户信息
 */
export async function getUserListApi(params: TableApi['PageFetchParams']) {
  return requestClient.get<TableApi['PageFetchResult']>('api/users/list', {
    params,
  });
}

/**
 * 创建用户
 */
export async function createUserApi(data: any) {
  return requestClient.post('api/users', data);
}

/**
 * 更新用户
 */
export async function updateUserApi(data: any) {
  return requestClient.put(`api/users`, data);
}

/**
 * 删除用户
 */
export async function deleteUserApi(data: any) {
  return requestClient.delete(`api/users`, {
    data,
  });
}
