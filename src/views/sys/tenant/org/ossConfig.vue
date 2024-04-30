<script setup lang="ts">
import { onMounted, ref } from "vue";
import ReCol from "@/components/ReCol";
import * as tenantApi from "@/api/sys/tenant/org";
import { ossFormRules } from "./utils/rules";

const props = defineProps({
  sysCode: {
    type: String,
    default: ""
  }
});
const ruleFormRef = ref();
const newFormInline = ref<any>({});

function getRef() {
  return ruleFormRef.value;
}

function getValue() {
  return {
    ...newFormInline.value,
    sysCode: props.sysCode
  };
}

async function getOssConfig() {
  const res = await tenantApi.getOssConfig(props.sysCode);
  newFormInline.value = res.data || {};
}

onMounted(() => {
  getOssConfig();
});

defineExpose({
  getRef,
  getValue
});
</script>

<template>
  <el-form
    ref="ruleFormRef"
    :model="newFormInline"
    :rules="ossFormRules"
    position="right"
  >
    <el-row :gutter="30">
      <re-col :value="20" :xs="24" :sm="24">
        <el-form-item label="存储类型" prop="ossType">
          <el-select v-model="newFormInline.ossType" placeholder="请选择">
            <el-option label="阿里云" value="aliyun" />
            <el-option label="S3存储" value="s3" />
          </el-select>
        </el-form-item>
      </re-col>
      <re-col :value="20" :xs="24" :sm="24">
        <el-form-item label="名称" prop="ossName">
          <el-input v-model="newFormInline.ossName" placeholder="请输入名称" />
        </el-form-item>
      </re-col>

      <re-col :value="20" :xs="24" :sm="24">
        <el-form-item label="Bucket 桶名称" prop="bucketName">
          <el-input
            v-model="newFormInline.bucketName"
            placeholder="请输入bucketName"
          />
        </el-form-item>
      </re-col>
      <re-col :value="20" :xs="24" :sm="24">
        <el-form-item label="accessKey" prop="accessKey">
          <el-input
            v-model="newFormInline.accessKey"
            placeholder="请输入accessKey"
          />
        </el-form-item>
      </re-col>
      <re-col :value="20" :xs="24" :sm="24">
        <el-form-item label="secretKey" prop="secretKey">
          <el-input
            v-model="newFormInline.secretKey"
            placeholder="请输入secretKey"
          />
        </el-form-item>
      </re-col>
      <re-col :value="20" :xs="24" :sm="24">
        <el-form-item label="endpoint" prop="endpoint">
          <el-input
            v-model="newFormInline.endpoint"
            placeholder="请输入endpoint"
          />
          <template v-slot:append>
            <span class="desc"
              >例如：oss-cn-hangzhou.aliyuncs.com,不需要http开头</span
            >
          </template>
        </el-form-item>
      </re-col>
      <re-col :value="20" :xs="24" :sm="24">
        <el-form-item label="region" prop="region">
          <el-input
            v-model="newFormInline.region"
            placeholder="如果不填，默认为Auto"
          />
          <template v-slot:append>
            <span class="desc"
              >若Region为Auto无法使用，才需要填写对应Region</span
            >
          </template>
        </el-form-item>
      </re-col>
      <re-col :value="20" :xs="24" :sm="24">
        <el-form-item label="访问域名(CDN)" prop="domain">
          <el-input
            v-model="newFormInline.domain"
            placeholder="请输入访问域名"
          />
          <template v-slot:append>
            <span class="desc">例如：https://cdn.xxx.com,不需要http开头</span>
          </template>
        </el-form-item>
      </re-col>
    </el-row>
  </el-form>
</template>

<style lang="scss" scoped>
.desc {
  font-size: 12px;
  color: #909399;
}
</style>
@/api/sys/tenant/org
