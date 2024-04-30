import { reactive, ref } from "vue";
import type { FormRules } from "element-plus";
import { existsByCode } from "@/api/sys/tenant/product";

const formData = ref();

/** 自定义表单规则校验 */
export const formRules = reactive(<FormRules>{
  name: [{ required: true, message: "产品名称为必填项", trigger: "blur" }],
  code: [
    { required: true, message: "产品编码为必填项", trigger: "blur" },
    {
      validator: async (rule, value, callback) => {
        if (value) {
          const { success, data } = await existsByCode(
            value,
            formData.value?.id ?? ""
          );
          if (success && data) {
            callback(new Error("产品编码已存在"));
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
