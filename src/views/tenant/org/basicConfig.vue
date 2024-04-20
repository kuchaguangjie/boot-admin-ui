<script setup lang="ts">
import { onMounted, ref } from "vue";
import ReCol from "@/components/ReCol";
import * as tenantApi from "@/api/tenant/org";
import { useFormRule } from "./utils/rules";

const props = defineProps({
  id: {
    type: String,
    default: ""
  }
});
const ruleFormRef = ref();
const newFormInline = ref<any>({});

async function getBasicConfig() {
  const { success, data } = await tenantApi.getBasicConfigTenant(props.id);
  if (success) {
    newFormInline.value = data;
  }
}

function getRef() {
  return ruleFormRef.value;
}

function getValue() {
  return {
    ...newFormInline.value,
    id: props.id
  };
}

onMounted(() => {
  getBasicConfig();
});
defineExpose({ getRef, getValue });
</script>

<template>
  <el-form
    ref="ruleFormRef"
    :model="newFormInline"
    label-width="150px"
    :rules="useFormRule(newFormInline)"
    position="right"
  >
    <el-row :gutter="30">
      <re-col :value="16" :xs="24" :sm="24">
        <el-form-item label="使用截止时间" prop="usedEndTime">
          <el-date-picker
            v-model="newFormInline.usedEndTime"
            type="date"
            value-format="YYYY-MM-DD"
            format="YYYY-MM-DD"
            placeholder="请选择使用截止时间"
            style="width: 100%"
            :disabled-date="time => time.getTime() < Date.now()"
          />
        </el-form-item>
      </re-col>
    </el-row>
  </el-form>
</template>
