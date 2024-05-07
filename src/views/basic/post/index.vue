<script setup lang="ts">
import { SearchForm } from "@/components/ReSearchForm";
import { usePost } from "./utils/hook";
import { PureTableBar } from "@/components/RePureTableBar";
import { useRenderIcon } from "@/components/ReIcon/src/hooks";

const {
  permissions,
  searchData,
  pagination,
  tableData,
  handleSetSearchForm,
  handleChangeCurrentPage,
  handleChangePageSize,
  onSearch,
  openDialog,
  handleDelete
} = usePost();
</script>

<template>
  <div class="main">
    <SearchForm
      :show="searchData.show"
      :permission="permissions.query"
      :data-source="searchData.dataSource"
      :form-items="searchData.formItems"
      @search-form="handleSetSearchForm"
      @search="onSearch"
    />
    <PureTableBar :columns="tableData.columns">
      <template #title>
        <el-button
          v-auth="permissions.save"
          type="primary"
          :icon="useRenderIcon('ri:add-fill')"
          @click="openDialog('新增')"
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
              v-auth="permissions.edit"
              class="reset-margin"
              type="primary"
              :size="size"
              :underline="false"
              @click="openDialog('编辑', row)"
            >
              修改
            </el-link>

            <el-popconfirm
              :title="`是否删除${row.name}岗位？`"
              @confirm="handleDelete(row.id)"
            >
              <template #reference>
                <el-link
                  v-auth="permissions.delete"
                  class="reset-margin"
                  type="danger"
                  :size="size"
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
