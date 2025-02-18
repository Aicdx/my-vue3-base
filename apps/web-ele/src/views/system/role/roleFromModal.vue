<script lang="ts" setup>
import { useVbenForm, useVbenModal } from '@vben/common-ui';
import { $t } from '@vben/locales';

const props = defineProps<{
  record: Record<string, any>;
  type: 'add' | 'edit';
}>();

const [Form, formApi] = useVbenForm({
  schema: [
    {
      component: 'Input',
      componentProps: {
        placeholder: '请输入角色名称',
      },
      fieldName: 'name',
      label: $t('system.role.name'),
    },
    {
      component: 'Input',
      componentProps: {
        placeholder: '请输入角色编码',
      },
      fieldName: 'code',
      label: $t('system.role.code'),
    },
    {
      component: 'Input',
      componentProps: {
        placeholder: '请输入角色描述',
        type: 'textarea',
        rows: 4,
      },
      fieldName: 'description',
      label: $t('system.role.description'),
    },
    {
      component: 'Switch',
      defaultValue: true,
      fieldName: 'enabled',
      label: $t('system.role.status'),
    },
  ],
});

formApi.setValues(props.record);
const [Modal, modalApi] = useVbenModal({
  onCancel() {
    modalApi.close();
  },
  onConfirm() {},
  onOpenChange(isOpen: boolean) {
    if (isOpen) {
      formApi.setValues(props.record);
    }
  },
  class: 'w-1/2',
  title: '用户信息',
});
</script>

<template>
  <Modal>
    <Form />
  </Modal>
</template>
