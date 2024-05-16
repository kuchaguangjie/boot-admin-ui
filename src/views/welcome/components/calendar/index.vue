<script setup lang="ts">
import ReCalendar from "@/components/ReCalendar";
</script>

<template>
  <el-card class="bar-card" shadow="never">
    <template #header>
      <div class="bar-card-header">
        <span class="bar-card-header-title">工作日历</span>
      </div>
    </template>
    <ReCalendar />
  </el-card>
</template>

<style lang="scss" scoped>
.bar-card {
  .bar-card-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .bar-card-header-title {
    font-size: 16px;
    font-weight: 500;
  }
}
</style>
