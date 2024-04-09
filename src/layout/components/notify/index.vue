<script setup lang="ts">
import { useNotice } from "./utils/hook";
import Bell from "@iconify-icons/ep/bell";
import NoticeList from "./noticeList.vue";
import { ref } from "vue";
const dropdownRef = ref();

const {
  unReadCount,
  notices,
  loading,
  pagination,
  loadNotice,
  openDialog,
  visibleChange,
  handleReadAll
} = useNotice(dropdownRef);
</script>

<template>
  <el-dropdown
    ref="dropdownRef"
    trigger="click"
    placement="bottom-end"
    @visible-change="visibleChange"
  >
    <span class="dropdown-badge navbar-bg-hover select-none">
      <el-badge v-if="unReadCount > 0" :value="unReadCount" :max="99">
        <span class="header-notice-icon">
          <IconifyIconOffline :icon="Bell" />
        </span>
      </el-badge>
      <span v-else class="header-notice-icon">
        <IconifyIconOffline :icon="Bell" />
      </span>
    </span>
    <template #dropdown>
      <el-dropdown-menu>
        <NoticeList
          :list="notices"
          :loading="loading"
          :load-data="() => loadNotice()"
          :load-disabled="!pagination.next"
          @read="data => openDialog(data)"
          @readAll="handleReadAll"
        />
      </el-dropdown-menu>
    </template>
  </el-dropdown>
</template>

<style lang="scss" scoped>
.dropdown-badge {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 48px;
  margin-right: 10px;
  cursor: pointer;

  .header-notice-icon {
    font-size: 18px;
  }
}
</style>
