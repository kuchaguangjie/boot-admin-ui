<script setup lang="ts">
import { ArrowRight, ArrowLeft } from "@element-plus/icons-vue";
import type { CalendarDateType, CalendarInstance } from "element-plus";
import { Solar, Lunar, HolidayUtil } from "lunar-typescript";
import CalendarTag from "./tag.vue";
import { ref, computed } from "vue";

const props = defineProps({
  showHoliday: {
    type: Boolean,
    default: true
  },
  showJieqi: {
    type: Boolean,
    default: true
  }
});
const calendarRef = ref<CalendarInstance>();
const emits = defineEmits(["select"]);
function changeDate(type: CalendarDateType) {
  calendarRef.value?.selectDate(type);
}

/**
 * 获取阳历
 */
const solar = computed(() => (date: Date) => {
  const solar = Solar.fromDate(date);
  return solar;
});
/**
 * 获取阳历文本，如果是初一则显示月份
 */
const solarText = computed(() => (solar: Solar) => {
  if (solar.getDay() === 1) {
    return solar.getMonth() + "月" + solar.getDay();
  } else {
    return solar.getDay();
  }
});
/**
 * 获取农历
 */
const lunar = computed(() => (date: Date) => {
  const solar = Solar.fromDate(date);
  //获取农历
  const lunar = solar.getLunar();
  return lunar;
});

/**
 * 获取农历文本，如果是初一则显示月份
 */
const lunarText = computed(() => (lunar: Lunar) => {
  if (lunar.getDay() === 1) {
    return lunar.getMonthInChinese() + "月" + lunar.getDayInChinese();
  } else {
    return lunar.getDayInChinese();
  }
});

/**
 * 判断是否是今天
 */
const isToday = computed(() => (date: Date) => {
  const today = new Date();
  return (
    today.getFullYear() === date.getFullYear() &&
    today.getMonth() === date.getMonth() &&
    today.getDate() === date.getDate()
  );
});

/**
 * 判断是否是节假日
 */
const isHoliday = computed(() => (date: Date) => {
  const solar = Solar.fromDate(date);
  const holiday = HolidayUtil.getHoliday(
    solar.getYear(),
    solar.getMonth(),
    solar.getDay()
  );
  return holiday;
});

function handleSelect(data) {
  emits("select", data);
}
</script>

<template>
  <el-calendar ref="calendarRef">
    <template #header="{ date }">
      <!---mac calender-->
      <span class="calendar-title">{{ date }}</span>
      <div class="calendar-header">
        <el-button-group>
          <el-button :icon="ArrowLeft" @click="changeDate('prev-month')" />
          <el-button @click="changeDate('today')">今天</el-button>
          <el-button :icon="ArrowRight" @click="changeDate('next-month')" />
        </el-button-group>
      </div>
    </template>
    <template #date-cell="{ data }">
      <div class="calendar-cell w-full h-full" @click="handleSelect(data)">
        <div class="calendar-date">
          <div>
            <span>{{ lunarText(lunar(data.date)) }}</span>
          </div>
          <div>
            <span :class="{ 'is-today': isToday(data.date) }">{{
              solarText(solar(data.date))
            }}</span>
            <span>日</span>
          </div>
        </div>
        <CalendarTag
          :date="data.date"
          :show-holiday="props.showHoliday"
          :show-jieqi="props.showJieqi"
        />
        <!--自定义-->
        <slot :data="data" />
      </div>
    </template>
  </el-calendar>
</template>

<style lang="scss" scoped>
//去除默认样式
//当前日期
::v-deep(.el-calendar-table td.is-today) {
  //去除color
  color: var(--el-text-color-primary);
}

::v-deep(.el-calendar-table td.is-selected) {
  background-color: var(--el-fill-color-blank);
}

.calendar-title {
  margin-right: 10px;
  font-size: 20px;
  font-weight: 500;
}

.calendar-cell {
  display: flex;
  flex-direction: column;

  .calendar-date {
    display: flex;
    align-items: center;
    justify-content: space-between;

    span {
      font-size: 15px;
      font-weight: 500;
    }

    .is-today {
      display: inline-block;
      padding: 2px 5px;
      color: white;
      background-color: var(--el-color-primary);
      border-radius: 50%;
    }
  }
}
</style>
