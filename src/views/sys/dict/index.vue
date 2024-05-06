<script setup lang="ts">
import searchForm from "@/components/ReSearchForm/src/searchForm";
import { useDict } from "./utils/hook";
import { PureTableBar } from "@/components/RePureTableBar";
import { useRenderIcon } from "@/components/ReIcon/src/hooks";

const {
  permissions,
  searchData,
  tableData,
  pagination,
  handleSetSearchForm,
  onSearch,
  handleChangeCurrentPage,
  handleChangePageSize,
  openDrawer,
  handleDelete
} = useDict();
</script>

<template>
  <div class="main">
    <searchForm
      :show="searchData.show"
      :permission="permissions.query"
      :data-source="searchData.dataSource"
      :form-items="searchData.formItems"
      @search-form="handleSetSearchForm"
      @search="onSearch"
    />
    <PureTableBar :columns="tableData.columns" @refresh="onSearch">
      <template #title>
        <el-button
          v-auth="permissions.add"
          type="primary"
          :icon="useRenderIcon('ri:add-fill')"
          @click="openDrawer('新增字典')"
        >
          新增字典
        </el-button>
      </template>
      <template v-slot="{ size, dynamicColumns }">
        <PureTable
          ref="tableRef"
          row-key="id"
          border
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
            <div class="flex justify-center items-center">
              <el-link
                v-auth="permissions.edit"
                class="reset-margin"
                type="primary"
                :underline="false"
                @click="openDrawer('修改', row)"
              >
                修改 <el-divider direction="vertical" />
              </el-link>
              <el-popconfirm title="确定删除吗？" @confirm="handleDelete(row)">
                <template #reference>
                  <el-link
                    v-auth="permissions.delete"
                    class="reset-margin"
                    type="danger"
                    :underline="false"
                    >删除 <el-divider direction="vertical" />
                  </el-link>
                </template>
              </el-popconfirm>
            </div>
          </template>
        </PureTable>
      </template>
    </PureTableBar>
  </div>
</template>
