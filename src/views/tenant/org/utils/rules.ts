import { isEmail, isPhone } from "@pureadmin/utils";
import type { FormRules } from "element-plus";
import { reactive, ref } from "vue";
import { existsBySysCode } from "@/api/tenant/org";

const formData = ref();
/** 自定义表单规则校验 */
export const formRules = reactive(<FormRules>{
  name: [{ required: true, message: "商户名称为必填项", trigger: "blur" }],
  sysCode: [
    { required: true, message: "商户识别码为必填项", trigger: "blur" },
    {
      validator: async (rule, value, callback) => {
        if (value === "") {
          callback(new Error("请输入商户识别码"));
        }
        const { success, data } = await existsBySysCode(
          value,
          formData?.value?.id ?? ""
        );
        if (success) {
          if (data) {
            callback(new Error("商户识别码已存在"));
          } else {
            callback();
          }
        } else {
          callback(new Error("商户识别码校验失败"));
        }
      },
      trigger: "blur"
    }
  ],
  linkMan: [{ required: true, message: "联系人为必填项", trigger: "blur" }],
  linkTel: [
    { required: true, message: "预约手机号为必填项", trigger: "blur" },
    {
      validator: (rule, value, callback) => {
        if (value === "") {
          callback();
        } else if (!isPhone(value)) {
          callback(new Error("请输入正确的手机号码格式"));
        } else {
          callback();
        }
      },
      trigger: "blur"
    }
  ],
  email: [
    {
      validator: (rule, value, callback) => {
        if (value === "") {
          callback();
        } else if (!isEmail(value)) {
          callback(new Error("请输入正确的邮箱格式"));
        } else {
          callback();
        }
      },
      trigger: "blur"
    }
  ],
  productId: [{ required: true, message: "产品为必填项", trigger: "change" }]
});

export function useFormRule(data: any) {
  formData.value = data;
  return formRules;
}

export const ossFormRules = reactive(<FormRules>{
  ossType: [{ required: true, message: "存储类型为必填项", trigger: "change" }],
  ossName: [{ required: true, message: "OSS名称为必填项", trigger: "blur" }],
  endpoint: [{ required: true, message: "endpoint为必填项", trigger: "blur" }],
  accessKey: [
    { required: true, message: "AccessKey为必填项", trigger: "blur" }
  ],
  secretKey: [
    { required: true, message: "SecretKey为必填项", trigger: "blur" }
  ],
  bucketName: [
    { required: true, message: "BucketName为必填项", trigger: "blur" }
  ]
});
