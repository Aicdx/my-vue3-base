import type { TableApi } from '#/types/table';

import { requestClient } from '#/api/request';

/**
 * 获取岗位信息
 */
export async function getPostListApi(params: TableApi['PageFetchParams']) {
  return requestClient.get<TableApi['PageFetchResult']>('api/job', {
    params,
  });
}

/**
 * 创建岗位
 */
export async function createPostApi(data: any) {
  return requestClient.post('api/job', data);
}

/**
 * 更新岗位
 */
export async function updatePostApi(data: any) {
  return requestClient.put(`api/job`, data);
}

/**
 * 删除岗位
 */
export async function deletePostApi(data: any) {
  return requestClient.delete(`api/job`, {
    data,
  });
}
