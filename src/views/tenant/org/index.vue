<script setup lang="ts">
import { SearchForm } from "@/components/ReSearchForm";
import { useOrg } from "./utils/hook";
import { PureTableBar } from "@/components/RePureTableBar";
import { ref } from "vue";
import { useRenderIcon } from "@/components/ReIcon/src/hooks";

const {
  permission,
  searchData,
  tableData,
  pagination,
  handleSetSearchForm,
  handleChangeCurrentPage,
  handleChangePageSize,
  onSearch,
  openDrawer,
  openConfigDrawer,
  handleRestPwd
} = useOrg();
const tableRef = ref();

defineOptions({
  name: "TenantOrgManager"
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
              <el-button
                v-auth="permission.update"
                class="reset-margin"
                link
                type="primary"
                :size="size"
                :icon="useRenderIcon('ri:edit-fill')"
                @click="openDrawer('修改', row)"
              >
                修改
              </el-button>
              <!--更多-->
              <el-dropdown trigger="click">
                <el-button
                  class="reset-margin"
                  link
                  type="primary"
                  :size="size"
                  :icon="useRenderIcon('ep:arrow-down-bold')"
                  >更多</el-button
                >
                <template #dropdown>
                  <el-dropdown-item>
                    <el-button link :size="size" @click="openConfigDrawer(row)">
                      其他配置
                    </el-button>
                  </el-dropdown-item>
                  <el-dropdown-item>
                    <el-button link :size="size" @click="handleRestPwd(row)">
                      重置密码
                    </el-button>
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
</style>
