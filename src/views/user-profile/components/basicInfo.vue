<script setup lang="ts">
import { onMounted, ref, reactive } from "vue";
import * as userApi from "@/api/common/user";
import type { FormRules } from "element-plus";
import ReSegmented from "@/components/ReSegmented";
import { genderOptions } from "@/utils/constants";
import { message } from "@/utils/message";
const formData = ref<any>({});
const formRef = ref<any>();
const loading = ref(false);

const formRules = reactive<FormRules>({
  nickname: [{ required: true, message: "请输入用户昵称", trigger: "blur" }],
  email: [
    {
      type: "email",
      message: "请输入正确的邮箱地址",
      trigger: ["blur", "change"]
    }
  ],
  phone: [
    { required: true, message: "请输入电话号码", trigger: "blur" },
    {
      pattern: /^1[3456789]\d{9}$/,
      message: "请输入正确的电话号码",
      trigger: ["blur", "change"]
    }
  ]
});

function handleSave() {
  formRef.value.validate(async (valid: boolean) => {
    if (valid) {
      saveProfile();
    }
  });
}

function handlerRest() {
  getUserProfile();
}

async function saveProfile() {
  const body = {
    username: formData.value.username,
    nickname: formData.value.nickname,
    email: formData.value.email,
    phone: formData.value.phone,
    gender: formData.value.gender
  };
  console.log(body);
  loading.value = true;
  const { success } = await userApi.changeUserInfo(body).finally(() => {
    loading.value = false;
  });
  if (success) {
    //更新前端缓存
    message("更新成功", { type: "success" });
  }
}
async function getUserProfile() {
  const { success, data } = await userApi.getCurrentUserInfo();
  if (success) {
    formData.value = data;
  }
}
onMounted(async () => {
  await getUserProfile();
});

defineOptions({
  name: "BasicInfo"
});
</script>

<template>
  <el-form
    ref="formRef"
    v-loading="loading"
    label-position="right"
    :label-width="200"
    :rules="formRules"
    :model="formData"
  >
    <el-form-item label="用户昵称" prop="nickname">
      <el-input v-model="formData.nickname" />
    </el-form-item>
    <el-form-item label="邮箱" prop="email">
      <el-input v-model="formData.email" />
    </el-form-item>
    <el-form-item label="电话号码" prop="phone">
      <el-input v-model="formData.phone" />
    </el-form-item>
    <el-form-item label="性别">
      <ReSegmented
        v-model="formData.gender"
        :options="genderOptions"
        @change="
          ({ option: { value } }) => {
            formData.gender = value;
          }
        "
      />
    </el-form-item>
  </el-form>
  <div class="text-center">
    <el-button type="primary" @click="handleSave">保存</el-button>
    <el-button @click="handlerRest">重置</el-button>
  </div>
</template>
