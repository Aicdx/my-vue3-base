<script lang="ts" setup>
import type { VbenFormProps } from '#/adapter/form';
import type { VxeGridProps } from '#/adapter/vxe-table';
import type { TableApi } from '#/types/table';

import { useVbenModal } from '@vben/common-ui';
import { $t } from '@vben/locales';

import { ElButton, ElIcon, ElMessage, ElMessageBox } from 'element-plus';

import { useVbenVxeGrid } from '#/adapter/vxe-table';
import { deleteMenuApi, getMenuListApi } from '#/api/system/menu';

import RoleFromModal from './menuFromModal.vue';

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
    getMenuListApi(params).then((res: { content: any; totalElements: any }) => {
      resolve({
        items: res.content,
        total: res.totalElements,
      });
    });
  });
}

async function fetchChildListApi(row: any) {
  return getMenuListApi({
    current: 1,
    size: 1000,
    pid: row.id,
  }).then((res) => {
    return res.content;
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
    labelField: '',
  },
  exportConfig: {},
  pagerConfig: {
    enabled: false,
  },
  treeConfig: {
    transform: true,
    rowField: 'id',
    parentField: 'parentId',
    lazy: true,
    hasChild: 'hasChildren',
    loadMethod({ row }) {
      return fetchChildListApi(row);
    },
  },
  height: 820,
  scrollY: {
    enabled: true,
    gt: 0,
  },
  columns: [
    {
      align: 'left',
      field: '',
      type: 'checkbox',
      width: 50,
    },
    {
      align: 'left',
      field: 'title',
      title: $t('system.menu.title'),
      treeNode: true,
    },
    { field: 'menuSort', title: $t('system.menu.sort') },
    { field: 'permission', title: $t('system.menu.permission') },
    { field: 'component', title: $t('system.menu.component') },
    { field: 'IFrame', title: $t('system.menu.link') },
    { field: 'cache', title: $t('system.menu.cache') },
    { field: 'hidden', title: $t('system.menu.visible') },
    {
      field: 'createTime',
      formatter: 'formatDate',
      title: $t('system.menu.createTime'),
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
      query: async ({ page }) => {
        return await getExampleTableApi({
          current: page.currentPage,
          size: page.pageSize,
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
    deleteMenuApi([row.id]).then(() => {
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
      <template #action="{ row }">
        <ElButton link type="primary" @click="handleEdit(row)">
          <ElIcon :size="16" class="icon-[mdi--pencil]" />
        </ElButton>
        <ElButton link type="danger" @click="handleDelete(row)">
          <ElIcon :size="16" class="icon-[mdi--delete]" />
        </ElButton>
      </template>
    </Grid>
    <Modal @success="handleSuccess" />
  </div>
</template>
