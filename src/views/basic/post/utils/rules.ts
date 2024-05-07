import { reactive, ref } from "vue";
import type { FormRules } from "element-plus";
import { existPostCode } from "@/api/basic/post";

const formData = ref();

/** 自定义表单规则校验 */
export const formRules = reactive(<FormRules>{
  name: [{ required: true, message: "岗位名称为必填项", trigger: "blur" }],
  code: [
    { required: true, message: "岗位编码为必填项", trigger: "blur" },
    {
      validator: async (rule, value, callback) => {
        if (value) {
          const { success, data } = await existPostCode(
            value,
            formData.value?.id ?? ""
          );
          if (success && data) {
            callback(new Error("岗位编码已存在"));
          }
        }
        callback();
      },
      trigger: "blur"
    }
  ]
});

export function setFormRule(data): FormRules {
  formData.value = data;
  return formRules;
}
