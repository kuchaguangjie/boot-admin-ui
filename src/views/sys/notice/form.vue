<script setup lang="ts">
import "@wangeditor/editor/dist/css/style.css";

import { onBeforeUnmount, ref, shallowRef, onMounted } from "vue";
import { Editor, Toolbar } from "@wangeditor/editor-for-vue";
import { FormProps } from "./utils/types";
import ReCol from "@/components/ReCol";
import { usePublicHooks } from "@/utils/constants";
import { formRules } from "./utils/rules";
import { watch } from "vue";

const props = withDefaults(defineProps<FormProps>(), {
  formInline: () => ({
    id: undefined,
    title: "",
    content: "",
    noticeTimeStart: "",
    noticeTimeEnd: "",
    orgIds: [],
    orgId: "",
    noticeTime: [],
    enabled: true
  }),
  tenantOrgList: () => []
});

const ruleFormRef = ref();
const { switchStyle } = usePublicHooks();
const newFormInline = ref(props.formInline);

//wangeditor
const mode = "default";
// 编辑器实例，必须用 shallowRef
const editorRef = shallowRef();
// 内容 HTML
const valueHtml = ref("");

const toolbarConfig: any = { excludeKeys: "fullScreen" };
const editorConfig = { placeholder: "请输入内容..." };

const handleCreated = editor => {
  editorRef.value = editor; // 记录 editor 实例，重要！
};
watch(
  () => props.formInline?.content,
  () => {
    setTimeout(() => {
      if (editorRef.value) {
        editorRef.value.setHtml(props.formInline.content);
      }
    }, 100);
  },
  {
    immediate: true,
    deep: true
  }
);
// 组件销毁时，也及时销毁编辑器
onBeforeUnmount(() => {
  const editor = editorRef.value;
  if (editor == null) return;
  editor.destroy();
});

let start = null;
function noticeTimeDisabledDate(val) {
  if (!newFormInline.value?.noticeTime?.[0]) return false;
  return +val < +start;
}
function noticeCalendarChange(val) {
  start = val[0];
}
function getRef() {
  return ruleFormRef.value;
}
function getWangEditorRef() {
  return editorRef.value;
}

defineExpose({ getRef, getWangEditorRef });
</script>

<template>
  <el-form
    ref="ruleFormRef"
    :model="newFormInline"
    label-width="82px"
    :rules="formRules"
  >
    <el-row :gutter="30">
      <re-col :value="24" :xs="24" :sm="24">
        <el-form-item label="标题" prop="title">
          <el-input
            v-model="newFormInline.title"
            clearable
            placeholder="请输入标题"
          />
        </el-form-item>
      </re-col>
      <re-col :value="24" :xs="24" :sm="24">
        <el-form-item label="内容" prop="content">
          <div style="border: 1px solid #ccc">
            <Toolbar
              :editor="editorRef"
              :defaultConfig="toolbarConfig"
              :mode="mode"
              style="border-bottom: 1px solid #ccc"
            />
            <Editor
              v-model="valueHtml"
              :defaultConfig="editorConfig"
              :mode="mode"
              style="height: 500px; overflow-y: hidden"
              @onCreated="handleCreated"
            />
          </div>
        </el-form-item>
      </re-col>
      <re-col :value="24" :xs="24" :sm="24">
        <el-form-item label="通知时间" prop="noticeTime">
          <el-date-picker
            v-model="newFormInline.noticeTime"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            clearable
            format="YYYY-MM-DD"
            value-format="YYYY-MM-DD"
            :disabled-date="noticeTimeDisabledDate"
            @calendar-change="noticeCalendarChange"
          />
        </el-form-item>
      </re-col>
      <re-col :value="24" :xs="24" :sm="24">
        <el-form-item label="通知商户" prop="orgIds">
          <el-select
            v-model="newFormInline.orgIds"
            placeholder="请选择需要通知的商户"
            multiple
          >
            <el-option
              v-for="item in props.tenantOrgList"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
      </re-col>
      <re-col :value="24" :xs="24" :sm="24">
        <el-form-item label="状态" prop="enabled">
          <el-switch
            v-model="newFormInline.enabled"
            :style="switchStyle"
            active-text="正常"
            inactive-text="关闭"
          />
        </el-form-item>
      </re-col>
    </el-row>
  </el-form>
</template>
