<script setup lang="ts">
import { Notice } from "./utils/types";
import NoticeItem from "./item.vue";

const props = defineProps({
  list: {
    type: Array as PropType<Array<Notice>>,
    default: () => []
  },
  loading: {
    type: Boolean,
    default: false
  },
  loadData: {
    type: Function as PropType<() => void>,
    required: false
  },
  loadDisabled: {
    type: Boolean,
    default: false
  }
});

const emits = defineEmits(["read", "readAll"]);

function handleRead(item: Notice) {
  emits("read", item);
}
function readAll() {
  emits("readAll");
}
</script>

<template>
  <div class="notice-wrapper">
    <div class="notice-header">
      <span>消息通知</span>
      <el-link type="primary" @click.stop="readAll">清空</el-link>
    </div>
    <div class="notice-content">
      <div v-if="props.list.length" style="height: 100%">
        <div
          v-infinite-scroll="props.loadData"
          class="notice-scroll"
          style="overflow: auto"
          :infinite-scroll-distance="100"
          :infinite-scroll-immediate="false"
          :infinite-scroll-disabled="props.loadDisabled"
        >
          <NoticeItem
            v-for="item in list"
            :key="item.id"
            :item="item"
            @read="handleRead"
          />
        </div>
        <p v-if="props.loading">加载中....</p>
      </div>

      <el-empty v-else description="暂无消息" />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.notice-wrapper {
  width: 300px;

  .notice-header {
    display: flex;
    justify-content: space-between;
    padding: 10px 15px;
    font-size: 14px;
    border-bottom: 1px solid #f0f0f0;
  }

  .notice-content {
    padding: 0 15px;
  }

  .notice-scroll {
    max-height: 300px;
    padding: 10px 0;
  }
  // .notice-scroll {
  //   height: 100px;
  //   overflow: auto;
  // }
}
</style>
