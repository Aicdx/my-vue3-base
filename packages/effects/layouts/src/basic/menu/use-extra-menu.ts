import type { MenuRecordRaw } from '@seasun/types';

import { computed, ref, watch } from 'vue';
import { useRoute } from 'vue-router';

import { preferences } from '@seasun/preferences';
import { useAccessStore } from '@seasun/stores';
import { findRootMenuByPath } from '@seasun/utils';

import { useNavigation } from './use-navigation';

function useExtraMenu() {
  const accessStore = useAccessStore();
  const { navigation } = useNavigation();

  const menus = computed(() => accessStore.accessMenus);

  /** 记录当前顶级菜单下哪个子菜单最后激活 */
  const defaultSubMap = new Map<string, string>();

  const route = useRoute();
  const extraMenus = ref<MenuRecordRaw[]>([]);
  const sidebarExtraVisible = ref<boolean>(false);
  const extraActiveMenu = ref('');

  /**
   * 选择混合菜单事件
   * @param menu
   */
  const handleMixedMenuSelect = async (menu: MenuRecordRaw) => {
    extraMenus.value = menu?.children ?? [];
    extraActiveMenu.value = menu.parents?.[0] ?? menu.path;
    const hasChildren = extraMenus.value.length > 0;

    sidebarExtraVisible.value = hasChildren;
    if (!hasChildren) {
      await navigation(menu.path);
    } else if (preferences.sidebar.autoActivateChild) {
      await navigation(
        defaultSubMap.has(menu.path)
          ? (defaultSubMap.get(menu.path) as string)
          : menu.path,
      );
    }
  };

  /**
   * 选择默认菜单事件
   * @param menu
   * @param rootMenu
   */
  const handleDefaultSelect = (
    menu: MenuRecordRaw,
    rootMenu?: MenuRecordRaw,
  ) => {
    extraMenus.value = rootMenu?.children ?? [];
    extraActiveMenu.value = menu.parents?.[0] ?? menu.path;

    if (preferences.sidebar.expandOnHover) {
      sidebarExtraVisible.value = extraMenus.value.length > 0;
    }
  };

  /**
   * 侧边菜单鼠标移出事件
   */
  const handleSideMouseLeave = () => {
    if (preferences.sidebar.expandOnHover) {
      return;
    }
    sidebarExtraVisible.value = false;

    const { findMenu, rootMenu, rootMenuPath } = findRootMenuByPath(
      menus.value,
      route.path,
    );
    extraActiveMenu.value = rootMenuPath ?? findMenu?.path ?? '';
    extraMenus.value = rootMenu?.children ?? [];
  };

  const handleMenuMouseEnter = (menu: MenuRecordRaw) => {
    if (!preferences.sidebar.expandOnHover) {
      const { findMenu } = findRootMenuByPath(menus.value, menu.path);
      extraMenus.value = findMenu?.children ?? [];
      extraActiveMenu.value = menu.parents?.[0] ?? menu.path;
      sidebarExtraVisible.value = extraMenus.value.length > 0;
    }
  };

  watch(
    () => route.path,
    (path) => {
      const currentPath = route.meta?.activePath || path;
      // if (preferences.sidebar.expandOnHover) {
      //   return;
      // }
      const { findMenu, rootMenu, rootMenuPath } = findRootMenuByPath(
        menus.value,
        currentPath,
      );
      if (rootMenuPath) defaultSubMap.set(rootMenuPath, currentPath);
      extraActiveMenu.value = rootMenuPath ?? findMenu?.path ?? '';
      extraMenus.value = rootMenu?.children ?? [];
    },
    { immediate: true },
  );

  return {
    extraActiveMenu,
    extraMenus,
    handleDefaultSelect,
    handleMenuMouseEnter,
    handleMixedMenuSelect,
    handleSideMouseLeave,
    sidebarExtraVisible,
  };
}

export { useExtraMenu };
