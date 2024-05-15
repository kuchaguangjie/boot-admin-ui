<script setup lang="ts">
import { ref, onMounted } from "vue";
import { FormProps } from "./utils/types";
import ReSegmented from "@/components/ReSegmented";
import { setFormRule } from "./utils/rules";
import { enabledOptions, dataScopeOptions } from "@/utils/constants";
import { treeOrg } from "@/api/basic/org";

const props = withDefaults(defineProps<FormProps>(), {
  formInline: () => ({
    code: "",
    name: "",
    dataScope: 0,
    orgIds: [],
    enabled: true,
    description: ""
  })
});

const ruleFormRef = ref();
const newFormInline = ref(props.formInline);
const orgTreeData = ref([]);

function getRef() {
  return ruleFormRef.value;
}
async function loadDept() {
  const { success, data } = await treeOrg({ sorts: "created" });
  if (success) {
    orgTreeData.value = data;
  }
}

onMounted(() => {
  loadDept();
});
defineExpose({ getRef });
</script>

<template>
  <el-form
    ref="ruleFormRef"
    :model="newFormInline"
    :rules="setFormRule(newFormInline)"
    label-width="82px"
  >
    <el-form-item label="角色标识" prop="code">
      <el-input
        v-model="newFormInline.code"
        clearable
        placeholder="请输入角色标识"
        :disabled="!!newFormInline.id"
      />
    </el-form-item>

    <el-form-item label="角色名称" prop="name">
      <el-input
        v-model="newFormInline.name"
        clearable
        placeholder="请输入角色名称"
      />
    </el-form-item>
    <el-form-item label="角色范围" prop="dataScope">
      <ReSegmented
        v-model="newFormInline.dataScope"
        :options="dataScopeOptions"
        @change="
          ({ option: { value } }) => {
            newFormInline.dataScope = value;
          }
        "
      />
    </el-form-item>

    <el-form-item
      v-if="newFormInline.dataScope === 3"
      label="数据范围"
      prop="orgIds"
    >
      <el-tree-select
        v-model="newFormInline.orgIds"
        :data="orgTreeData"
        multiple
        :render-after-expand="false"
        show-checkbox
        check-strictly
        check-on-click-node
        :props="{ label: 'name', children: 'children' }"
        value-key="id"
      />
    </el-form-item>

    <el-form-item label="角色状态" prop="enabled">
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

    <el-form-item label="备注">
      <el-input
        v-model="newFormInline.description"
        placeholder="请输入备注信息"
        type="textarea"
      />
    </el-form-item>
  </el-form>
</template>
