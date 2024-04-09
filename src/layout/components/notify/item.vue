<script setup lang="ts">
import { ref } from "vue";
import { Notice } from "./utils/types";
import { useNav } from "@/layout/hooks/useNav";
import { deviceDetection } from "@pureadmin/utils";
import { nextTick } from "vue";

const props = defineProps({
  item: {
    type: Object as PropType<Notice>,
    required: true
  }
});

const emits = defineEmits(["read"]);

const titleRef = ref(null);
const titleTooltip = ref(false);
const { tooltipEffect } = useNav();
const isMobile = deviceDetection();

function hoverTitle() {
  nextTick(() => {
    titleRef.value?.scrollWidth > titleRef.value?.clientWidth
      ? (titleTooltip.value = true)
      : (titleTooltip.value = false);
  });
}

function handleRead() {
  emits("read", props.item);
}
</script>

<template>
  <div
    class="notice-container border-b-[1px] border-solid border-[#f0f0f0] dark:border-[#303030]"
    :class="{
      'bg-[#f5f5f5] border-[#d0d7deb3] dark:bg-[#303030] dark:border-[#d0d7deb3]':
        props.item.read
    }"
    @click.stop="handleRead()"
  >
    <div class="px-2">
      <div class="notice-container-text">
        <div class="notice-text-title text-[#000000d9] dark:text-white">
          <el-tooltip
            popper-class="notice-title-popper"
            :effect="tooltipEffect"
            :disabled="!titleTooltip"
            :content="props.item.title"
            placement="top-start"
            :enterable="!isMobile"
          >
            <div
              ref="titleRef"
              class="notice-title-content"
              @mouseover="hoverTitle"
            >
              {{ props.item.title }}
            </div>
          </el-tooltip>
        </div>
        <div class="notice-text-datetime text-[#00000073] dark:text-white">
          {{ props.item.created }}
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.notice-container {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  padding: 12px 0;

  // border-bottom: 1px solid #f0f0f0;

  .notice-container-avatar {
    margin-right: 16px;
    background: #fff;
  }

  .notice-container-text {
    display: flex;
    flex: 1;
    flex-direction: column;
    justify-content: space-between;

    .notice-text-title {
      display: flex;
      margin-bottom: 8px;
      font-size: 14px;
      font-weight: 400;
      line-height: 1.5715;
      cursor: pointer;

      .notice-title-content {
        flex: 1;
        width: 200px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }

      .notice-title-extra {
        float: right;
        margin-top: -1.5px;
        font-weight: 400;
      }
    }

    .notice-text-description,
    .notice-text-datetime {
      font-size: 12px;
      line-height: 1.5715;
    }

    .notice-text-description {
      display: -webkit-box;
      overflow: hidden;
      text-overflow: ellipsis;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
    }

    .notice-text-datetime {
      margin-top: 4px;
    }
  }
}
</style>
