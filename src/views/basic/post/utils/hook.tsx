import type { SearchFormItems } from "@/components/ReSearchForm/src/types";
import type { OptionsType } from "@/components/ReSegmented";
import { enabledOptions, usePublicHooks } from "@/utils/constants";
import type { PaginationProps } from "@pureadmin/table";
import { h, onMounted, reactive, ref } from "vue";
import * as postApi from "@/api/basic/post";
import type { FormItemProps } from "./types";
import { addDialog } from "@/components/ReDialog";
import editForm from "../form.vue";
import { message } from "@/utils/message";
import { ElMessageBox } from "element-plus";

export function usePost() {
  const switchLoadMap = ref({});
  const { switchStyle } = usePublicHooks();
  const formRef = ref();

  const permissions = reactive({
    query: ["bas:post:page"],
    save: ["bas:post:save"],
    edit: ["bas:post:update"],
    delete: ["bas:post:delete"]
  });

  const searchData = reactive<{
    show: boolean;
    formItems: SearchFormItems;
    dataSource: {
      enabledOptions: OptionsType[];
    };
    data: any;
  }>({
    show: true,
    data: {},
    formItems: [
      {
        type: "input",
        label: "岗位编码",
        options: {
          prop: "code",
          placeholder: "请输入岗位编码",
          clearable: true
        }
      },
      {
        type: "input",
        label: "岗位名称",
        options: {
          prop: "name",
          placeholder: "请输入岗位名称",
          clearable: true
        }
      },
      {
        type: "select",
        label: "状态",
        options: {
          prop: "enabled",
          placeholder: "请选择状态",
          clearable: true,
          dataSourceKey: "enabledOptions",
          selectOptionKey: {
            label: "label",
            value: "value",
            prop: "value"
          }
        }
      }
    ],
    dataSource: {
      enabledOptions: enabledOptions
    }
  });

  const pagination = reactive<PaginationProps>({
    total: 0,
    pageSize: 10,
    currentPage: 1,
    background: true
  });

  const tableData = reactive<{
    loading: boolean;
    dataList: Array<any>;
    columns: TableColumnList;
  }>({
    loading: false,
    dataList: [],
    columns: [
      {
        label: "岗位编码",
        prop: "code"
      },
      {
        label: "岗位名称",
        prop: "name"
      },
      {
        label: "状态",
        prop: "enabled",
        cellRenderer: scope => (
          <el-switch
            size={scope.props.size === "small" ? "small" : "default"}
            loading={switchLoadMap.value[scope.index]?.loading}
            v-model={scope.row.enabled}
            active-value={true}
            inactive-value={false}
            active-text="已启用"
            inactive-text="已停用"
            inline-prompt
            style={switchStyle.value}
            onChange={() => onChangeEnabled(scope as any)}
            disabled={scope.row.system}
          />
        )
      },
      {
        label: "描述",
        prop: "description"
      },
      {
        label: "创建时间",
        prop: "created"
      },
      {
        label: "操作",
        fixed: "right",
        slot: "operation"
      }
    ]
  });

  function onChangeEnabled({ row, index }) {
    ElMessageBox.confirm(
      `确认要<strong>${
        row.enabled ? "启用" : "停用"
      }</strong><strong style='color:var(--el-color-primary)'>${
        row.name
      }</strong>吗?`,
      "系统提示",
      {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
        dangerouslyUseHTMLString: true,
        draggable: true
      }
    )
      .then(async () => {
        switchLoadMap.value[index] = Object.assign(
          {},
          switchLoadMap.value[index],
          {
            loading: true
          }
        );
        row.enabled = !row.enabled ? false : true;
        const { success } = await postApi.postUpdate(row);
        if (success) {
          switchLoadMap.value[index] = Object.assign(
            {},
            switchLoadMap.value[index],
            {
              loading: false
            }
          );
          message(`已${row.enabled ? "启用" : "停用"}${row.name}`, {
            type: "success"
          });
          onSearch();
        }
      })
      .catch(() => {
        row.enabled = row.enabled ? false : true;
      });
  }

  function openDialog(title = "新增", data?: FormItemProps) {
    addDialog({
      title: `${title}岗位`,
      props: {
        formInline: {
          id: data?.id ?? null,
          code: data?.code ?? "",
          name: data?.name ?? "",
          enabled: data?.enabled ?? true,
          description: data?.description ?? "",
          sort: data?.sort ?? 0
        }
      },
      width: "40%",
      draggable: true,
      fullscreenIcon: true,
      closeOnClickModal: false,
      contentRenderer: () => h(editForm, { ref: formRef }),
      beforeSure: (done, { options }) => {
        const FormRef = formRef.value.getRef();
        const curData = options.props.formInline as FormItemProps;
        function chores() {
          message(`保存成功`, {
            type: "success"
          });
          done(); // 关闭弹框
          onSearch(); // 刷新表格数据
        }
        FormRef.validate(async valid => {
          if (valid) {
            if (curData.id) {
              const { success } = await postApi.postUpdate(curData);
              if (success) {
                chores();
              }
            } else {
              const { success } = await postApi.postSave(curData);
              if (success) {
                chores();
              }
            }
          }
        });
      }
    });
  }

  function handleSetSearchForm(data?: any) {
    searchData.data = data;
  }
  function handleChangeCurrentPage(val: number) {
    pagination.currentPage = val;
    onSearch();
  }
  function handleChangePageSize(val: number) {
    pagination.pageSize = val;
    onSearch();
  }
  async function handleDelete(id: string) {
    tableData.loading = true;
    const { success } = await postApi.postDelete(id).finally(() => {
      tableData.loading = false;
    });
    if (success) {
      message("删除成功", {
        type: "success"
      });
      onSearch();
    }
  }

  async function onSearch() {
    tableData.loading = true;
    const params = {
      ...searchData.data,
      current: pagination.currentPage,
      size: pagination.pageSize,
      sorts: "sort desc"
    };
    const { success, data } = await postApi.postPage(params).finally(() => {
      tableData.loading = false;
    });
    if (success) {
      tableData.dataList = data.records;
      pagination.total = data.total;
    }
  }

  onMounted(() => {
    onSearch();
  });

  return {
    permissions,
    searchData,
    pagination,
    tableData,
    handleSetSearchForm,
    handleChangeCurrentPage,
    handleChangePageSize,
    onSearch,
    openDialog,
    handleDelete
  };
}
