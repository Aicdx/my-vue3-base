<script lang="ts" setup>
import { AuthenticationQrCodeLogin } from '@seasun/common-ui';
import { LOGIN_PATH } from '@seasun/constants';

defineOptions({ name: 'QrCodeLogin' });
</script>

<template>
  <AuthenticationQrCodeLogin :login-path="LOGIN_PATH" />
</template>
