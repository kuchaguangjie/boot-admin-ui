import type { FormRules } from "element-plus";
import { reactive } from "vue";

/** 自定义表单规则校验 */
export const formRules = reactive(<FormRules>{
  parentId: [
    { required: true, message: "所属机构为必选项", trigger: "change" }
  ],
  name: [{ required: true, message: "机构名称为必填项", trigger: "blur" }],
  linkMan: [{ required: true, message: "机构联系人为必填项", trigger: "blur" }],
  linkTel: [
    { required: true, message: "机构联系电话为必填项", trigger: "change" }
  ],
  type: [{ required: true, message: "机构类型为必选项", trigger: "change" }]
});
