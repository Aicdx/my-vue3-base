import type { TableApi } from '#/types/table';

import { requestClient } from '#/api/request';

export interface RoleModel {
  id: string;
  name: string;
  code: string;
  description: string;
  enabled: boolean;
  createTime: string;
}

/**
 * 获取角色列表
 */
export async function getRoleListApi(params: TableApi['PageFetchParams']) {
  return requestClient.get<TableApi['PageFetchResult']>('/api/roles', {
    params,
  });
}

/**
 * 创建角色
 */
export async function addRoleApi(data: Omit<RoleModel, 'id'>) {
  return requestClient.post('/api/roles', data);
}

/**
 * 更新角色
 */
export async function updateRoleApi(data: RoleModel) {
  return requestClient.put(`/api/roles/${data.id}`, data);
}

/**
 * 删除角色
 */
export async function deleteRoleApi(ids: string[]) {
  return requestClient.delete('/api/roles', { data: ids });
}
