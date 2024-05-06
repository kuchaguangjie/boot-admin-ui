import type { FormRules } from "element-plus";
import { reactive } from "vue";

export const dictFormRules = reactive(<FormRules>{
  name: [{ required: true, message: "请输入字典名称", trigger: "blur" }],
  type: [{ required: true, message: "请输入字典类型", trigger: "blur" }]
});
