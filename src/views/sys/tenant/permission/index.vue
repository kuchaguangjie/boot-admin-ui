<script setup lang="ts">
import { SearchForm } from "@/components/ReSearchForm";
import { usePermission } from "./utils/hook";
import { PureTableBar } from "@/components/RePureTableBar";
import { ref } from "vue";
import { useRenderIcon } from "@/components/ReIcon/src/hooks";

const tableRef = ref();

const {
  permission,
  searchData,
  tableData,
  handleSearchFrom,
  onSearch,
  handleGetChild,
  openDrawer,
  handleDeleteMenu
} = usePermission(tableRef);
</script>

<template>
  <div class="main">
    <SearchForm
      :show="searchData.show"
      :form-items="searchData.formItems"
      :permission="permission.query"
      @search-form="handleSearchFrom"
      @search="onSearch"
    />
    <PureTableBar
      :columns="tableData.columns"
      :table-ref="tableRef?.getTableRef()"
      :isExpandAll="false"
      @refresh="onSearch"
    >
      <template #title>
        <el-button
          v-auth="permission.save"
          type="primary"
          :icon="useRenderIcon('ri:add-fill')"
          @click="openDrawer()"
        >
          新增菜单
        </el-button>
      </template>
      <template v-slot="{ size, dynamicColumns }">
        <PureTable
          ref="tableRef"
          :data="tableData.dataList"
          :loading="tableData.loading"
          adaptive
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
            <el-link
              v-auth="permission.update"
              class="reset-margin"
              type="primary"
              :underline="false"
              @click="openDrawer('修改', row)"
            >
              修改 <el-divider direction="vertical" />
            </el-link>
            <el-link
              v-show="row.menuType !== 4"
              v-auth="permission.save"
              class="reset-margin"
              type="primary"
              :underline="false"
              @click="openDrawer('新增', { parentId: row.id })"
            >
              新增 <el-divider direction="vertical" />
            </el-link>

            <el-popconfirm
              :title="`是否确认删除菜单名称为${row.title}的这条数据${row?.children?.length > 0 ? '。注意下级菜单也会一并删除，请谨慎操作' : ''}`"
              @confirm="handleDeleteMenu(row)"
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
        </PureTable>
      </template>
    </PureTableBar>
  </div>
</template>
