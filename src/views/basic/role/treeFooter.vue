import bg from '@/assets/login/bg.png';
<script setup lang="ts">
import { useRenderIcon } from "@/components/ReIcon/src/hooks";

const emits = defineEmits([
  "close",
  "confirm",
  "select",
  "unSelect",
  "collapse",
  "expand"
]);

function handleClose() {
  emits("close");
}
function handleConfirm() {
  emits("confirm");
}
function handleSelectAll() {
  emits("select");
}
function handleUnSelectAll() {
  emits("unSelect");
}
function handleCollapseAll() {
  emits("collapse");
}
function handleExpandAll() {
  emits("expand");
}
</script>

<template>
  <div class="flex items-center justify-between">
    <div class="flex">
      <el-dropdown>
        <el-button
          >批量操作
          <component :is="useRenderIcon('ep:arrow-down-bold')" />
        </el-button>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item @click="handleSelectAll"
              >全部选中</el-dropdown-item
            >
            <el-dropdown-item @click="handleUnSelectAll"
              >全部取消</el-dropdown-item
            >
            <el-dropdown-item @click="handleCollapseAll"
              >全部折叠</el-dropdown-item
            >
            <el-dropdown-item @click="handleExpandAll"
              >全部展开</el-dropdown-item
            >
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
    <div class="flex">
      <el-button bg @click="handleClose">取消</el-button>
      <el-popconfirm
        title="是否更新当前角色的权限信息"
        @confirm="handleConfirm"
      >
        <template #reference>
          <el-button type="primary" bg>确定</el-button>
        </template>
      </el-popconfirm>
    </div>
  </div>
</template>
