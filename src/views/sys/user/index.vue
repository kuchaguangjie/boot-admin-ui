<script setup lang="ts">
import { useUser } from "./utils/hook";

import { PureTableBar } from "@/components/RePureTableBar";
import { ref } from "vue";
import { useRenderIcon } from "@/components/ReIcon/src/hooks";
import { SearchForm } from "@/components/ReSearchForm";

const {
  permission,
  searchData,
  tableData,
  pagination,
  buttonClass,
  handleRestPwd,
  openDrawer,
  handleSetSearchForm,
  handleChangeCurrentPage,
  handleChangePageSize,
  handleDelete,
  onSearch
} = useUser();

const tableRef = ref();

defineOptions({
  name: ""
});
</script>

<template>
  <div class="main">
    <SearchForm
      :show="searchData.show"
      :form-items="searchData.formItems"
      :data-source="searchData.dataSource"
      :permission="permission.query"
      @search-form="handleSetSearchForm"
      @search="onSearch"
    />
    <PureTableBar
      :columns="tableData.columns"
      :table-ref="tableRef?.getTableRef()"
    >
      <template #title>
        <el-button
          v-auth="permission.save"
          type="primary"
          :icon="useRenderIcon('ri:add-fill')"
          @click="openDrawer()"
        >
          新增用户
        </el-button>
      </template>

      <template v-slot="{ size, dynamicColumns }">
        <pure-table
          ref="tableRef"
          row-key="id"
          adaptive
          :adaptiveConfig="{ offsetBottom: 108 }"
          align-whole="center"
          table-layout="auto"
          :loading="tableData.loading"
          :size="size"
          :data="tableData.dataList"
          :columns="dynamicColumns"
          :pagination="pagination"
          :paginationSmall="size === 'small' ? true : false"
          :header-cell-style="{
            background: 'var(--el-fill-color-light)',
            color: 'var(--el-text-color-primary)'
          }"
          @page-current-change="handleChangeCurrentPage"
          @page-size-change="handleChangePageSize"
        >
          <template #operation="{ row }">
            <el-button
              v-auth="permission.update"
              class="reset-margin"
              link
              type="primary"
              :size="size"
              :icon="useRenderIcon('ri:edit-fill')"
              :disabled="row.system"
              @click="openDrawer('修改', row)"
            >
              修改
            </el-button>
            <el-popconfirm
              :title="`是否删除用户: ${row.username}`"
              @confirm="handleDelete(row)"
            >
              <template #reference>
                <el-button
                  v-auth="permission.delete"
                  class="reset-margin"
                  link
                  type="primary"
                  :size="size"
                  :icon="useRenderIcon('ri:delete-bin-fill')"
                  :disabled="row.system"
                >
                  删除
                </el-button>
              </template>
            </el-popconfirm>
            <el-dropdown :disabled="row.admin">
              <el-button
                class="ml-3 mt-[2px]"
                link
                type="primary"
                :size="size"
                :icon="useRenderIcon('ri:more-fill')"
              />
              <template #dropdown>
                <el-dropdown-item>
                  <el-button
                    v-auth="permission.resetPwd"
                    :class="buttonClass"
                    link
                    type="primary"
                    :size="size"
                    :icon="useRenderIcon('ri:lock-password-fill')"
                    :disabled="row.system"
                    @click="handleRestPwd(row)"
                  >
                    重置密码
                  </el-button>
                </el-dropdown-item>
              </template>
            </el-dropdown>
          </template>
        </pure-table>
      </template>
    </PureTableBar>
  </div>
</template>

<style lang="scss" scoped>
:deep(.el-dropdown-menu__item i) {
  margin: 0;
}

:deep(.el-button:focus-visible) {
  outline: none;
}

.main-content {
  margin: 24px 24px 0 !important;
}

.search-form {
  :deep(.el-form-item) {
    margin-bottom: 12px;
  }
}
</style>
