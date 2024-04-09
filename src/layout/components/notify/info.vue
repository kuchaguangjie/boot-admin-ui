<script setup lang="ts">
import { ref } from "vue";
import { FormProps } from "./utils/types";

const props = withDefaults(defineProps<FormProps>(), {
  formInline: () => ({
    id: undefined,
    title: "",
    content: "",
    created: "",
    createdBy: "",
    read: false
  })
});

const newFormInline = ref(props.formInline);
</script>

<template>
  <el-card shadow="never">
    <div class="notice-header">
      <div class="text-[#000000d9] dark:text-white">
        <div class="header-title">{{ newFormInline.title }}</div>
        <div class="header-description text-[#00000073] dark:text-white">
          发布人: {{ newFormInline.createdBy }} 发布时间：
          {{ newFormInline.created }}
        </div>
      </div>
    </div>
    <el-divider />
    <div class="notice-content text-[#000000d9] dark:text-white">
      <div v-html="newFormInline.content" />
    </div>
  </el-card>
</template>

<style lang="scss" scoped>
.notice-header {
  display: flex;
  justify-content: space-between;

  .header-title {
    margin-bottom: 8px;
    overflow: hidden;
    font-size: 16px;
    font-weight: 600;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
}

.notice-content {
  padding: 10px 0;
}
</style>
