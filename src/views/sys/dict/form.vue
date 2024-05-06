<script setup lang="ts">
import { ref } from "vue";
import { FormDictProps, FormItemDictProps } from "./utils/types";
import { dictFormRules } from "./utils/rules";
import ReCol from "@/components/ReCol";
import Segmented from "@/components/ReSegmented";
import { enabledOptions } from "@/utils/constants";
import { PureTableBar } from "@/components/RePureTableBar/index";

import { useDictItem } from "./utils/itemHook";
import { useRenderIcon } from "@/components/ReIcon/src/hooks";

const props = withDefaults(defineProps<FormDictProps>(), {
  formInline: () => ({
    id: undefined,
    name: "",
    type: "",
    description: "",
    enabled: true
  })
});

const ruleFormRef = ref();
const newFormInline = ref(props.formInline);

const refreshInfo = (data: FormItemDictProps) => {
  newFormInline.value = data;
};
const getFormInfo = () => {
  return newFormInline.value;
};
const {
  permissions,
  tableData,
  pagination,
  handleChangeCurrentPage,
  handleChangePageSize,
  handleAdd,
  handleEdit,
  handleDelete
} = useDictItem(newFormInline.value);
function getRef() {
  return ruleFormRef.value;
}
defineExpose({ getRef, refreshInfo, getFormInfo });
</script>

<template>
  <div>
    <el-form
      ref="ruleFormRef"
      :model="newFormInline"
      label-width="82px"
      :rules="dictFormRules"
    >
      <el-row :gutter="30">
        <re-col :value="12" :xs="24" :sm="24">
          <el-form-item label="字典名称" prop="name">
            <el-input
              v-model="newFormInline.name"
              clearable
              placeholder="请输入字典名称"
            />
          </el-form-item>
        </re-col>
        <re-col :value="12" :xs="24" :sm="24">
          <el-form-item label="字典类型" prop="type">
            <el-input
              v-model="newFormInline.type"
              clearable
              placeholder="请输入字典类型"
              :disabled="!!newFormInline.id"
            />
          </el-form-item>
        </re-col>
        <re-col :value="12" :xs="24" :sm="24">
          <el-form-item label="描述" prop="description">
            <el-input
              v-model="newFormInline.description"
              clearable
              placeholder="请输入描述"
            />
          </el-form-item>
        </re-col>
        <re-col :value="12" :xs="24" :sm="24">
          <el-form-item label="状态" prop="enabled">
            <Segmented
              v-model="newFormInline.enabled"
              :options="enabledOptions"
              @change="
                ({ option: { value } }) => {
                  newFormInline.enabled = value;
                }
              "
            />
          </el-form-item>
        </re-col>
      </el-row>
    </el-form>

    <PureTableBar :columns="tableData.columns">
      <template #title>
        <div>
          <el-button
            v-auth="permissions.add"
            type="primary"
            :icon="useRenderIcon('ri:add-fill')"
            @click="handleAdd(newFormInline)"
            >新增字典项</el-button
          >
          <el-button type="primary" :icon="useRenderIcon('ri:import-fill')"
            >导入</el-button
          >
          <el-button type="primary" :icon="useRenderIcon('ri:export-fill')"
            >导出</el-button
          >
          <el-link
            type="primary"
            :icon="useRenderIcon('ri:download-fill')"
            :underline="false"
            class="ml-2"
            >模板下载</el-link
          >
        </div>
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
                @click="handleEdit(row, newFormInline)"
              >
                修改 <el-divider direction="vertical" />
              </el-link>
              <el-popconfirm title="确认删除吗？" @confirm="handleDelete(row)">
                <template #reference>
                  <el-link
                    v-auth="permissions.delete"
                    class="reset-margin"
                    type="danger"
                    :underline="false"
                  >
                    删除 <el-divider direction="vertical" />
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
