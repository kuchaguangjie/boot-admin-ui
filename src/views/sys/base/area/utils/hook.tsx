import type { SearchFormItems } from "@/components/ReSearchForm/src/types";
import type { OptionsType } from "@/components/ReSegmented";
import { enabledOptions, usePublicHooks } from "@/utils/constants";
import { type Ref, h, onMounted, reactive, ref } from "vue";
import * as areaApi from "@/api/sys/base/area";
import type { FormItemProps, TreeData } from "./types";
import { addDialog } from "@/components/ReDialog";
import editForm from "../form.vue";
import { message } from "@/utils/message";
import { ElMessageBox } from "element-plus";

export function useArea(tableRef: Ref) {
  const switchLoadMap = ref({});
  const { switchStyle } = usePublicHooks();
  const formRef = ref();
  const loadMap = new Map();

  const permissions = reactive({
    query: ["sys:area:query"],
    add: ["sys:area:save"],
    edit: ["sys:area:update"],
    delete: ["sys:area:delete"]
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
        label: "区域名称",
        type: "input",
        options: {
          prop: "name",
          placeholder: "请输入区域名称"
        }
      },
      {
        label: "区域编码",
        type: "input",
        options: {
          prop: "code",
          placeholder: "请输入区域编码"
        }
      },
      {
        label: "状态",
        type: "select",
        options: {
          prop: "enabled",
          clearable: true,
          placeholder: "请选择状态",
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
    dataList: Array<TreeData>;
    columns: TableColumnList;
  }>({
    loading: false,
    dataList: [],
    columns: [
      {
        label: "地区编码",
        prop: "code"
      },
      {
        label: "地区名称",
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
          />
        )
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
        slot: "operation"
      }
    ]
  });

  async function openDialog(title = "新增", row?: FormItemProps) {
    addDialog({
      title: `${title}地区`,
      props: {
        formInline: {
          id: row?.id ?? null,
          parentId: row?.parentId ?? null,
          code: row?.code ?? null,
          name: row?.name ?? null,
          enabled: row?.enabled ?? true,
          remark: row?.remark ?? ""
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
        }
        FormRef.validate(async valid => {
          if (valid) {
            if (curData.id) {
              const { success } = await areaApi.updateArea(curData);
              if (success) {
                chores();
                refreshTreeNode(curData.parentId);
              }
            } else {
              const { success } = await areaApi.saveArea(curData);
              if (success) {
                chores();
                refreshTreeNode(curData.parentId);
              }
            }
          }
        });
      }
    });
  }

  /**
   * 刷新树节点
   */
  async function refreshTreeNode(parentId: string) {
    const map = loadMap.get(parentId);
    if (map) {
      handleGetChild(map.row, map.treeNode, map.resolve);
    }
    if (!parentId) {
      onSearch();
    }
  }

  /**
   * 获取子节点
   *
   * @param row
   * @param treeNode
   * @param resolve
   */
  async function handleGetChild(
    row: TreeData,
    treeNode: unknown,
    resolve: (date: TreeData[]) => void
  ) {
    loadMap.set(row.id, { row, treeNode, resolve });
    const { success, data } = await areaApi.areaList({
      parentId: row.id,
      sorts: "created"
    });
    if (success) {
      const treeData = data.map((item: any) => {
        item.hasChildren = true;
        return item;
      });
      if (treeData.length > 0) {
        resolve([...treeData]);
      } else {
        const rowRef =
          tableRef.value?.getTableRef()?.store?.states?.lazyTreeNodeMap?.value[
            row.id
          ];
        if (rowRef) {
          tableRef.value.getTableRef().store.states.lazyTreeNodeMap.value[
            row.id
          ] = [];
        } else {
          resolve([]);
        }
      }
    }
  }

  function handleSetSearchForm(data?: any) {
    searchData.data = data;
  }
  /**
   * 查询
   */
  async function onSearch() {
    const params = {
      ...searchData.data,
      sorts: "created"
    };
    tableData.loading = true;
    //清理树节点
    tableRef.value.getTableRef().store.states.treeData.value = {};

    const { success, data } = await areaApi.areaList(params).finally(() => {
      tableData.loading = false;
    });
    if (success) {
      const treeData = data.map((item: any) => {
        item.hasChildren = true;
        return item;
      });
      tableData.dataList = treeData;
    }
  }
  async function handleDelete(row: FormItemProps) {
    tableData.loading = true;
    const { success } = await areaApi.deleteArea(row.id).finally(() => {
      tableData.loading = false;
    });
    if (success) {
      message(`删除成功`, {
        type: "success"
      });
      refreshTreeNode(row.parentId);
    }
  }
  /**
   * 修改状态
   */
  async function onChangeEnabled({ row, index }) {
    ElMessageBox.confirm(
      `确认要<strong>${
        row.enabled ? "启用" : "停用"
      }</strong><strong style='color:var(--el-color-primary)'>${
        row.name
      }地区包含子节点</strong>吗?`,
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
        const { success } = await areaApi.updateArea(row);
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
          refreshTreeNode(row.parentId);
        }
      })
      .catch(() => {
        row.enabled = row.enabled ? false : true;
      });
  }

  onMounted(() => {
    onSearch();
  });

  return {
    permissions,
    searchData,
    tableData,
    handleSetSearchForm,
    onSearch,
    handleGetChild,
    openDialog,
    handleDelete
  };
}
