<script lang="ts" setup>
import { onMounted, ref } from 'vue';

import { useVbenForm, useVbenModal } from '@seasun/common-ui';
import { $t } from '@seasun/locales';

import { ElMessage } from 'element-plus';

import {
  addRoleApi,
  type Department,
  getAllDepartmentsApi,
  updateRoleApi,
} from '#/api';

const emit = defineEmits(['success']);

const rowData = ref<Record<string, any>>({});
const [Form, formApi] = useVbenForm({
  showDefaultActions: false,
  schema: [
    {
      component: 'Input',
      componentProps: {
        placeholder: '请输入角色名称',
      },
      fieldName: 'name',
      label: $t('system.role.name'),
      rules: 'required',
    },
    {
      component: 'InputNumber',
      componentProps: {
        placeholder: '请输入角色编码',
      },
      defaultValue: 3,
      fieldName: 'level',
      label: $t('system.role.level'),
      formItemClass: 'grid-cols-2',
    },
    {
      component: 'Select',
      componentProps: {
        placeholder: '请选择角色状态',
        options: [
          {
            label: '全部',
            value: '全部',
          },
          {
            label: '本级',
            value: '本级',
          },
          {
            label: '自定义',
            value: '自定义',
          },
        ],
      },
      defaultValue: '全部',
      fieldName: 'dataScope',
      label: $t('system.role.dataScope'),
      formItemClass: 'grid-cols-2',
    },
    {
      component: 'Select',
      componentProps: {
        placeholder: '请选择角色状态',
        options: [],
        multiple: true,
      },
      dependencies: {
        show(value) {
          if (value.dataScope === '自定义') {
            return true;
          }
          return false;
        },
        triggerFields: ['dataScope'],
      },
      defaultValue: [],
      fieldName: 'dept',
      label: $t('system.role.depts'),
      formItemClass: 'grid-cols-2',
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
            depts: data.dept.map((id: string) => ({ id })),
          };
          const api = rowData.value.id ? updateRoleApi : addRoleApi;
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
      rowData.value.dept = row.record.depts.map((dept: Department) => dept.id);
      formApi.setValues(row.record);
    }
  },
  class: 'w-1/2',
  title: '用户信息',
});
const getOptions = async () => {
  const departments = await getAllDepartmentsApi();
  formApi.updateSchema([
    {
      fieldName: 'dept',
      componentProps: {
        options: departments.content.map((department: Department) => ({
          label: department.name,
          value: department.id,
        })),
      },
    },
  ]);
};
onMounted(() => {
  getOptions();
});
</script>

<template>
  <Modal>
    <Form />
  </Modal>
</template>
