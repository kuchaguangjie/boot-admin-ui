<script setup lang="ts">
import { ref } from "vue";
import { FormProps } from "./utils/types";
import { setFormRule } from "./utils/rules";
import ReSegmented from "@/components/ReSegmented";
import { enabledOptions } from "../hooks";

const props = withDefaults(defineProps<FormProps>(), {
  formInline: () => ({
    code: "",
    name: "",
    principal: "",
    contact: "",
    siteNum: 0,
    accountNum: 0,
    enabled: true,
    description: ""
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
    :rules="setFormRule(newFormInline)"
    label-width="82px"
  >
    <el-form-item label="产品编码" prop="code">
      <el-input
        v-model="newFormInline.code"
        clearable
        placeholder="请输入产品编码"
        :disabled="!!newFormInline.id"
      />
    </el-form-item>
    <el-form-item label="产品名称" prop="name">
      <el-input
        v-model="newFormInline.name"
        clearable
        placeholder="请输入产品名称"
      />
    </el-form-item>
    <el-form-item label="负责人" prop="principal">
      <el-input
        v-model="newFormInline.principal"
        clearable
        placeholder="请输入产品负责人"
      />
    </el-form-item>

    <el-form-item label="联系方式" prop="contact">
      <el-input
        v-model="newFormInline.contact"
        clearable
        placeholder="请输入产品负责人联系方式"
      />
    </el-form-item>

    <el-form-item label="站点数量" prop="siteNum">
      <el-input-number
        v-model="newFormInline.siteNum"
        :min="0"
        :max="999999"
        controls-position="right"
        placeholder="请输入站点数量"
        style="width: 100%"
      />
    </el-form-item>

    <el-form-item label="账号数量" prop="accountNum">
      <el-input-number
        v-model="newFormInline.accountNum"
        :min="0"
        :max="999999"
        controls-position="right"
        placeholder="请输入账号数量"
        style="width: 100%"
      />
    </el-form-item>

    <el-form-item label="产品状态" prop="enabled">
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
