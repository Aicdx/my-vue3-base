import type { TableApi } from '#/types/table';

import { requestClient } from '#/api/request';

export interface Role {
  id: string;
  name: string;
  dataScope: string;
  level: number;
}

export interface Department {
  id: string;
  name: string;
}

export interface Position {
  id: string;
  name: string;
}

/**
 * 获取所有角色
 */
export async function getAllRolesApi() {
  return requestClient.get<Role[]>('api/roles/all');
}

/**
 * 获取所有部门
 */
export async function getAllDepartmentsApi() {
  return requestClient.get<TableApi['PageFetchResult']>('api/dept');
}

/**
 * 获取所有岗位
 */
export async function getAllPositionsApi() {
  return requestClient.get<TableApi['PageFetchResult']>('api/job');
}
