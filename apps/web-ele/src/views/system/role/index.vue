<script lang="ts" setup>
import type { VbenFormProps } from '#/adapter/form';
import type { VxeGridProps } from '#/adapter/vxe-table';
import type { TableApi } from '#/types/table';

import { useVbenModal } from '@vben/common-ui';
import { $t } from '@vben/locales';

import {
  ElButton,
  ElIcon,
  ElMessage,
  ElMessageBox,
  ElSwitch,
} from 'element-plus';

import { useVbenVxeGrid } from '#/adapter/vxe-table';
import { deleteRoleApi, getRoleListApi } from '#/api/system/role';

import RoleFromModal from './roleFromModal.vue';

interface RowType {
  id: string;
  name: string;
  code: string;
  description: string;
  enabled: boolean;
  createTime: string;
}

async function getExampleTableApi(params: TableApi['PageFetchParams']) {
  return new Promise<{ items: any; total: number }>((resolve) => {
    getRoleListApi(params).then((res: { content: any; totalElements: any }) => {
      resolve({
        items: res.content,
        total: res.totalElements,
      });
    });
  });
}

const formOptions: VbenFormProps = {
  schema: [
    {
      component: 'Input',
      componentProps: {
        placeholder: '请输入角色名称或编码',
      },
      wrapperClass: 'w-1/3',
      defaultValue: '',
      fieldName: 'blurry',
      label: '角色名称/编码',
    },
  ],
  submitButtonOptions: {
    content: '查询',
  },
  submitOnChange: false,
  submitOnEnter: true,
};

const gridOptions: VxeGridProps<RowType> = {
  checkboxConfig: {
    highlight: true,
    labelField: 'name',
  },
  columns: [
    {
      align: 'left',
      type: 'checkbox',
      field: 'name',
      title: $t('system.role.name'),
    },
    { field: 'dataScope', title: $t('system.role.dataScope') },
    { field: 'description', title: $t('system.role.description') },
    {
      field: 'createTime',
      formatter: 'formatDate',
      title: $t('system.role.createTime'),
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
  connectedComponent: RoleFromModal,
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
    deleteRoleApi([row.id]).then(() => {
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
