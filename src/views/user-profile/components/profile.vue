<script setup lang="ts">
import UserAvatar from "./avatar.vue";
import { useRenderIcon } from "@/components/ReIcon/src/hooks";
import { onMounted, ref } from "vue";
import { getCurrentUserInfo, changeAvatar } from "@/api/common/user";
import { useAuthStoreHook } from "@/store/modules/auth";

const { setUserAvatarAction } = useAuthStoreHook();
const fields = ref([
  {
    icon: "el-icon-user",
    label: "用户名",
    value: "admin"
  },
  {
    icon: "el-icon-phone",
    label: "邮箱",
    value: ""
  }
]);
const userAvatar = ref("");

async function getUserProfile() {
  const { success, data } = await getCurrentUserInfo();
  if (success) {
    userAvatar.value = data.avatar;
    fields.value = [
      {
        icon: "ep:user",
        label: "用户名",
        value: data.username
      },
      {
        icon: "ep:phone",
        label: "电话号码",
        value: data.phone
      },
      {
        icon: "ri:mail-line",
        label: "邮箱",
        value: data.email
      },
      {
        icon: "ri:node-tree",
        label: "所属部门",
        value: data?.org?.name ?? ""
      },
      {
        icon: "ep:suitcase",
        label: "所属岗位",
        value: data?.posts?.map((post: any) => post.name).join(", ") ?? ""
      },
      {
        icon: "ri:user-forbid-line",
        label: "角色",
        value: data?.roles?.map((role: any) => role.name).join(", ") ?? ""
      },
      {
        icon: "ep:calendar",
        label: "创建时间",
        value: data.created
      }
    ];
  }
}

function handleAvatarChange(avatar: string) {
  changeAvatar(avatar).then(() => {
    userAvatar.value = avatar;
    setUserAvatarAction(avatar);
  });
}
onMounted(() => {
  getUserProfile();
});
</script>

<template>
  <div>
    <div class="text-center">
      <UserAvatar
        v-model="userAvatar"
        @update:model-value="handleAvatarChange"
      />
    </div>
    <ul class="list-group list-group-striped">
      <li v-for="field in fields" :key="field.label" class="list-group-item">
        <div class="flex items-center">
          <i class="mr-2">
            <component :is="useRenderIcon(field.icon)" />
          </i>
          {{ field.label }}
        </div>
        <div class="pull-right">{{ field.value }}</div>
      </li>
    </ul>
  </div>
</template>

<style lang="scss" scoped>
.text-center {
  position: relative;
  height: 120px;
  text-align: center;
}

.list-group-striped > .list-group-item {
  padding-right: 0;
  padding-left: 0;
  border-right: 0;
  border-left: 0;
  border-radius: 0;
}

.list-group {
  padding-left: 0;
  margin-top: 10px;
  list-style: none;
}

.list-group-item {
  display: flex;
  justify-content: space-between;
  padding: 11px 0;
  margin-bottom: -1px;
  font-size: 13px;
  border-top: 1px solid #e7eaec;
  border-bottom: 1px solid #e7eaec;
}

.pull-right {
  float: right !important;
}
</style>
