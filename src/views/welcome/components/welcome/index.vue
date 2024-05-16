<script setup lang="ts">
import { computed } from "vue";
import { useAuthStoreHook } from "@/store/modules/auth";

const authStore = useAuthStoreHook();
// 早上好，下午好，晚上好
const sayHelloText = computed(() => {
  const now = new Date();
  const hour = now.getHours();
  if (hour >= 6 && hour < 12) {
    return "上午好!";
  } else if (hour >= 12 && hour < 18) {
    return "下午好!";
  } else {
    return "晚上好!";
  }
});
const nickname = computed(() => {
  return authStore.getUserInfo.nickname;
});
</script>

<template>
  <el-card class="bar-card" shadow="never">
    <template #header>
      <div class="bar-card-header">
        <span class="bar-card-header-title">欢迎</span>
        <span class="bar-card-header-subtitle"
          >{{ sayHelloText }} {{ nickname }}</span
        >
      </div>
    </template>
    <div class="bar-card-content">
      <p>欢迎使用后台管理系统</p>
    </div>
  </el-card>
</template>

<style lang="scss" scoped>
.bar-card {
  .bar-card-header {
    display: flex;
    align-items: center;
    justify-content: space-between;

    .bar-card-header-title {
      font-size: 16px;
      font-weight: 500;
    }

    .bar-card-header-subtitle {
      font-size: 14px;
      color: #999;
    }
  }

  .bar-card-content {
    padding: 20px;
  }
}
</style>
