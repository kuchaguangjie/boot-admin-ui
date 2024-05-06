import type { SearchFormItems } from "@/components/ReSearchForm/src/types";
import type { OptionsType } from "@/components/ReSegmented";
import { enabledMap, enabledOptions, usePublicHooks } from "@/utils/constants";
import type { PaginationProps } from "@pureadmin/table";
import { h, onMounted, reactive, ref } from "vue";
import * as dictApi from "@/api/sys/dict";
import type {
  FormDictItemProps,
  FormItemDictItemProps,
  FormItemDictProps
} from "./types";
import { message } from "@/utils/message";
import { addDialog } from "@/components/ReDialog";
import editForm from "../itemForm.vue";

export function useDictItem(dict?: FormItemDictProps) {
  const { tagEnabledStyle } = usePublicHooks();
  const formRef = ref();
  const dictItem = ref(dict);
  const permissions = reactive({
    query: ["sys:dict:item:query"],
    add: ["sys:dict:item:save"],
    edit: ["sys:dict:item:update"],
    delete: ["sys:dict:item:delete"]
  });
  const searchData = reactive<{
    show: boolean;
    data: any;
    formItems: SearchFormItems;
    dataSource: {
      enabledOptions: OptionsType[];
    };
  }>({
    show: false,
    data: {},
    formItems: [
      {
        label: "字典项名称",
        type: "input",
        options: {
          prop: "label",
          placeholder: "请输入字典项名称"
        }
      },
      {
        label: "字典项值",
        type: "input",
        options: {
          prop: "value",
          placeholder: "请输入字典项值"
        }
      },
      {
        label: "状态",
        type: "select",
        options: {
          prop: "enabled",
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
        label: "字典项名称",
        prop: "label",
        align: "center"
      },
      {
        label: "字典项值",
        prop: "value",
        align: "center"
      },
      {
        label: "状态",
        prop: "enabled",
        align: "center",
        cellRenderer: ({ row, props }) => (
          <el-tag
            size={props.size}
            style={tagEnabledStyle.value(row.enabled)}
            effect="plain"
          >
            {enabledMap[row.enabled]}
          </el-tag>
        )
      },
      {
        label: "描述",
        prop: "description"
      },
      {
        label: "创建时间",
        prop: "created",
        align: "center"
      },
      {
        label: "操作",
        align: "center",
        fixed: "right",
        slot: "operation"
      }
    ]
  });

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
      sorts: "sort"
    };
    const { success, data } = await dictApi.pageDictItem(params).finally(() => {
      tableData.loading = false;
    });
    if (success) {
      tableData.dataList = data?.records || [];
      pagination.total = data?.total || 0;
    }
  }

  async function openDialog(title = "新增", data?: FormItemDictItemProps) {
    addDialog({
      title: `${title}字典项`,
      props: {
        formInline: {
          id: data.id ?? undefined,
          dict: data.dict ?? dictItem.value,
          label: data.label ?? "",
          value: data.value ?? "",
          sort: data.sort ?? 0,
          enabled: data.enabled ?? true,
          description: data.description ?? ""
        }
      },
      width: "40%",
      draggable: true,
      fullscreenIcon: true,
      closeOnClickModal: false,
      contentRenderer: () => h(editForm, { ref: formRef }),
      beforeSure: (done, { options }) => {
        const FormRef = formRef.value.getRef();
        const curData = options.props.formInline as FormItemDictItemProps;
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
              const { success } = await dictApi.updateDictItem(curData);
              if (success) {
                chores();
              }
            } else {
              const { success } = await dictApi.saveDictItem(curData);
              if (success) {
                chores();
              }
            }
          }
        });
      }
    });
  }

  async function handleAdd(dict: FormItemDictProps) {
    if (!dict) {
      message("请先保存字典", { type: "warning" });
      return;
    }
    if (!dict.id) {
      message("请先保存字典", { type: "warning" });
      return;
    }
    openDialog("新增", { dict: dict });
  }

  async function handleEdit(row: FormDictItemProps, dict: FormItemDictProps) {
    if (!dict) {
      message("请先保存字典", { type: "warning" });
      return;
    }
    if (!dict.id) {
      message("请先保存字典", { type: "warning" });
      return;
    }
    openDialog("新增", { ...row, dict: dict });
  }

  async function handleDelete(row: FormItemDictItemProps) {
    tableData.loading = true;
    const { success } = await dictApi.delDictItem(row.id).finally(() => {
      tableData.loading = false;
    });
    if (success) {
      message(`删除成功`, {
        type: "success"
      });
      onSearch();
    }
  }

  onMounted(() => {
    searchData.data.dictId = dictItem.value?.id;
    if (dictItem.value?.id) {
      onSearch();
    }
  });
  return {
    permissions,
    tableData,
    pagination,
    handleSetSearchForm,
    handleChangeCurrentPage,
    handleChangePageSize,
    onSearch,
    handleAdd,
    handleEdit,
    handleDelete
  };
}
