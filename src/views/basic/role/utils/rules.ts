import { reactive, ref } from "vue";
import type { FormRules } from "element-plus";
import { existsByCode } from "@/api/basic/role";

const formData = ref();

/** 自定义表单规则校验 */
export const formRules = reactive(<FormRules>{
  name: [{ required: true, message: "角色名称为必填项", trigger: "blur" }],
  code: [
    { required: true, message: "角色标识为必填项", trigger: "blur" },
    {
      validator: async (rule, value, callback) => {
        if (value) {
          const { success, data } = await existsByCode(
            value,
            formData.value?.id ?? ""
          );
          if (success && data) {
            callback(new Error("角色标识已存在"));
          }
        }
        callback();
      },
      trigger: "blur"
    }
  ],
  dataScope: [{ required: true, message: "数据权限为必填项", trigger: "blur" }],
  orgIds: [
    {
      validator: (rule, value, callback) => {
        if (formData.value?.dataScope === 3 && !value?.length) {
          callback(new Error("数据范围为必填项"));
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
