<script setup lang="ts">
import BasicConfig from "./basicConfig.vue";
import OSSConfig from "./ossConfig.vue";
import SmsConfig from "./smsConfig.vue";
import { ref } from "vue";

const basicConfigRef = ref();
const ossConfigRef = ref();
const tabActive = ref("basic");
const tabs = ref([
  { label: "基础配置", name: "basic" },
  { label: "OSS配置", name: "oss" },
  { label: "短信配置", name: "sms" },
  { label: "邮件配置", name: "email" }
]);

const props = defineProps({
  id: {
    type: String,
    default: ""
  },
  sysCode: {
    type: String,
    default: ""
  }
});

function getRef() {
  if (tabActive.value === "basic") {
    return basicConfigRef.value[0].getRef();
  } else if (tabActive.value === "oss") {
    return ossConfigRef.value[0].getRef();
  }
}

function getValue() {
  if (tabActive.value === "basic") {
    return basicConfigRef.value[0].getValue();
  } else if (tabActive.value === "oss") {
    return ossConfigRef.value[0].getValue();
  }
}

function getActiveTab() {
  return tabs.value.find(tab => tab.name === tabActive.value);
}

defineExpose({ getRef, getValue, getActiveTab });
</script>

<template>
  <el-tabs v-model="tabActive">
    <el-tab-pane
      v-for="tab in tabs"
      :key="tab.name"
      :label="tab.label"
      :name="tab.name"
    >
      <component
        :is="BasicConfig"
        v-if="tab.name === 'basic'"
        :id="props.id"
        ref="basicConfigRef"
      />
      <component
        :is="OSSConfig"
        v-if="tab.name === 'oss'"
        ref="ossConfigRef"
        :sysCode="props.sysCode"
      />
      <component :is="SmsConfig" v-if="tab.name === 'sms'" ref="smsConfigRef" />
    </el-tab-pane>
  </el-tabs>
</template>
