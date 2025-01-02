<script lang="ts" setup>
import type { TableData } from '../types';

import { ref } from 'vue';

import { SearchTable } from '@vben/common-ui';

import { ElButton, ElTableColumn } from 'element-plus';

import EditDialog from './components/EditDialog.vue';

// 姓名、性别、出生日期、联系方式、身份证号码、学历、专业、工作经验

const columns = [
  { label: '姓名', prop: 'name', width: 180 },
  { label: '性别', prop: 'gender', width: 180 },
  { label: '出生日期', prop: 'birthDate', width: 180 },
  { label: '联系方式', prop: 'phone', width: 180 },
  { label: '身份证号码', prop: 'idCard', width: 180 },
  { label: '学历', prop: 'education', width: 180 },
  { label: '专业', prop: 'profession', width: 180 },
  { label: '工作经验', prop: 'workExperience', width: 180 },
];
// 部门、岗位、工作地点、服务提供商
const searchItems = [
  {
    label: '部门',
    prop: 'department',
    type: 'input',
    placeholder: '请输入部门',
  },
  { label: '岗位', prop: 'position', type: 'input', placeholder: '请输入岗位' },
  {
    label: '工作地点',
    prop: 'workLocation',
    type: 'input',
    placeholder: '请输入工作地点',
  },
  {
    label: '服务提供商',
    prop: 'serviceProvider',
    type: 'input',
    placeholder: '请输入服务提供商',
  },
];

const fetchData = async () => {
  const educationList = ['高中', '专科', '本科', '硕士', '博士'];
  const professionList = [
    '计算机科学',
    '软件工程',
    '信息技术',
    '通信工程',
    '电子工程',
  ];

  const mockData = Array.from({ length: 13 }).map((_, index) => ({
    id: index + 1,
    name: `张三${index + 1}`,
    gender: index % 2 === 0 ? '男' : '女',
    birthDate: '1990-01-01',
    phone: `1380000${String(index + 1).padStart(4, '0')}`,
    idCard: `3301${String(index + 1).padStart(14, '0')}`,
    education: educationList[index % educationList.length] || educationList[0],
    profession:
      professionList[index % professionList.length] || professionList[0],
    workExperience: `${index + 1}年`,
  }));

  return {
    list: mockData,
    total: 100,
  };
};

const dialogVisible = ref(false);
const currentRow = ref({});

const handleEdit = (row: TableData) => {
  currentRow.value = row;
  dialogVisible.value = true;
};

const handleSave = () => {
  // 这里添加保存逻辑
};
</script>

<template>
  <SearchTable
    :columns="columns"
    :fetch-data="fetchData"
    :search-items="searchItems"
  >
    <template #operate>
      <ElButton type="primary">搜索</ElButton>
      <ElButton>重置</ElButton>
      <ElButton>导入</ElButton>
    </template>
    <template #columns>
      <ElTableColumn fixed="right" label="操作" width="150">
        <template #default="scope">
          <ElButton link type="primary" @click="handleEdit(scope.row)">
            编辑
          </ElButton>
          <ElButton link type="danger" @click="console.log(scope.row)">
            删除
          </ElButton>
        </template>
      </ElTableColumn>
    </template>
  </SearchTable>

  <EditDialog
    v-model:visible="dialogVisible"
    :row-data="currentRow"
    @save="handleSave"
  />
</template>
