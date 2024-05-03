import type { SearchFormItems } from "@/components/ReSearchForm/src/types";
import { enabledOptions, enabledMap, usePublicHooks } from "@/utils/constants";
import { type Ref, h, onMounted, reactive, ref } from "vue";
import * as orgApi from "@/api/basic/org";
import { addDrawer, closeDrawer } from "@/components/ReDrawer";
import editForm from "../form.vue";
import { message } from "@/utils/message";
import { isFunction } from "@pureadmin/utils";
import type { FormItemProps, TableColumnsProps } from "./types";

export function useOrg(tableRef: Ref) {
  let tableMaps = ref(new Map());
  const formRef = ref();
  const { tagEnabledStyle } = usePublicHooks();
  const permission = reactive({
    query: "bas:org:query",
    add: "bas:org:save",
    edit: "bas:org:update",
    delete: "bas:org:delete"
  });
  const searchData = reactive<{
    show: boolean;
    data: any;
    formItems: SearchFormItems;
    dataSource: {
      enabledOptions: any[];
    };
  }>({
    show: true,
    data: {},
    formItems: [
      {
        type: "input",
        label: "机构名称",
        options: {
          prop: "name",
          placeholder: "请输入机构名称"
        }
      },
      {
        type: "input",
        label: "联系人",
        options: {
          prop: "linkMan",
          placeholder: "请输入联系人"
        }
      },
      {
        type: "input",
        label: "联系电话",
        options: {
          prop: "linkTel",
          placeholder: "请输入联系电话"
        }
      },
      {
        type: "select",
        label: "状态",
        options: {
          prop: "enabled",
          placeholder: "请选择状态",
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
    dataList: Array<any>;
    columns: TableColumnList;
  }>({
    loading: false,
    dataList: [],
    columns: [
      {
        label: "机构名称",
        prop: "name"
      },
      {
        label: "联系人",
        prop: "linkMan"
      },
      {
        label: "联系电话",
        prop: "linkTel"
      },
      {
        label: "状态",
        prop: "enabled",
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
        label: "操作",
        fixed: "right",
        width: 210,
        slot: "operation"
      }
    ]
  });
  function handleSetSearchForm(data?: any) {
    searchData.data = data;
  }
  async function onSearch() {
    tableData.loading = true;
    const params = {
      ...searchData.data,
      sorts: "created"
    };
    const { success, data } = await orgApi.listOrg(params).finally(() => {
      tableData.loading = false;
    });
    if (success) {
      data.forEach(el => {
        el.hasChildren = true;
      });
      tableData.dataList = data;
    }
  }
  async function handleGetChild(
    row: TableColumnsProps,
    treeNode: unknown,
    resolve: (date: TableColumnsProps[]) => void
  ) {
    // load 函数中的将当前行信息保存
    tableMaps.value.set(row.id, { row, treeNode, resolve });
    const { success, data } = await orgApi.listOrg({
      parentId: row.id,
      sorts: "created"
    });
    if (success) {
      data.forEach(el => {
        el.hasChildren = true;
      });
      resolve(data);
    }
  }
  function openDrawer(title = "新增", row?: FormItemProps) {
    addDrawer({
      title: `${title}机构`,
      props: {
        formInline: {
          id: row?.id ?? "",
          parentId: row?.parentId ?? undefined,
          name: row?.name ?? "",
          linkMan: row?.linkMan ?? "",
          linkTel: row?.linkTel ?? "",
          linkEmail: row?.linkEmail ?? "",
          address: row?.address ?? "",
          type: row?.type ?? 2,
          memo: row?.memo ?? "",
          system: row?.system ?? false,
          enabled: row?.enabled ?? true,
          saas: row?.saas ?? false
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
          tips: `是否${title}机构`,
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
          message(`保存成功`, {
            type: "success"
          });
          done(); // 关闭弹框
          onSearch(); // 刷新表格数据
        }
        FormRef.validate(async valid => {
          if (valid) {
            if (curData.id) {
              const { success } = await updateOrg(curData);
              if (success) {
                chores();
              }
            } else {
              const { success } = await addOrg(curData);
              if (success) {
                chores();
              }
            }
          }
        });
      }
    });
  }

  async function addOrg(data: FormItemProps) {
    const { success } = await orgApi.saveOrg(data);
    if (success) {
      if (tableMaps.value.get(data.parentId)) {
        const _tableRef = tableRef.value.getTableRef();
        const { row, treeNode, resolve } = tableMaps.value.get(data.parentId);
        /*报错部分修改*/
        _tableRef.store.states.lazyTreeNodeMap.value[data.parentId] = [];
        handleGetChild(row, treeNode, resolve);
      }
    }
    return { success };
  }
  async function updateOrg(data: FormItemProps) {
    const { success } = await orgApi.updateOrg(data);
    if (success) {
      //重新刷新当前节点的子节点
      const _tableRef = tableRef.value.getTableRef();
      const { row, treeNode, resolve } = tableMaps.value.get(data.parentId);
      _tableRef.store.states.lazyTreeNodeMap.value[data.parentId] = [];
      handleGetChild(row, treeNode, resolve);
    }
    return { success };
  }
  async function deleteOrg(data: FormItemProps) {
    tableData.loading = true;
    const { success } = await orgApi.deleteOrg(data.id).finally(() => {
      tableData.loading = false;
    });
    if (success) {
      message(`删除成功`, {
        type: "success"
      });
      if (data.parentId) {
        //重新刷新当前节点的子节点
        const _tableRef = tableRef.value.getTableRef();
        const { row, treeNode, resolve } = tableMaps.value.get(data.parentId);
        if (
          _tableRef.store.states.lazyTreeNodeMap.value[data.parentId]?.length >
          1
        ) {
          //说明该节点下有多个子节点
          _tableRef.store.states.lazyTreeNodeMap[data.parentId] = [];
        } else {
          //说明该节点只有一个节点
          _tableRef.store.states.lazyTreeNodeMap.value[data.parentId] = [];
        }
        handleGetChild(row, treeNode, resolve);
      } else {
        onSearch();
      }
    }
  }

  onMounted(() => {
    onSearch();
  });
  return {
    permission,
    searchData,
    tableData,
    handleSetSearchForm,
    onSearch,
    handleGetChild,
    openDrawer,
    deleteOrg
  };
}
