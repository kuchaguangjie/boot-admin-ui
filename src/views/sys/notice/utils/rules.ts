import type { FormRules } from "element-plus";
import { reactive } from "vue";

export const formRules = reactive(<FormRules>{
  title: [{ required: true, message: "公告标题为必填项", trigger: "blur" }],
  content: [{ required: true, message: "公告内存为必填项", trigger: "blur" }],
  noticeTime: [{ required: true, message: "公告日期为必选项", trigger: "blur" }]
});
