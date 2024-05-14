<script setup lang="ts">
import { reactive, ref, watch } from "vue";
import { zxcvbn } from "@zxcvbn-ts/core";
import { isAllEmpty } from "@pureadmin/utils";
import type { FormRules } from "element-plus";
import * as userApi from "@/api/common/user";
import { message } from "@/utils/message";
import { RSA } from "@/utils/crypto";

const formRef = ref();
const loading = ref(false);
const formRules = reactive<FormRules>({
  oldPassword: [{ required: true, message: "请输入原密码", trigger: "blur" }],
  newPassword: [
    { required: true, message: "请输入新密码", trigger: "blur" },
    { min: 6, message: "密码长度不能小于6位", trigger: "blur" }
  ],
  confirmPassword: [
    { required: true, message: "请再次输入新密码", trigger: "blur" },
    { min: 6, message: "密码长度不能小于6位", trigger: "blur" },
    {
      validator: (rule, value, callback) => {
        if (value !== password.newPassword) {
          callback(new Error("两次输入密码不一致"));
        } else {
          callback();
        }
      },
      trigger: "blur"
    }
  ]
});

// 当前密码强度（0-4）
const curScore = ref();
const pwdProgress = [
  { color: "#e74242", text: "非常弱" },
  { color: "#EFBD47", text: "弱" },
  { color: "#ffa500", text: "一般" },
  { color: "#1bbf1b", text: "强" },
  { color: "#008000", text: "非常强" }
];
const password = reactive({
  oldPassword: "",
  newPassword: "",
  confirmPassword: ""
});

watch(
  () => password.newPassword,
  (newVal: string) => {
    curScore.value = isAllEmpty(newVal) ? -1 : zxcvbn(newVal).score;
  }
);

function handleRest() {
  password.oldPassword = "";
  password.newPassword = "";
  password.confirmPassword = "";
}

function handleSave() {
  formRef.value.validate(valid => {
    if (valid) {
      changePassword();
    }
  });
}

async function changePassword() {
  const body = {
    oldPassword: password.oldPassword,
    newPassword: password.newPassword
  };
  console.log(body);
  loading.value = true;
  const { success } = await userApi.changePassword(body).finally(() => {
    loading.value = false;
  });
  if (success) {
    message("密码修改成功,下次登录生效", { type: "success" });
    handleRest();
  }
}

defineOptions({
  name: "RestPasswd"
});
</script>

<template>
  <el-form
    ref="formRef"
    :label-width="200"
    :rules="formRules"
    :model="password"
  >
    <el-form-item label="原密码" prop="oldPassword">
      <el-input v-model="password.oldPassword" type="password" show-password />
    </el-form-item>
    <el-form-item label="新密码" prop="newPassword">
      <el-input v-model="password.newPassword" type="password" show-password />
      <div class="mt-4 flex w-full">
        <div
          v-for="(item, idx) in pwdProgress"
          :key="idx"
          class="w-1/4"
          :style="{ 'margin-left': idx !== 0 ? '4px' : '' }"
        >
          <el-progress
            striped
            striped-flow
            :duration="curScore === idx ? 6 : 0"
            :percentage="curScore >= idx ? 100 : 0"
            :color="item.color"
            :stroke-width="10"
            :show-text="false"
          />
        </div>
      </div>
    </el-form-item>
    <el-form-item label="确认密码" prop="confirmPassword">
      <el-input
        v-model="password.confirmPassword"
        type="password"
        show-password
      />
    </el-form-item>
  </el-form>
  <div class="text-center">
    <el-button v-loading="loading" type="primary" @click="handleSave"
      >保存</el-button
    >
    <el-button @click="handleRest">重置</el-button>
  </div>
</template>
