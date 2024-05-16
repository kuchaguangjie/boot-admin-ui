<script setup lang="ts">
import { computed } from "vue";
import { Solar, HolidayUtil } from "lunar-typescript";
const props = defineProps({
  date: {
    type: Date,
    required: true
  },
  showHoliday: {
    type: Boolean,
    default: true
  },
  showJieqi: {
    type: Boolean,
    default: true
  }
});
/**
 * 获取农历
 */
const lunar = computed(() => {
  const solar = Solar.fromDate(props.date);
  //获取农历
  const lunar = solar.getLunar();
  return lunar;
});

/**
 * 判断是否是今天
 */
const isToday = computed(() => {
  const today = new Date();
  return (
    today.getFullYear() === props.date.getFullYear() &&
    today.getMonth() === props.date.getMonth() &&
    today.getDate() === props.date.getDate()
  );
});
/**
 * 判断是否是节假日
 */
const isHoliday = computed(() => {
  const solar = Solar.fromDate(props.date);
  const holiday = HolidayUtil.getHoliday(
    solar.getYear(),
    solar.getMonth(),
    solar.getDay()
  );
  return holiday;
});
</script>

<template>
  <!--节假日-->
  <div
    v-if="isHoliday && props.showHoliday"
    class="calendar-tag"
    :class="['calendar-tag', isHoliday.isWork() ? 'work' : 'holiday']"
  >
    <span v-if="isHoliday.isWork()"
      >{{ isHoliday.getName() }} <span class="">(班)</span></span
    >
    <span v-else>{{ isHoliday.getName() }}</span>
  </div>
  <!--节气-->
  <div v-if="lunar.getCurrentJie()" class="calendar-tag jieqi">
    <span>{{ lunar.getCurrentJie() }}</span>
  </div>
</template>

<style lang="scss" scoped>
.calendar-tag {
  padding: 2px 0;
  margin-top: 5px;
  font-size: 12px;
  text-align: center;
  border-radius: 5px;
}

.holiday {
  color: white;
  background-color: var(--el-color-success);
}

.work {
  color: white;
  background-color: var(--el-color-danger);
}

.jieqi {
  color: white;
  background-color: var(--el-color-warning);
}

.el-calendar-table td.prev,
.el-calendar-table td.next {
  .holiday {
    background-color: var(--el-color-success-light-3);
  }

  .work {
    // 灰色
    background-color: var(--el-color-danger-light-3);
  }

  .jieqi {
    background-color: var(--el-color-warning-light-3);
  }
}
</style>
