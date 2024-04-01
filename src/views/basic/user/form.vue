<script setup lang="ts">
import ReCol from "@/components/ReCol";
import { ref } from "vue";
import { FormProps } from "./utils/types";
import { useFormRule } from "./utils/rules";
import { usePublicHooks } from "@/utils/constants";
import { computed } from "vue";

const props = withDefaults(defineProps<FormProps>(), {
  formInline: () => ({
    id: undefined,
    roleIds: [],
    orgId: undefined,
    username: "",
    nickname: "",
    password: "",
    confirmPassword: "",
    phone: "",
    email: "",
    enabled: true
  }),
  orgList: () => [],
  roleList: () => []
});
const ruleFormRef = ref();
const newFormInline = ref(props.formInline);
const { switchStyle } = usePublicHooks();
const isUpdate = computed(() => !!props.formInline.id);
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
    :rules="useFormRule(newFormInline)"
  >
    <el-row :gutter="30">
      <re-col :value="24" :xs="24" :sm="24">
        <el-form-item label="所属机构" prop="orgId">
          <el-cascader
            v-model="newFormInline.orgId"
            class="w-full"
            :options="props.orgList"
            :props="{
              value: 'id',
              label: 'name',
              emitPath: false,
              checkStrictly: true
            }"
            clearable
            filterable
            placeholder="请选择所属机构"
            :disabled="isUpdate"
          >
            <template #default="{ node, data }">
              <span>{{ data.name }}</span>
              <span v-if="!node.isLeaf"> ({{ data.children.length }}) </span>
            </template>
          </el-cascader>
        </el-form-item>
      </re-col>
      <re-col :value="12" :xs="24" :sm="24">
        <el-form-item label="用户名" prop="username">
          <el-input
            v-model="newFormInline.username"
            clearable
            placeholder="请输入用户名"
            :disabled="isUpdate"
          />
        </el-form-item>
      </re-col>
      <re-col :value="12" :xs="24" :sm="24">
        <el-form-item label="昵称" prop="nickname">
          <el-input
            v-model="newFormInline.nickname"
            clearable
            placeholder="请输入昵称"
          />
        </el-form-item>
      </re-col>
      <re-col v-if="!isUpdate" :value="12" :xs="24" :sm="24">
        <el-form-item label="登录密码" prop="password">
          <el-input
            v-model="newFormInline.password"
            clearable
            placeholder="请输入登录密码"
            type="password"
            show-password
          />
        </el-form-item>
      </re-col>
      <re-col v-if="!isUpdate" :value="12" :xs="24" :sm="24">
        <el-form-item label="确认密码" prop="confirmPassword">
          <el-input
            v-model="newFormInline.confirmPassword"
            clearable
            placeholder="请再次输入登录密码"
            type="password"
          />
        </el-form-item>
      </re-col>
      <re-col :value="12" :xs="24" :sm="24">
        <el-form-item label="手机号" prop="phone">
          <el-input
            v-model="newFormInline.phone"
            clearable
            placeholder="请输入手机号"
          />
        </el-form-item>
      </re-col>
      <re-col :value="12" :xs="24" :sm="24">
        <el-form-item label="邮箱" prop="email">
          <el-input
            v-model="newFormInline.email"
            clearable
            placeholder="请输入邮箱"
          />
        </el-form-item>
      </re-col>
      <re-col :value="24" :xs="24" :sm="24">
        <el-form-item label="角色" prop="roleIds">
          <el-select
            v-model="newFormInline.roleIds"
            class="w-full"
            multiple
            clearable
            filterable
            placeholder="请选择角色"
          >
            <el-option
              v-for="item in props.roleList"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
      </re-col>
      <re-col :value="12" :xs="24" :sm="24">
        <el-form-item label="用户状态">
          <el-switch
            v-model="newFormInline.enabled"
            inline-prompt
            :active-value="true"
            :inactive-value="false"
            active-text="启用"
            inactive-text="停用"
            :style="switchStyle"
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
