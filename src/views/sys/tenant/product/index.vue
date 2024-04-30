<script setup lang="ts">
import { PureTableBar } from "@/components/RePureTableBar";
import { useProduct } from "./utils/hook";
import { SearchForm } from "@/components/ReSearchForm";
import { useRenderIcon } from "@/components/ReIcon/src/hooks";
import { ref } from "vue";

const {
  searchData,
  permission,
  tableData,
  pagination,
  gotoPermission,
  handleSetSearchForm,
  handleChangeCurrentPage,
  handleChangePageSize,
  onSearch,
  openDialog,
  openDrawer,
  deleteProduct
} = useProduct();

const tableRef = ref();

defineOptions({
  name: "TenantProductManager"
});
</script>

<template>
  <div class="main">
    <SearchForm
      :show="searchData.show"
      :form-items="searchData.formItems"
      :data-source="searchData.dataSource"
      :permission="permission.query"
      @search="onSearch"
      @search-form="handleSetSearchForm"
    />
    <PureTableBar
      :columns="tableData.columns"
      :table-ref="tableRef?.getTableRef()"
      @refresh="onSearch"
    >
      <template #title>
        <div>
          <el-button
            v-auth="permission.save"
            type="primary"
            :icon="useRenderIcon('ri:add-fill')"
            @click="openDialog()"
          >
            新增产品
          </el-button>
          <el-button
            v-auth="permission.permission"
            type="primary"
            :icon="useRenderIcon('ep:menu')"
            @click="gotoPermission"
          >
            维护权限
          </el-button>
        </div>
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
            <el-link
              v-auth="permission.update"
              type="primary"
              :underline="false"
              @click="openDialog('修改', row)"
            >
              编辑 <el-divider direction="vertical" />
            </el-link>
            <el-link
              v-auth="permission.grant"
              type="primary"
              :underline="false"
              @click="openDrawer(row)"
            >
              授权 <el-divider direction="vertical" />
            </el-link>
            <el-popconfirm
              :title="`是否删除产品:【${row.name}】`"
              @confirm="deleteProduct(row.id)"
            >
              <template #reference>
                <el-link
                  v-auth="permission.delete"
                  type="primary"
                  :underline="false"
                >
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
