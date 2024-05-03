<script setup lang="ts">
import { ref } from "vue";
import { FormProps } from "./utils/types";
import { OrgTypeOptions } from "./utils/enums";
import { formRules } from "./utils/rules";
import ReCol from "@/components/ReCol";
import { treeOrg } from "@/api/basic/org";
import { onMounted } from "vue";
import ReSegmented from "@/components/ReSegmented";
import { computed } from "vue";
import { usePublicHooks } from "@/utils/constants";

const props = withDefaults(defineProps<FormProps>(), {
  formInline: () => ({
    id: undefined,
    parentId: undefined,
    name: "",
    linkMan: "",
    linkTel: "",
    linkEmail: "",
    address: "",
    type: 2,
    memo: "",
    system: false,
    enabled: true,
    saas: false
  })
});
const { switchStyle } = usePublicHooks();
const ruleFormRef = ref();
const newFormInline = ref(props.formInline);
const orgTreeData = ref([]);
const isUpdate = computed(() => !!newFormInline.value.id);
const isSystem = computed(() => newFormInline.value.system);
function getRef() {
  return ruleFormRef.value;
}
async function loadOrgTree() {
  const { success, data } = await treeOrg({ enabled: true, sorts: "created" });
  if (success) {
    orgTreeData.value = data;
  }
}

onMounted(() => {
  loadOrgTree();
});

defineExpose({
  getRef
});
</script>

<template>
  <el-form
    ref="ruleFormRef"
    :model="newFormInline"
    label-width="82px"
    :rules="formRules"
  >
    <el-row :gutter="30">
      <!--所属机构-->
      <re-col :value="24" :xs="24" :sm="24">
        <el-form-item label="所属机构" prop="parentId">
          <el-cascader
            v-model="newFormInline.parentId"
            class="w-full"
            :options="orgTreeData"
            :props="{
              value: 'id',
              label: 'name',
              emitPath: false,
              checkStrictly: true
            }"
            clearable
            filterable
            placeholder="请选择上级部门"
            :disabled="isUpdate"
          >
            <template #default="{ node, data }">
              <span>{{ data.name }}</span>
              <span v-if="!node.isLeaf"> ({{ data.children.length }}) </span>
            </template>
          </el-cascader>
        </el-form-item>
      </re-col>
      <re-col :value="24" :xs="24" :sm="24">
        <el-form-item label="机构名称" prop="name">
          <el-input
            v-model="newFormInline.name"
            clearable
            placeholder="请输入机构名称"
            :disabled="isUpdate"
          />
        </el-form-item>
      </re-col>
      <re-col :value="12" :xs="24" :sm="24">
        <el-form-item label="联系人" prop="linkMan">
          <el-input
            v-model="newFormInline.linkMan"
            clearable
            placeholder="请输入联系人"
            :disabled="isSystem"
          />
        </el-form-item>
      </re-col>
      <re-col :value="12" :xs="24" :sm="24">
        <el-form-item label="联系电话" prop="linkTel">
          <el-input
            v-model="newFormInline.linkTel"
            clearable
            placeholder="请输入联系电话"
            :disabled="isSystem"
          />
        </el-form-item>
      </re-col>
      <re-col :value="12" :xs="24" :sm="24">
        <el-form-item label="联系邮箱" prop="linkEmail">
          <el-input
            v-model="newFormInline.linkEmail"
            clearable
            placeholder="请输入联系邮箱"
          />
        </el-form-item>
      </re-col>
      <re-col :value="12" :xs="24" :sm="24">
        <el-form-item label="机构类型" prop="type">
          <ReSegmented
            v-model="newFormInline.type"
            :options="OrgTypeOptions"
            :disabled="isSystem"
            @change="
              ({ option: { value } }) => {
                newFormInline.type = value;
              }
            "
          />
        </el-form-item>
      </re-col>
      <re-col :value="12" :xs="24" :sm="24">
        <el-form-item label="是否启用" prop="enabled">
          <el-switch
            v-model="newFormInline.enabled"
            :active-value="true"
            :inactive-value="false"
            active-text="启用"
            inactive-text="停用"
            :style="switchStyle"
          />
        </el-form-item>
      </re-col>
      <re-col :value="24" :xs="24" :sm="24">
        <el-form-item label="地址" prop="address">
          <el-input
            v-model="newFormInline.address"
            clearable
            placeholder="请输入地址"
          />
        </el-form-item>
      </re-col>
      <re-col :value="24" :xs="24" :sm="24">
        <el-form-item label="备注" prop="memo">
          <el-input
            v-model="newFormInline.memo"
            type="textarea"
            clearable
            rows="4"
            placeholder="请输入备注"
          />
        </el-form-item>
      </re-col>
    </el-row>
  </el-form>
</template>

<style lang="scss" scoped>
:deep(.el-button:focus-visible) {
  outline: none;
}
</style>
