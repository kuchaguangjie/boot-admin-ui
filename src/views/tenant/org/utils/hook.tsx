import type { SearchFormItems } from "@/components/ReSearchForm/src/types";
import { h, onMounted, reactive, ref } from "vue";
import { enabledOptions, usePublicHooks } from "../../hooks";
import type { PaginationProps } from "@pureadmin/table";
import { ElMessageBox } from "element-plus";
import type { FormItemProps } from "./types";
import { addDrawer, closeDrawer } from "@/components/ReDrawer";
import { deviceDetection, isFunction } from "@pureadmin/utils";
import editForm from "../form.vue";
import configForm from "../config.vue";
import { message } from "@/utils/message";
import * as tenantOrgApi from "@/api/tenant/org";

export function useOrg() {
  const switchLoadMap = ref({});
  const { switchStyle } = usePublicHooks();
  const formRef = ref();
  const configFormRef = ref();
  const permission = reactive({
    query: [],
    save: [],
    update: [],
    delete: []
  });
  const productList = ref([]);

  const searchData = reactive<{
    show: boolean;
    data: any;
    formItems: SearchFormItems;
    dataSource: {
      enabledOptions: any;
    };
  }>({
    show: true,
    data: {},
    formItems: [
      {
        type: "input",
        label: "商户名称",
        options: {
          prop: "name",
          placeholder: "请输入商户名称"
        }
      },
      {
        type: "input",
        label: "商户识别码",
        options: {
          prop: "sysCode",
          placeholder: "请输入商户识别码"
        }
      },
      {
        type: "select",
        label: "状态",
        options: {
          prop: "enabled",
          placeholder: "请选择状态",
          selectOptionKey: {
            label: "label",
            value: "value",
            prop: "value"
          },
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
        label: "商户名称",
        prop: "name"
      },
      {
        label: "商户识别码",
        prop: "sysCode"
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
            onChange={() => onChange(scope as any)}
          />
        )
      },
      {
        label: "负责人",
        prop: "leader",
        cellRenderer: ({ row }) => `${row.linkMan}(${row.linkTel})`
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
        prop: "action",
        width: 200,
        fixed: "right",
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

  function openDrawer(title = "新增", row?: FormItemProps) {
    addDrawer({
      title: `${title}商户`,
      width: "35%",
      props: {
        formInline: {
          id: row?.id ?? undefined,
          name: row?.name ?? "",
          sysCode: row?.sysCode ?? "",
          linkMan: row?.linkMan ?? "",
          linkTel: row?.linkTel ?? "",
          linkEmail: row?.linkEmail ?? "",
          address: row?.address ?? "",
          productId: row?.product?.id ?? "",
          product: row?.product ?? {},
          usedEndTime: row?.usedEndTime ?? "",
          memo: row?.memo ?? "",
          enabled: row?.enabled ?? true
        }
      },
      fullscreen: deviceDetection(),
      fullscreenIcon: true,
      closeOnClickModal: false,
      footerButtons: [
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
        },
        {
          label: "确认",
          type: "primary",
          bg: true,
          confirm: true,
          tips: "是否更新当前产品的权限",
          btnClick: ({ drawer: { options, index } }) => {
            const done = () => closeDrawer(options, index, { command: "sure" });
            if (options?.beforeSure && isFunction(options?.beforeSure)) {
              options.beforeSure(done, { options, index });
            } else {
              done();
            }
          }
        }
      ],
      contentRenderer: () => h(editForm, { ref: formRef }),
      beforeSure: (done, { options }) => {
        const FormRef = formRef.value.getRef();
        const curData = options.props.formInline as FormItemProps;
        function chores() {
          message("保存成功", { type: "success" });
          done(); // 关闭弹框
          onSearch(); // 刷新表格数据
        }
        FormRef.validate(async valid => {
          if (valid) {
            if (curData.id) {
              await updateTenantOrg(curData);
              chores();
            } else {
              await addTenantOrg(curData);
              chores();
            }
          }
        });
      }
    });
  }

  function openConfigDrawer(row: FormItemProps) {
    addDrawer({
      title: `更新【${row.name}】商户的配置`,
      width: "35%",
      props: {
        formInline: {
          id: row?.id ?? undefined,
          name: row?.name ?? "",
          sysCode: row?.sysCode ?? "",
          linkMan: row?.linkMan ?? "",
          linkTel: row?.linkTel ?? "",
          linkEmail: row?.linkEmail ?? "",
          address: row?.address ?? "",
          productId: row?.product?.id ?? "",
          product: row?.product ?? {},
          usedEndTime: row?.usedEndTime ?? "",
          memo: row?.memo ?? "",
          enabled: row?.enabled ?? true
        }
      },
      fullscreen: deviceDetection(),
      fullscreenIcon: true,
      closeOnClickModal: false,
      footerButtons: [
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
        },
        {
          label: "确认",
          type: "primary",
          bg: true,
          confirm: true,
          tips: "是否更新当前产品的权限",
          btnClick: ({ drawer: { options, index } }) => {
            const done = () => closeDrawer(options, index, { command: "sure" });
            if (options?.beforeSure && isFunction(options?.beforeSure)) {
              options.beforeSure(done, { options, index });
            } else {
              done();
            }
          }
        }
      ],
      contentRenderer: () => h(configForm, { ref: configFormRef }),
      beforeSure: (done, { options }) => {
        const FormRef = configFormRef.value.getRef();
        const curData = options.props.formInline as FormItemProps;
        function chores() {
          message("保存成功", { type: "success" });
          done(); // 关闭弹框
          onSearch(); // 刷新表格数据
        }
        FormRef.validate(async valid => {
          if (valid) {
            const data = {
              id: curData.id,
              usedEndTime: curData.usedEndTime
            };
            const { success } = await tenantOrgApi.updateConfigTenant(data);
            if (success) {
              chores();
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
  async function onSearch() {
    tableData.loading = true;
    const params = {
      ...searchData.data,
      current: pagination.currentPage,
      size: pagination.pageSize
    };
    const { success, data } = await tenantOrgApi
      .pageTenant(params)
      .finally(() => {
        tableData.loading = false;
      });
    if (success) {
      tableData.dataList = data.records;
      pagination.total = data.total;
    }
  }

  function onChange({ row, index }) {
    ElMessageBox.confirm(
      `确认要<strong>${
        row.enabled ? "启用" : "停用"
      }</strong>【<strong style='color:var(--el-color-primary)'>${
        row.name
      }</strong>】商户吗?`,
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
      })
      .catch(() => {
        row.enabled = row.enabled ? false : true;
      });
  }

  function handleRestPwd(row: FormItemProps) {
    ElMessageBox.confirm(
      `确认要重置【<strong style='color:var(--el-color-primary)'>${row.name}</strong>】商户的超管密码吗?`,
      {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
        dangerouslyUseHTMLString: true,
        draggable: true
      }
    )
      .then(async () => {
        const { success } = await tenantOrgApi.resetPwdTenant(row.id);
        if (success) {
          message("重置成功", { type: "success" });
        }
      })
      .catch(() => {});
  }

  async function addTenantOrg(data: FormItemProps) {
    return tenantOrgApi.saveTenant(data);
  }
  async function updateTenantOrg(data: FormItemProps) {
    return tenantOrgApi.updateTenant(data);
  }
  onMounted(() => {
    onSearch();
  });
  return {
    permission,
    searchData,
    tableData,
    pagination,
    productList,
    handleSetSearchForm,
    handleChangeCurrentPage,
    handleChangePageSize,
    onSearch,
    openDrawer,
    openConfigDrawer,
    handleRestPwd
  };
}
