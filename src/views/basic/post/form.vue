<script setup lang="ts">
import { ref, computed } from "vue";
import { FormProps } from "./utils/types";
import { setFormRule } from "./utils/rules";
import { enabledOptions } from "@/utils/constants";
import ReSegmented from "@/components/ReSegmented/index";
const props = withDefaults(defineProps<FormProps>(), {
  formInline: () => ({
    id: undefined,
    code: "",
    name: "",
    enabled: true,
    sort: 99,
    description: ""
  })
});
const isUpdate = computed(() => !!props.formInline.id);
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
    label-width="82px"
    :rules="setFormRule(newFormInline)"
  >
    <el-form-item label="岗位编码" prop="code">
      <el-input
        v-model="newFormInline.code"
        placeholder="请输入岗位编码"
        :disabled="isUpdate"
      />
    </el-form-item>
    <el-form-item label="岗位名称" prop="name">
      <el-input v-model="newFormInline.name" placeholder="请输入岗位名称" />
    </el-form-item>
    <el-form-item label="是否启用" prop="enabled">
      <ReSegmented
        v-model="newFormInline.enabled"
        :options="enabledOptions"
        @change="
          ({ option: { value } }) => {
            newFormInline.enabled = value;
          }
        "
      />
    </el-form-item>
    <el-form-item label="排序" prop="sort">
      <el-input-number
        v-model="newFormInline.sort"
        style="width: 100%"
        :min="0"
        :max="99"
      />
    </el-form-item>
    <el-form-item label="岗位描述" prop="description">
      <el-input
        v-model="newFormInline.description"
        type="textarea"
        placeholder="请输入岗位描述"
      />
    </el-form-item>
  </el-form>
</template>
