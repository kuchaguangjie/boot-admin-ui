<script setup lang="ts">
import { PureTableBar } from "@/components/RePureTableBar";
import { useOrg } from "./utils/hook";
import { SearchForm } from "@/components/ReSearchForm";
import { ref } from "vue";

const tableRef = ref();

const {
  permission,
  searchData,
  tableData,
  handleSetSearchForm,
  onSearch,
  handleGetChild,
  openDrawer,
  deleteOrg
} = useOrg(tableRef);

defineOptions({
  name: "basOrgManager"
});
</script>

<template>
  <div class="main">
    <SearchForm
      :show="searchData.show"
      :form-items="searchData.formItems"
      :data-source="searchData.dataSource"
      @search-form="handleSetSearchForm"
      @search="onSearch"
    />
    <PureTableBar
      :columns="tableData.columns"
      :table-ref="tableRef?.getTableRef()"
      :isExpandAll="false"
      @refresh="onSearch"
    >
      <template v-slot="{ size, dynamicColumns }">
        <PureTable
          ref="tableRef"
          :data="tableData.dataList"
          :loading="tableData.loading"
          adaptive
          border
          :adaptiveConfig="{ offsetBottom: 45 }"
          row-key="id"
          :size="size"
          :columns="dynamicColumns"
          :lazy="true"
          :load="handleGetChild"
          :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
          :header-cell-style="{
            background: 'var(--el-fill-color-light)',
            color: 'var(--el-text-color-primary)'
          }"
        >
          <template #operation="{ row }">
            <el-link
              v-auth="permission.edit"
              class="reset-margin"
              type="primary"
              :size="size"
              :underline="false"
              @click="openDrawer('修改', row)"
            >
              修改
            </el-link>
            <el-link
              v-auth="permission.add"
              class="reset-margin"
              type="primary"
              :size="size"
              :underline="false"
              @click="openDrawer('新增', { parentId: row.id })"
            >
              <el-divider direction="vertical" />
              新增
            </el-link>
            <el-popconfirm
              title="确认删除吗？"
              :disabled="row.system"
              @confirm="deleteOrg(row)"
            >
              <template #reference>
                <el-link
                  class="reset-margin"
                  :disabled="row.system"
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
        </PureTable>
      </template>
    </PureTableBar>
  </div>
</template>

<style lang="scss" scoped>
:deep(.el-button:focus-visible) {
  outline: none;
}
</style>
