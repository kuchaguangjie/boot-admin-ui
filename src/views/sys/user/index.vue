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
      @refresh="onSearch"
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
            <div class="flex items-center">
              <el-link
                v-auth="permission.update"
                class="reset-margin"
                type="primary"
                :underline="false"
                :size="size"
                :disabled="row.system"
                @click="openDrawer('修改', row)"
              >
                修改 <el-divider direction="vertical" />
              </el-link>
              <el-popconfirm
                :title="`是否删除用户: ${row.username}`"
                :disabled="row.system"
                @confirm="handleDelete(row)"
              >
                <template #reference>
                  <el-link
                    v-auth="permission.delete"
                    class="reset-margin"
                    type="primary"
                    :underline="false"
                    :size="size"
                    :disabled="row.system"
                  >
                    删除 <el-divider direction="vertical" />
                  </el-link>
                </template>
              </el-popconfirm>
              <el-dropdown :disabled="row.admin">
                <el-link
                  :size="size"
                  class="reset-margin"
                  type="primary"
                  :underline="false"
                >
                  更多 <component :is="useRenderIcon('ep:arrow-down-bold')" />
                </el-link>
                <template #dropdown>
                  <el-dropdown-item>
                    <el-link
                      v-auth="permission.resetPwd"
                      type="primary"
                      :size="size"
                      :disabled="row.system"
                      :underline="false"
                      @click="handleRestPwd(row)"
                    >
                      重置密码
                    </el-link>
                  </el-dropdown-item>
                </template>
              </el-dropdown>
            </div>
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
