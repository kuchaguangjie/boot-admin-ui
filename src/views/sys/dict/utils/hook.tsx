import type { SearchFormItems } from "@/components/ReSearchForm/src/types";
import type { OptionsType } from "@/components/ReSegmented";
import { enabledOptions, usePublicHooks } from "@/utils/constants";
import type { PaginationProps } from "@pureadmin/table";
import { h, onMounted, reactive, ref } from "vue";
import * as dictApi from "@/api/sys/dict";
import type { FormItemDictProps } from "./types";
import { addDrawer, closeDrawer } from "@/components/ReDrawer";
import editForm from "../form.vue";
import { isFunction } from "@pureadmin/utils";
import { message } from "@/utils/message";
import { ElMessageBox } from "element-plus";

export function useDict() {
  const switchLoadMap = ref({});
  const { switchStyle } = usePublicHooks();

  const formRef = ref();

  const permissions = reactive({
    query: ["sys:dict:query"],
    add: ["sys:dict:save"],
    edit: ["sys:dict:update"],
    delete: ["sys:dict:delete"]
  });
  const searchData = reactive<{
    show: boolean;
    data: any;
    formItems: SearchFormItems;
    dataSource: {
      enabledOptions: OptionsType[];
    };
  }>({
    show: true,
    data: {},
    formItems: [
      {
        label: "字典名称",
        type: "input",
        options: {
          prop: "name",
          placeholder: "请输入字典名称"
        }
      },
      {
        label: "字典类型",
        type: "input",
        options: {
          prop: "type",
          placeholder: "请输入字典类型"
        }
      },
      {
        label: "状态",
        type: "select",
        options: {
          prop: "enabled",
          clearable: true,
          placeholder: "请选择状态",
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
        label: "字典名称",
        prop: "name"
      },
      {
        label: "字典类型",
        prop: "type"
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
          />
        )
      },
      {
        label: "创建时间",
        prop: "created"
      },
      {
        label: "操作",
        prop: "action",
        fixed: "right",
        slot: "operation"
      }
    ]
  });

  async function openDrawer(title = "新增", row?: FormItemDictProps) {
    addDrawer({
      props: {
        formInline: {
          id: row?.id || undefined,
          type: row?.type || "",
          name: row?.name || "",
          enabled: row?.enabled || true,
          description: row?.description || ""
        }
      },
      title: `${title}字典`,
      width: "50%",
      fullscreenIcon: true,
      closeOnClickModal: false,
      footerButtons: [
        {
          label: "暂存",
          type: "primary",
          bg: true,
          btnClick: ({ drawer: { options } }) => {
            // const done = () => closeDrawer(options, index, { command: "save" });
            const FormRef = formRef.value.getRef();
            const info = formRef.value.getFormInfo();
            const curData = options.props.formInline;
            function chores() {
              message(`保存成功`, {
                type: "success"
              });
              // done(); // 关闭弹框
              onSearch(); // 刷新表格数据
            }
            FormRef.validate(async valid => {
              if (valid) {
                const body = {
                  ...curData
                };
                if (info.id) {
                  body.id = info.id;
                }
                if (info.id) {
                  const { success } = await dictApi.updateDict(body);
                  if (success) {
                    formRef.value.refreshInfo({
                      ...curData
                    });
                    chores();
                  }
                } else {
                  const { success, data } = await dictApi.saveDict(body);
                  if (success) {
                    formRef.value.refreshInfo({
                      ...curData,
                      id: data
                    });
                    chores();
                  }
                }
              }
            });
          }
        },
        {
          label: "保存",
          type: "primary",
          bg: true,
          btnClick: ({ drawer: { options, index } }) => {
            const done = () => closeDrawer(options, index, { command: "save" });
            const FormRef = formRef.value.getRef();
            const info = formRef.value.getFormInfo();
            const curData = options.props.formInline;
            function chores() {
              message(`保存成功`, {
                type: "success"
              });
              done(); // 关闭弹框
              onSearch();
            }
            FormRef.validate(async valid => {
              if (valid) {
                const body = {
                  ...curData
                };
                if (info.id) {
                  body.id = info.id;
                }
                if (info.id) {
                  const { success } = await dictApi.updateDict(body);
                  if (success) {
                    formRef.value.refreshInfo({
                      ...curData
                    });
                    chores();
                  }
                } else {
                  const { success, data } = await dictApi.saveDict(body);
                  if (success) {
                    formRef.value.refreshInfo({
                      ...curData,
                      id: data
                    });
                    chores();
                  }
                }
              }
            });
          }
        },
        {
          label: "取消",
          bg: true,
          btnClick: ({ drawer: { options, index } }) => {
            const done = () =>
              closeDrawer(options, index, { command: "cancel" });
            if (options?.beforeCancel && isFunction(options?.beforeCancel)) {
              options.beforeCancel(done, { options, index });
            } else {
              done();
            }
          }
        }
      ],
      contentRenderer: () => h(editForm, { ref: formRef })
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
  async function onSearch() {
    tableData.loading = true;
    const params = {
      ...searchData.data,
      current: pagination.currentPage,
      size: pagination.pageSize,
      sorts: "created desc"
    };
    const { success, data } = await dictApi.pageDict(params).finally(() => {
      tableData.loading = false;
    });
    if (success) {
      tableData.dataList = data?.records || [];
      pagination.total = data?.total || 0;
    }
  }

  /**
   * 修改状态
   */
  async function onChangeEnabled({ row, index }) {
    ElMessageBox.confirm(
      `确认要<strong>${
        row.enabled ? "启用" : "停用"
      }</strong><strong style='color:var(--el-color-primary)'>${row.name}</strong>字典?`,
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
        const { success } = await dictApi.updateDict(row);
        if (success) {
          switchLoadMap.value[index] = Object.assign(
            {},
            switchLoadMap.value[index],
            {
              loading: false
            }
          );
          message(`已${row.enabled ? "启用" : "停用"}${row.name}字典`, {
            type: "success"
          });
          onSearch();
        }
      })
      .catch(() => {
        row.enabled = row.enabled ? false : true;
      });
  }

  async function handleDelete(row) {
    tableData.loading = true;
    const { success } = await dictApi.delDict(row.id).finally(() => {
      tableData.loading = false;
    });
    if (success) {
      onSearch();
      message("删除成功", {
        type: "success"
      });
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
    openDrawer,
    handleDelete
  };
}
