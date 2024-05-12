<script setup lang="ts">
import { SearchForm } from "@/components/ReSearchForm";
import { useAttachment } from "./utils/hook";
import { PureTableBar } from "@/components/RePureTableBar/index";
import { useRenderIcon } from "@/components/ReIcon/src/hooks";
const {
  permissions,
  searchData,
  tableData,
  pagination,
  onSearch,
  handleSetSearchForm,
  handleChangeCurrentPage,
  handleChangePageSize,
  openDialog,
  handleDelete
} = useAttachment();
</script>

<template>
  <div class="main">
    <SearchForm
      :form-items="searchData.formItems"
      :show="searchData.show"
      @search-form="handleSetSearchForm"
      @search="onSearch"
    />
    <PureTableBar :columns="tableData.columns" @refresh="onSearch()">
      <template #title>
        <div>
          <el-button
            type="primary"
            :icon="useRenderIcon('ep:upload-filled')"
            @click="openDialog"
          >
            上传</el-button
          >
        </div>
      </template>
      <template v-slot="{ size, dynamicColumns }">
        <pure-table
          ref="tableRef"
          align-whole="center"
          showOverflowTooltip
          table-layout="auto"
          :loading="tableData.loading"
          :size="size"
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
          <template #preview="{ row }">
            <template v-if="row.mediaType.includes('image')">
              <el-image
                preview-teleported
                :src="row.permalink"
                fit="cover"
                class="w-[100px] h-[100px]"
              />
            </template>
            <template v-else>
              {{ row.displayName }}
            </template>
          </template>
          <template #link="{ row }">
            <el-link
              type="primary"
              link
              :href="row.permalink"
              :underline="false"
              target="_blank"
            >
              {{ row.displayName }}</el-link
            >
          </template>
          <template #operation="{ row }">
            <el-popconfirm title="确定删除吗？" @confirm="handleDelete(row.id)">
              <template #reference>
                <el-link
                  v-auth="permissions.delete"
                  type="danger"
                  :underline="false"
                  >删除</el-link
                >
              </template>
            </el-popconfirm>
          </template>
        </pure-table>
      </template>
    </PureTableBar>
  </div>
</template>
