<script setup lang="ts">
import { ref } from "vue";
import { FormDictItemProps } from "./utils/types";
import ReCol from "@/components/ReCol";
import Segmented from "@/components/ReSegmented";
import { enabledOptions } from "@/utils/constants";

const prop = withDefaults(defineProps<FormDictItemProps>(), {
  formInline: () => ({
    id: undefined,
    label: "",
    value: "",
    sort: 0,
    enabled: true,
    dict: undefined
  })
});

const ruleFormRef = ref();
const newFormInline = ref(prop.formInline);
function getRef() {
  return ruleFormRef.value;
}
defineExpose({ getRef });
</script>

<template>
  <el-form ref="ruleFormRef" :model="newFormInline" label-width="82px">
    <el-row :gutter="30">
      <re-col :value="12" :xs="24" :sm="24">
        <el-form-item label="字典" prop="dict">
          <el-input
            v-model="newFormInline.dict.name"
            clearable
            placeholder="请输入字典"
            disabled
          />
        </el-form-item>
      </re-col>
      <re-col :value="12" :xs="24" :sm="24">
        <el-form-item label="字典项名称" prop="label">
          <el-input
            v-model="newFormInline.label"
            clearable
            placeholder="请输入字典项名称"
          />
        </el-form-item>
      </re-col>
      <re-col :value="12" :xs="24" :sm="24">
        <el-form-item label="字典项值" prop="value">
          <el-input
            v-model="newFormInline.value"
            clearable
            placeholder="请输入字典项值"
          />
        </el-form-item>
      </re-col>
      <re-col :value="12" :xs="24" :sm="24">
        <el-form-item label="排序" prop="sort">
          <el-input-number v-model="newFormInline.sort" :min="0" :max="99" />
        </el-form-item>
      </re-col>
      <re-col :value="12" :xs="24" :sm="24">
        <el-form-item label="是否启用" prop="enabled">
          <Segmented
            v-model="newFormInline.enabled"
            :options="enabledOptions"
            @change="
              ({ option: { value } }) => {
                newFormInline.enabled = value;
              }
            "
          />
        </el-form-item>
      </re-col>
      <re-col :value="24" :xs="24" :sm="24">
        <el-form-item label="描述" prop="description">
          <el-input
            v-model="newFormInline.description"
            type="textarea"
            clearable
            placeholder="请输入描述"
          />
        </el-form-item>
      </re-col>
    </el-row>
  </el-form>
</template>
