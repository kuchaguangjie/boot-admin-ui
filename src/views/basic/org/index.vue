<script setup lang="ts">
import { PureTableBar } from "@/components/RePureTableBar";
import { useOrg } from "./utils/hook";
import { SearchForm } from "@/components/ReSearchForm";
import { ref } from "vue";
import { useRenderIcon } from "@/components/ReIcon/src/hooks";

const tableRef = ref();

const {
  permission,
  searchData,
  tableData,
  handleSetSearchForm,
  onSearch,
  handleGetChild,
  openDrawer
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
          align-whole="center"
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
            <el-button
              v-auth="permission.edit"
              class="reset-margin"
              link
              type="primary"
              :size="size"
              :icon="useRenderIcon('ri:edit-fill')"
              @click="openDrawer('修改', row)"
            >
              修改
            </el-button>
            <el-button
              v-auth="permission.add"
              class="reset-margin"
              link
              type="primary"
              :size="size"
              :icon="useRenderIcon('ri:add-circle-fill')"
              @click="openDrawer('新增', { parentId: row.id })"
            >
              新增
            </el-button>
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
