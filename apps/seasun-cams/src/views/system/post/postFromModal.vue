<script lang="ts" setup>
import { ref } from 'vue';

import { useVbenForm, useVbenModal } from '@seasun/common-ui';
import { $t } from '@seasun/locales';

import { ElMessage } from 'element-plus';

import { createPostApi, updatePostApi } from '#/api/system/post';

const emit = defineEmits(['success']);

const rowData = ref<Record<string, any>>({});
const [Form, formApi] = useVbenForm({
  showDefaultActions: false,
  wrapperClass: 'grid grid-cols-1 gap-4',
  schema: [
    {
      component: 'Input',
      componentProps: {
        placeholder: '请输入岗位名称',
      },
      fieldName: 'name',
      label: $t('system.post.title'),
      rules: 'required',
    },
    {
      component: 'InputNumber',
      componentProps: {
        placeholder: '请输入排序号',
        min: 0,
      },
      defaultValue: 999,
      fieldName: 'jobSort',
      label: $t('system.post.sort'),
      rules: 'required',
    },
    {
      component: 'RadioGroup',
      defaultValue: true,
      componentProps: {
        placeholder: '请选择岗位状态',
        options: [
          {
            label: '启用',
            value: true,
          },
          {
            label: '禁用',
            value: false,
          },
        ],
      },
      fieldName: 'enabled',
      label: $t('system.post.enabled'),
      rules: 'required',
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
          const api = rowData.value.id ? updatePostApi : createPostApi;
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
  class: 'w-1/3',
  title: '菜单信息',
});
</script>

<template>
  <Modal>
    <Form />
  </Modal>
</template>
