<script lang="ts" setup>
import { ref } from 'vue';

import { useVbenForm, useVbenModal } from '@seasun/common-ui';
import { $t } from '@seasun/locales';

import { ElMessage } from 'element-plus';

import { createMenuApi, updateMenuApi } from '#/api/system/menu';

const emit = defineEmits(['success']);

const rowData = ref<Record<string, any>>({});
const [Form, formApi] = useVbenForm({
  showDefaultActions: false,
  wrapperClass: 'grid grid-cols-4 gap-4',
  schema: [
    {
      component: 'RadioGroup',
      componentProps: {
        placeholder: '请选择菜单类型',
        options: [
          {
            label: '目录',
            value: '0',
          },
          {
            label: '菜单',
            value: '1',
          },
          {
            label: '按钮',
            value: '2',
          },
        ],
      },
      fieldName: 'type',
      label: $t('system.menu.type'),
      rules: 'required',
      formItemClass: 'col-span-4',
    },
    {
      component: 'Switch',
      defaultValue: false,
      fieldName: 'IFrame',
      label: $t('system.menu.link'),
    },
    {
      component: 'Switch',
      defaultValue: true,
      fieldName: 'hidden',
      label: $t('system.menu.visible'),
    },
    {
      component: 'Switch',
      defaultValue: false,
      fieldName: 'cache',
      label: $t('system.menu.cache'),
    },
    {
      component: 'Input',
      componentProps: {
        placeholder: '请输入菜单标题',
      },
      fieldName: 'title',
      label: $t('system.menu.title'),
      rules: 'required',
      formItemClass: 'col-span-2',
    },
    {
      component: 'Input',
      componentProps: {
        placeholder: '请输入权限标识',
      },
      fieldName: 'permission',
      label: $t('system.menu.permission'),
      formItemClass: 'col-span-2',
    },
    {
      component: 'Input',
      componentProps: {
        placeholder: '请输入路由地址',
      },
      fieldName: 'path',
      label: $t('system.menu.path'),
      formItemClass: 'col-span-2',
    },
    {
      component: 'InputNumber',
      componentProps: {
        placeholder: '请输入排序号',
        min: 0,
      },
      defaultValue: 999,
      fieldName: 'menuSort',
      label: $t('system.menu.sort'),
    },
    {
      component: 'Input',
      componentProps: {
        placeholder: '请输入组件路径',
      },
      fieldName: 'component',
      label: $t('system.menu.component'),
      formItemClass: 'col-span-2',
    },
  ],
});

const [Modal, modalApi] = useVbenModal({
  onCancel() {
    modalApi.close();
  },
  onConfirm() {
    formApi.validate().then((res) => {
      if (res.valid) {
        formApi.getValues().then((data: any) => {
          const params = {
            ...data,
            id: rowData.value.id,
          };
          const api = rowData.value.id ? updateMenuApi : createMenuApi;
          api(params).then(() => {
            ElMessage.success($t('common.success'));
            emit('success');
            modalApi.close();
          });
        });
      }
    });
  },
  onOpenChange(isOpen: boolean) {
    if (isOpen) {
      const row = modalApi.getData<Record<string, any>>();
      rowData.value = row.record;
      formApi.setValues(row.record);
    }
  },
  class: 'w-1/2',
  title: '菜单信息',
});
</script>

<template>
  <Modal>
    <Form />
  </Modal>
</template>
