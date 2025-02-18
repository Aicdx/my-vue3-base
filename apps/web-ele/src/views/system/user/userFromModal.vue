<script lang="ts" setup>
import { onMounted, ref } from 'vue';

import { useVbenForm, useVbenModal, z } from '@vben/common-ui';
import { $t } from '@vben/locales';

import { ElMessage } from 'element-plus';

import {
  type Department,
  getAllDepartmentsApi,
  getAllPositionsApi,
  getAllRolesApi,
  type Position,
  type Role,
} from '#/api/common';
import { createUserApi, updateUserApi } from '#/api/system/user';

const emit = defineEmits(['success']);

const rowData = ref<Record<string, any>>({});

const [BaseForm, formApi] = useVbenForm({
  // 所有表单项共用，可单独在表单内覆盖
  commonConfig: {
    // 所有表单项
    componentProps: {
      class: 'w-full',
    },
  },
  layout: 'horizontal',
  wrapperClass: 'grid-cols-2',
  showDefaultActions: false,
  schema: [
    {
      component: 'Input',
      componentProps: {
        placeholder: $t('system.user.usernamePlaceholder'),
      },
      fieldName: 'username',
      label: $t('system.user.username'),
      rules: 'required',
    },
    {
      component: 'Input',
      componentProps: {
        placeholder: $t('system.user.phonePlaceholder'),
      },
      fieldName: 'phone',
      label: $t('system.user.phone'),
      rules: z
        .string()
        .min(11, '手机号长度不能少于11位') // 最小长度
        .max(11, '手机号长度不能超过11位') // 最大长度
        .regex(/^1[3-9]\d{9}$/, '手机号格式不正确'), // 正则表达式校验
    },
    {
      component: 'Input',
      componentProps: {
        placeholder: $t('system.user.nicknamePlaceholder'),
      },
      fieldName: 'nickName',
      label: $t('system.user.nickname'),
      rules: 'required',
    },
    {
      component: 'Input',
      componentProps: {
        placeholder: $t('system.user.emailPlaceholder'),
        type: 'email',
      },
      fieldName: 'email',
      label: $t('system.user.email'),
      rules: z.string().email('邮箱格式不正确'),
    },
    {
      component: 'Select',
      componentProps: {
        placeholder: $t('system.user.departmentPlaceholder'),
        options: [],
      },
      fieldName: 'dept.id',
      label: $t('system.user.department'),
      rules: 'required',
    },
    // 岗位
    {
      component: 'Select',
      componentProps: {
        placeholder: $t('system.user.positionPlaceholder'),
        options: [],
        multiple: true,
      },
      fieldName: 'position',
      label: $t('system.user.position'),
      rules: 'required',
    },
    {
      component: 'RadioGroup',
      componentProps: {
        options: [
          { label: $t('system.user.male'), value: '男' },
          { label: $t('system.user.female'), value: '女' },
        ],
      },
      fieldName: 'gender',
      defaultValue: '男',
      label: $t('system.user.gender'),
    },
    {
      component: 'Switch',
      fieldName: 'enabled',
      defaultValue: true,
      label: $t('system.user.status'),
    },
    {
      component: 'Select',
      componentProps: {
        allowClear: true,
        filterOption: true,
        options: [],
        placeholder: $t('system.user.rolePlaceholder'),
        showSearch: true,
        multiple: true,
      },
      fieldName: 'role',
      label: $t('system.user.role'),
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
            jobs: data.position.map((id: string) => ({ id })),
            roles: data.role.map((id: string) => ({ id })),
            dept: { id: data.dept.id },
            id: rowData.value.id,
          };
          delete params.position;
          delete params.role;
          const api = rowData.value.id ? updateUserApi : createUserApi;
          api(params).then(() => {
            modalApi.close();
            ElMessage.success($t('common.success'));
            emit('success');
          });
        });
      }
    });
  },
  onOpenChange(isOpen: boolean) {
    if (isOpen) {
      const row = modalApi.getData<Record<string, any>>();
      rowData.value = row.record;
      // 处理roles
      row.record.role = row.record.roles
        ? row.record.roles.map((role: Role) => role.id)
        : [];
      row.record.position = row.record.jobs
        ? row.record.jobs.map((job: Position) => job.id)
        : [];
      formApi.setValues(row.record);
    }
  },
  class: 'w-1/2',
  title: '用户信息',
});
const getOptions = async () => {
  const [departments, roles, positions] = await Promise.all([
    getAllDepartmentsApi(),
    getAllRolesApi(),
    getAllPositionsApi(),
  ]);
  formApi.updateSchema([
    {
      fieldName: 'dept.id',
      componentProps: {
        options: departments.content.map((department: Department) => ({
          label: department.name,
          value: department.id,
        })),
      },
    },
    {
      fieldName: 'position',
      componentProps: {
        options: positions.content.map((position: Position) => ({
          label: position.name,
          value: position.id,
        })),
      },
    },
    {
      fieldName: 'role',
      componentProps: {
        options: roles.map((role: Role) => ({
          label: role.name,
          value: role.id,
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
    <BaseForm />
  </Modal>
</template>
