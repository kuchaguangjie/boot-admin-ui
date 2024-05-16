<script setup lang="ts">
import ReCalendar from "@/components/ReCalendar";
import { computed, reactive } from "vue";
const date = reactive({
  year: new Date().getFullYear(),
  //补0
  month: String(new Date().getMonth() + 1).padStart(2, "0")
});
</script>

<template>
  <el-card class="bar-card" shadow="never">
    <template #header>
      <div class="bar-card-header">
        <div class="">
          <span class="bar-card-header-title">工作日历</span>
        </div>
        <div class="">
          <span>{{ date.year }}年{{ date.month }}月</span>
        </div>
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
@/components/ReCalendar
