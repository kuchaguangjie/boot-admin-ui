import type { SearchFormItems } from "@/components/ReSearchForm/src/types";
import { enabledOptions, usePublicHooks } from "@/utils/constants";
import type { PaginationProps } from "@pureadmin/table";
import { type Ref, h, onMounted, reactive, ref } from "vue";
import * as noticeApi from "@/api/sys/notice";
import { tenantList } from "@/api/sys/tenant/org";
import type { FormItemProps } from "./types";
import { addDialog } from "@/components/ReDialog";
import editForm from "../form.vue";
import { message } from "@/utils/message";
import { ElMessageBox } from "element-plus";

export function useNotice(tableRef: Ref) {
  const switchLoadMap = ref({});
  const { switchStyle } = usePublicHooks();
  const formRef = ref();

  const tenantOrgList = ref();

  const permission = reactive({
    query: ["sys:notice:query"],
    add: ["sys:notice:save"],
    edit: ["sys:notice:update"],
    delete: ["sys:notice:delete"]
  });
  const searchData = reactive<{
    show: boolean;
    data: any;
    formItems: SearchFormItems;
    dataSource?: {
      enabledOptions: any[];
    };
  }>({
    show: true,
    data: {},
    formItems: [
      {
        type: "date-cycle",
        label: "公告时间",
        options: {
          prop: "noticeTime",
          startClearable: true,
          endClearable: true,
          startPlaceholder: "请选择开始时间",
          endPlaceholder: "请选择结束时间"
        }
      },
      {
        type: "select",
        label: "公告状态",
        options: {
          prop: "status",
          placeholder: "请选择公告状态",
          clearable: true,
          dataSourceKey: "enabledOptions"
        }
      }
    ],
    dataSource: {
      enabledOptions: enabledOptions
    }
  });

  const tableData = reactive<{
    loading: boolean;
    dataList: any[];
    columns: TableColumnList;
  }>({
    loading: false,
    dataList: [],
    columns: [
      {
        type: "selection",
        width: 50,
        align: "center"
      },
      {
        label: "公告标题",
        prop: "title"
      },
      {
        label: "公告内容",
        prop: "content",
        cellRenderer: scope => <div v-html={scope.row.content}></div>
      },
      {
        label: "公告状态",
        prop: "enabled",
        cellRenderer: scope => (
          <el-switch
            size={scope.props.size === "small" ? "small" : "default"}
            loading={switchLoadMap.value[scope.index]?.loading}
            v-model={scope.row.enabled}
            active-value={true}
            inactive-value={false}
            active-text="正常"
            inactive-text="关闭"
            inline-prompt
            style={switchStyle.value}
            onChange={() => onChange(scope as any)}
          />
        )
      },
      {
        label: "公告时间",
        prop: "noticeTime",
        cellRenderer: ({ row }) =>
          `${row.noticeTimeStart} - ${row.noticeTimeEnd}`
      },
      {
        label: "创建时间",
        prop: "created"
      },
      {
        label: "更新时间",
        prop: "modified"
      },
      {
        label: "操作",
        fixed: "right",
        width: 200,
        slot: "operation"
      }
    ]
  });
  const pagination = reactive<PaginationProps>({
    total: 0,
    pageSize: 10,
    currentPage: 1,
    background: true
  });

  function openDialog(title = "新增", row?: FormItemProps) {
    addDialog({
      title: `${title}公告`,
      width: "50%",
      props: {
        formInline: {
          id: row?.id ?? undefined,
          title: row?.title ?? undefined,
          content: row?.content ?? undefined,
          enabled: row?.enabled ?? true,
          noticeTimeStart: row?.noticeTimeStart ?? undefined,
          noticeTimeEnd: row?.noticeTimeEnd ?? undefined,
          noticeTime: [row?.noticeTimeStart, row?.noticeTimeEnd],
          orgIds: row?.orgId?.split(",") ?? []
        },
        tenantOrgList: tenantOrgList
      },
      draggable: true,
      fullscreenIcon: true,
      closeOnClickModal: false,
      contentRenderer: () => h(editForm, { ref: formRef }),
      beforeSure: (done, { options }) => {
        const FormRef = formRef.value.getRef();
        const wangEditor = formRef.value.getWangEditorRef();
        const content = wangEditor.getHtml();
        options.props.formInline.content = content;
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
            const data = {
              id: curData.id,
              title: curData.title,
              content: curData.content,
              enabled: curData.enabled,
              noticeTimeStart: curData.noticeTime[0],
              noticeTimeEnd: curData.noticeTime[1],
              orgId: curData.orgIds.toString() ?? ""
            };
            if (curData.id) {
              const { success } = await noticeApi.updateNotice(data);
              if (success) {
                chores();
              }
            } else {
              const { success } = await noticeApi.saveNotice(data);
              if (success) {
                chores();
              }
            }
          }
        });
      }
    });
  }

  function handleSearchFrom(data?: any) {
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
  function handleDeleteBatch() {
    const ids =
      tableRef.value
        ?.getTableRef()
        ?.getSelectionRows()
        ?.map(e => e.id) || [];
    if (ids.length > 0) {
      ElMessageBox.confirm("是否删除选中行", "系统提示", {
        confirmButtonText: "确认",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          deleteNotice(ids);
        })
        .catch(() => {});
    } else {
      message("请选择需要删除的行", { type: "warning" });
    }
  }
  function handleDelete(row) {
    deleteNotice([row.id]);
  }
  function onChange({ row, index }) {
    ElMessageBox.confirm(
      `确认要<strong>${
        row.enabled ? "启用" : "关闭"
      }</strong><strong style='color:var(--el-color-primary)'>${
        row.title
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
        const { success } = await noticeApi.updateNotice(row);
        if (success) {
          switchLoadMap.value[index] = Object.assign(
            {},
            switchLoadMap.value[index],
            {
              loading: false
            }
          );
          message(`已${row.enabled ? "启用" : "关闭"}${row.title}`, {
            type: "success"
          });
          onSearch();
        }
      })
      .catch(() => {
        row.enabled = row.enabled ? false : true;
      });
  }
  async function onSearch() {
    tableData.loading = true;
    const params = {
      ...searchData.data,
      current: pagination.currentPage,
      size: pagination.pageSize
    };
    const { success, data } = await noticeApi
      .pageNotices(params)
      .finally(() => {
        tableData.loading = false;
      });
    if (success) {
      tableData.dataList = data.records;
      pagination.total = data.total;
    }
  }
  async function loadTenantOrg() {
    const { success, data } = await tenantList({
      enabled: true,
      sorts: "created desc"
    });
    if (success) {
      tenantOrgList.value = data;
    }
  }

  async function deleteNotice(ids: string[]) {
    if (ids.length == 0) {
      message("请选择需要删除的行", { type: "warning" });
      return;
    }
    tableData.loading = true;
    const { success } = await noticeApi.deleteNotice(ids).finally(() => {
      tableData.loading = false;
    });
    if (success) {
      onSearch();
    }
  }
  onMounted(() => {
    onSearch();
    loadTenantOrg();
  });

  return {
    permission,
    searchData,
    tableData,
    pagination,
    handleSearchFrom,
    handleChangeCurrentPage,
    handleChangePageSize,
    onSearch,
    openDialog,
    handleDelete,
    handleDeleteBatch
  };
}
