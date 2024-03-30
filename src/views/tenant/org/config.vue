<script setup lang="ts">
import { ref } from "vue";
import { FormProps } from "./utils/types";
import ReCol from "@/components/ReCol";
import { useFormRule } from "./utils/rules";

const props = withDefaults(defineProps<FormProps>(), {
  formInline: () => ({
    id: undefined,
    name: "",
    sysCode: "",
    linkMan: "",
    linkTel: "",
    linkEmail: "",
    address: "",
    productId: "",
    usedEndTime: "",
    enabled: true
  })
});
const ruleFormRef = ref();
const newFormInline = ref(props.formInline);

function getRef() {
  return ruleFormRef.value;
}

defineExpose({ getRef });
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
