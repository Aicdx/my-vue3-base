import type { UserInfo } from '@vben/types';

import { requestClient } from '#/api/request';

/**
 * 获取用户信息
 */
export async function getUserListApi() {
  return requestClient.get<UserInfo>('/auth/user/info');
}
