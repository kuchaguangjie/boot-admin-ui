<script setup lang="ts">
import { ref } from "vue";
import { BasicInfo, RestPasswd, UserProfile } from "./components";
import type { TabsPaneContext } from "element-plus";

const activeName = ref("username");

const handleTabClick = (tab: TabsPaneContext, event: Event) => {
  activeName.value = tab.paneName as string;
};

defineOptions({
  name: "UserProfileSettings"
});
</script>

<template>
  <div class="flex">
    <el-card class="user w-1/3" shadow="hover">
      <template #header>
        <div class="card-header">
          <span>个人信息</span>
        </div>
      </template>
      <UserProfile />
    </el-card>
    <el-card class="user ml-3 w-2/3" shadow="hover">
      <template #header>
        <div class="card-header">
          <span>账户设置</span>
        </div>
      </template>
      <div>
        <el-tabs
          v-model="activeName"
          class="profiles-tabs"
          tab-position="top"
          @tab-click="handleTabClick"
        >
          <el-tab-pane label="基本信息" name="username">
            <BasicInfo />
          </el-tab-pane>
          <el-tab-pane label="密码设置" name="password">
            <RestPasswd />
          </el-tab-pane>
        </el-tabs>
      </div>
    </el-card>
  </div>
</template>

<style lang="scss" scoped>
.user {
  max-height: 960px;
  padding: 15px 20px 20px;
}

.card-header {
  display: flex;
  align-items: center;
  justify-content: center;
}

::v-deep(el-card .el-card__header, .el-card .el-card__body) {
  padding: 15px !important;
}
</style>
