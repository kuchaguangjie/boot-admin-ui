<script setup lang="ts">
import { ref } from "vue";
import { FormProps } from "./utils/types";
import ReCol from "@/components/ReCol";
import Segmented from "@/components/ReSegmented";
import { enabledOptions } from "@/utils/constants";
import { areaTree } from "@/api/sys/base/area";
import { onMounted } from "vue";

const props = withDefaults(defineProps<FormProps>(), {
  formInline: () => ({
    id: undefined,
    parentId: undefined,
    name: undefined,
    code: undefined,
    enabled: true,
    remark: ""
  })
});
const newFormInline = ref(props.formInline);
const treeData = ref<any>([]);
const ruleFormRef = ref();

function getRef() {
  return ruleFormRef.value;
}

function loadAreaTree() {
  areaTree().then(res => {
    if (res.success) {
      treeData.value = res.data;
    }
  });
}

onMounted(() => {
  loadAreaTree();
});

defineExpose({ getRef });
</script>

<template>
  <el-form ref="ruleFormRef" :model="newFormInline" label-width="82px">
    <el-row :gutter="30">
      <re-col :value="24" :xs="24" :sm="24">
        <el-form-item label="上级地区" prop="parentId">
          <el-cascader
            v-model="newFormInline.parentId"
            :options="treeData"
            :props="{
              value: 'id',
              label: 'name',
              children: 'children',
              emitPath: false,
              checkStrictly: true
            }"
            clearable
            filterable
            placeholder="请选择上级地区"
            style="width: 100%"
          />
        </el-form-item>
      </re-col>
      <re-col :value="24" :xs="24" :sm="24">
        <el-form-item label="地区名称" prop="name">
          <el-input
            v-model="newFormInline.name"
            clearable
            placeholder="请输入地区名称"
          />
        </el-form-item>
      </re-col>
      <re-col :value="24" :xs="24" :sm="24">
        <el-form-item label="地区编码" prop="code">
          <el-input
            v-model="newFormInline.code"
            clearable
            placeholder="请输入地区编码"
          />
        </el-form-item>
      </re-col>
      <re-col :value="24" :xs="24" :sm="24">
        <el-form-item label="启用">
          <Segmented
            :modelValue="newFormInline.enabled"
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
        <el-form-item label="备注" prop="remark">
          <el-input
            v-model="newFormInline.remark"
            type="textarea"
            clearable
            placeholder="请输入备注"
          />
        </el-form-item>
      </re-col>
    </el-row>
  </el-form>
</template>
