<script setup lang="ts">
import { SearchForm } from "@/components/ReSearchForm";
import { useNotice } from "./utils/hook";
import { PureTableBar } from "@/components/RePureTableBar";
import { useRenderIcon } from "@/components/ReIcon/src/hooks";
import { ref } from "vue";

const tableRef = ref();

const {
  permission,
  searchData,
  tableData,
  pagination,
  handleSearchFrom,
  handleChangeCurrentPage,
  handleChangePageSize,
  onSearch,
  openDialog,
  handleDeleteBatch,
  handleDelete
} = useNotice(tableRef);

defineOptions({
  name: "noticeManager"
});
</script>

<template>
  <div class="main">
    <SearchForm
      :show="searchData.show"
      :data-source="searchData.dataSource"
      :form-items="searchData.formItems"
      :permission="permission.query"
      @search-form="handleSearchFrom"
      @search="onSearch"
    />

    <PureTableBar :columns="tableData.columns" @refresh="onSearch">
      <template #title>
        <div>
          <el-button
            v-auth="permission.add"
            type="primary"
            :icon="useRenderIcon('ri:add-fill')"
            @click="openDialog()"
          >
            新增公告
          </el-button>
          <el-button
            v-auth="permission.delete"
            type="danger"
            :icon="useRenderIcon('ri:delete-bin-fill')"
            @click="handleDeleteBatch"
          >
            删除公告
          </el-button>
        </div>
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
              v-auth="permission.edit"
              class="reset-margin"
              link
              type="primary"
              :size="size"
              :icon="useRenderIcon('ri:edit-fill')"
              @click="openDialog('修改', row)"
            >
              修改
            </el-button>
            <el-popconfirm :title="`是否删除公告: ${row.title}`">
              <template #reference>
                <el-button
                  v-auth="permission.delete"
                  class="reset-margin"
                  link
                  type="primary"
                  :size="size"
                  :icon="useRenderIcon('ri:delete-bin-fill')"
                  @click="handleDelete(row)"
                >
                  删除
                </el-button>
              </template>
            </el-popconfirm>
          </template>
        </pure-table>
      </template>
    </PureTableBar>
  </div>
</template>
