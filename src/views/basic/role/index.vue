<script setup lang="ts">
import { useRole } from "./utils/hook";
import { ref } from "vue";
import { useRenderIcon } from "@/components/ReIcon/src/hooks";
import { PureTableBar } from "@/components/RePureTableBar";
import { SearchForm } from "@/components/ReSearchForm";
const {
  searchData,
  pagination,
  tableData,
  permission,
  openDialog,
  handleSetSearchForm,
  onSearch,
  handleChangeCurrentPage,
  handleChangePageSize,
  handleDeleteRole,
  openPermission
} = useRole();

const tableRef = ref();

defineOptions({
  name: "RoleManager"
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
      @refresh="onSearch()"
    >
      <template #title>
        <el-button
          v-auth="permission.save"
          type="primary"
          :icon="useRenderIcon('ri:add-fill')"
          @click="() => openDialog()"
        >
          新增菜单
        </el-button>
      </template>
      <template v-slot="{ size, dynamicColumns }">
        <pure-table
          ref="tableRef"
          align-whole="center"
          showOverflowTooltip
          table-layout="auto"
          :loading="tableData.loading"
          :size="size"
          adaptive
          border
          :adaptiveConfig="{ offsetBottom: 108 }"
          :data="tableData.dataList"
          :columns="dynamicColumns"
          :paginationSmall="size === 'small' ? true : false"
          :header-cell-style="{
            background: 'var(--el-fill-color-light)',
            color: 'var(--el-text-color-primary)'
          }"
          :pagination="pagination"
          @page-current-change="handleChangeCurrentPage"
          @page-size-change="handleChangePageSize"
        >
          <template #operation="{ row }">
            <el-link
              v-auth="permission.edit"
              class="reset-margin"
              type="primary"
              :size="size"
              :underline="false"
              :disabled="row.system"
              @click="openDialog('修改', row)"
            >
              修改
            </el-link>
            <el-link
              v-auth="permission.grantPermission"
              class="reset-margin"
              type="primary"
              :size="size"
              :underline="false"
              :disabled="row.system"
              @click="openPermission(row)"
            >
              <el-divider direction="vertical" />
              赋权
            </el-link>

            <el-popconfirm
              :title="`是否删除角色: 【${row.name}】?`"
              :disabled="row.system"
              @confirm="handleDeleteRole(row)"
            >
              <template #reference>
                <el-link
                  v-auth="permission.delete"
                  class="reset-margin"
                  type="danger"
                  :size="size"
                  :disabled="row.system"
                  :underline="false"
                >
                  <el-divider direction="vertical" />
                  删除
                </el-link>
              </template>
            </el-popconfirm>
          </template>
        </pure-table>
      </template>
    </PureTableBar>
  </div>
</template>
