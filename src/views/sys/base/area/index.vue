<script setup lang="ts">
import { useArea } from "./utils/hook";
import { SearchForm } from "@/components/ReSearchForm";
import { PureTableBar } from "@/components/RePureTableBar";
import { ref } from "vue";
import { useRenderIcon } from "@/components/ReIcon/src/hooks";

const tableRef = ref();

const {
  permissions,
  searchData,
  tableData,
  handleSetSearchForm,
  onSearch,
  handleGetChild,
  handleDelete,
  openDialog
} = useArea(tableRef);
</script>

<template>
  <div class="main">
    <SearchForm
      :permission="permissions.query"
      :form-items="searchData.formItems"
      :data-source="searchData.dataSource"
      :show="searchData.show"
      @search-form="handleSetSearchForm"
      @search="onSearch"
    />

    <PureTableBar
      :columns="tableData.columns"
      :table-ref="tableRef?.getTableRef()"
      :isExpandAll="false"
    >
      <template #title>
        <div>
          <el-button
            v-auth="permissions.add"
            type="primary"
            :icon="useRenderIcon('ep:plus')"
            @click="openDialog('新增')"
            >新增
          </el-button>
        </div>
      </template>
      <template v-slot="{ size, dynamicColumns }">
        <PureTable
          ref="tableRef"
          :data="tableData.dataList"
          :loading="tableData.loading"
          border
          stripe
          row-key="id"
          :size="size"
          :columns="dynamicColumns"
          :lazy="true"
          :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
          :load="handleGetChild"
        >
          <template #operation="{ row }">
            <el-link
              v-auth="permissions.edit"
              class="reset-margin"
              link
              type="primary"
              :size="size"
              :underline="false"
              @click="openDialog('修改', row)"
              >编辑 <el-divider direction="vertical" />
            </el-link>
            <el-link
              v-auth="permissions.add"
              class="reset-margin"
              link
              type="success"
              :size="size"
              :underline="false"
              @click="openDialog('新增', { parentId: row.id })"
              >新增 <el-divider direction="vertical" />
            </el-link>
            <el-popconfirm title="确定删除吗？" @confirm="handleDelete(row)">
              <template #reference>
                <el-link
                  v-auth="permissions.delete"
                  class="reset-margin"
                  link
                  type="danger"
                  :size="size"
                  :underline="false"
                  >删除
                </el-link>
              </template>
            </el-popconfirm>
          </template>
        </PureTable>
      </template>
    </PureTableBar>
  </div>
</template>
