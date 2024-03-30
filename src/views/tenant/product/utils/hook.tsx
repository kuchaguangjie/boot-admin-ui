import type { SearchFormItems } from "@/components/ReSearchForm/src/types";
import { h, onMounted, reactive, ref } from "vue";
import { enabledMap, enabledOptions } from "../..//hooks";
import type { PaginationProps } from "@pureadmin/table";
import * as productApi from "@/api/tenant/product";
import type { FormItemProps } from "./types";
import { addDialog } from "@/components/ReDialog";
import editForm from "../form.vue";
import { message } from "@/utils/message";
import { useMultiTagsStoreHook } from "@/store/modules/multiTags";
import router from "@/router";
import { addDrawer, closeDrawer } from "@/components/ReDrawer";
import { isFunction } from "@pureadmin/utils";
import permissionTreeForm from "../permissionTree.vue";

export function useProduct() {
  const formRef = ref();
  const treeRef = ref();

  const permission = reactive({
    query: ["tenant:product:query"],
    save: ["tenant:product:add"],
    update: ["tenant:product:update"],
    delete: ["tenant:product:delete"],
    grant: ["tenant:product:grant"],
    permission: ["tenant:permission:update"]
  });
  const searchData = reactive<{
    show: boolean;
    formItems: SearchFormItems;
    dataSource: {
      enabledOptions: any;
    };
    data: any;
  }>({
    show: true,
    data: [],
    dataSource: {
      enabledOptions: enabledOptions
    },
    formItems: [
      {
        type: "input",
        label: "产品名称",
        options: {
          prop: "name",
          placeholder: "请输入产品名称",
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
          selectOptionKey: {
            label: "label",
            value: "value",
            prop: "value"
          },
          dataSourceKey: "enabledOptions"
        }
      }
    ]
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
        label: "产品编码",
        prop: "code"
      },
      {
        label: "产品名称",
        prop: "name"
      },
      {
        label: "联系信息",
        cellRenderer: ({ row }) => `${row.principal ?? ""}/${row.contact ?? ""}`
      },
      {
        label: "状态",
        prop: "enabled",
        cellRenderer: ({ row, props }) => (
          <el-tag
            size={props.size}
            effect="plain"
            type={row.enabled ? "primary" : "danger"}
          >
            {enabledMap[row.enabled]}
          </el-tag>
        )
      },
      {
        label: "创建时间",
        prop: "created"
      },
      {
        label: "操作",
        fixed: "right",
        width: 180,
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

  const openDialog = (title = "新增", data?: FormItemProps) => {
    addDialog({
      title: `${title}产品`,
      props: {
        formInline: {
          id: data?.id ?? undefined,
          code: data?.code ?? "",
          name: data?.name ?? "",
          principal: data?.principal ?? "",
          contact: data?.contact ?? "",
          enabled: data?.enabled ?? true,
          description: data?.description ?? ""
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
              await updateProduct(curData);
              chores();
            } else {
              await addProduct(curData);
              chores();
            }
          }
        });
      }
    });
  };
  const openDrawer = (row: FormItemProps) => {
    addDrawer({
      title: "产品权限配置",
      props: {
        formInline: {
          role: row,
          selectedIds: []
        }
      },
      width: "45%",
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
      contentRenderer: () => h(permissionTreeForm, { ref: treeRef }),
      beforeSure: async (done, { options }) => {
        const curData = options.props.formInline;
        function chores() {
          message(`更新成功`, {
            type: "success"
          });
          done(); // 关闭弹框
          onSearch(); // 刷新表格数据
        }
        await assignPermission(curData.role?.id, curData.selectedIds);
        chores();
      }
    });
  };
  /*跳转履约端权限 */
  function gotoPermission() {
    useMultiTagsStoreHook().handleTags("push", {
      path: "/tenant/permission/index",
      name: "TenantPermissionManger",
      meta: {
        title: "履约端权限"
      }
    });
    router.push({ name: "TenantPermissionManger" });
  }
  /*=======search==========*/
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
    const { success, data } = await productApi
      .pageProduct(params)
      .finally(() => {
        tableData.loading = false;
      });
    if (success) {
      tableData.dataList = data.records;
      pagination.total = data.total;
    }
  }

  async function addProduct(data: FormItemProps) {
    return productApi.saveProduct(data);
  }
  async function updateProduct(data: FormItemProps) {
    return productApi.updateProduct(data);
  }
  async function deleteProduct(id: number) {
    return productApi.deleteProduct(id);
  }
  async function assignPermission(id: number, permissionIds?: number[]) {
    return productApi.grantProduct(id, permissionIds);
  }

  onMounted(() => {
    onSearch();
  });

  return {
    permission,
    searchData,
    tableData,
    pagination,
    gotoPermission,
    handleSetSearchForm,
    handleChangeCurrentPage,
    handleChangePageSize,
    deleteProduct,
    onSearch,
    openDialog,
    openDrawer
  };
}
