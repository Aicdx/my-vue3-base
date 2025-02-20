<script lang="ts" setup>
import type { VbenFormProps } from '#/adapter/form';
import type { VxeGridProps } from '#/adapter/vxe-table';
import type { TableApi } from '#/types/table';

import { useVbenModal } from '@seasun/common-ui';
import { $t } from '@seasun/locales';

import {
  ElButton,
  ElIcon,
  ElMessage,
  ElMessageBox,
  ElSwitch,
} from 'element-plus';

import { useVbenVxeGrid } from '#/adapter/vxe-table';
import { deleteUserApi, getUserListApi } from '#/api/system/user';

import UserFromModal from './userFromModal.vue';

interface RowType {
  id: string;
  username: string;
  nickName: string;
  gender: string;
  email: string;
  phone: string;
  department: string;
  enabled: boolean;
  releaseDate: string;
}

async function getExampleTableApi(params: TableApi['PageFetchParams']) {
  return new Promise<{ items: any; total: number }>((resolve) => {
    getUserListApi(params).then((res) => {
      resolve({
        items: res.content,
        total: res.totalElements,
      });
    });
  });
}
const formOptions: VbenFormProps = {
  // 默认展开
  schema: [
    {
      component: 'Input',
      componentProps: {
        placeholder: '请输入名称或者邮箱',
      },
      wrapperClass: 'w-1/3',
      defaultValue: '',
      fieldName: 'blurry',
      label: '名称/邮箱',
    },
  ],
  submitButtonOptions: {
    content: '查询',
  },
  // 是否在字段值改变时提交表单
  submitOnChange: false,
  // 按下回车时是否提交表单
  submitOnEnter: true,
};
const gridOptions: VxeGridProps<RowType> = {
  checkboxConfig: {
    highlight: true,
    labelField: 'name',
  },
  // 需要数据库导出可以配置
  // exportConfig: {
  //   type: 'csv',
  //   remote: true,
  //   exportMethod: async ({ $table, $grid, options }) => {
  //   },
  // },
  columns: [
    { type: 'checkbox', width: 100 },
    { align: 'left', field: 'username', title: $t('system.user.username') },
    { field: 'nickName', title: $t('system.user.nickname') },
    { field: 'gender', title: $t('system.user.gender') },
    { field: 'email', title: $t('system.user.email') },
    { field: 'phone', title: $t('system.user.phone') },
    { field: 'dept.name', title: $t('system.user.department') },
    {
      field: 'enabled',
      slots: { default: 'enabled' },
      title: $t('system.user.status'),
    },
    {
      field: 'releaseDate',
      formatter: 'formatDate',
      title: $t('system.user.createTime'),
    },
    {
      field: 'action',
      title: $t('common.action'),
      slots: { default: 'action' },
    },
  ],
  keepSource: true,
  proxyConfig: {
    ajax: {
      query: async ({ page }, formValues) => {
        return await getExampleTableApi({
          page: page.currentPage,
          pageSize: page.pageSize,
          ...formValues,
        });
      },
    },
  },
  toolbarConfig: {
    custom: true,
    export: true,
    refresh: true,
    zoom: true,
  },
};

const [Grid, gridApi] = useVbenVxeGrid({
  gridOptions,
  formOptions,
});
const [Modal, modalApi] = useVbenModal({
  // 连接抽离的组件
  connectedComponent: UserFromModal,
});

const handleSuccess = () => {
  gridApi.reload();
};

const handleAdd = () => {
  modalApi.setState({ title: $t('common.add') });
  modalApi.setData({ type: 'add', record: {} });
  modalApi.open();
};

const handleEdit = (row: RowType) => {
  modalApi.setState({ title: $t('common.edit') });
  modalApi.setData({ type: 'edit', record: row });
  modalApi.open();
};

const handleDelete = (row: RowType) => {
  ElMessageBox.confirm($t('common.deleteConfirm'), $t('common.prompt'), {
    confirmButtonText: $t('common.confirm'),
    cancelButtonText: $t('common.cancel'),
    type: 'warning',
  }).then(() => {
    deleteUserApi([row.id]).then(() => {
      ElMessage.success($t('common.success'));
      gridApi.reload();
    });
  });
};
</script>

<template>
  <div class="vp-raw w-full">
    <Grid>
      <template #toolbar-actions>
        <ElButton class="mr-2" type="primary" @click="handleAdd">
          {{ $t('common.add') }}
        </ElButton>
      </template>
      <template #enabled="{ row }">
        <ElSwitch v-model="row.enabled" />
      </template>
      <template #action="{ row }">
        <ElButton link type="primary" @click="handleEdit(row)">
          <ElIcon :size="16" class="icon-[mdi--edit]" />
        </ElButton>
        <ElButton link type="danger" @click="handleDelete(row)">
          <ElIcon :size="16" class="icon-[mdi--delete]" />
        </ElButton>
      </template>
    </Grid>
    <Modal @success="handleSuccess" />
  </div>
</template>
