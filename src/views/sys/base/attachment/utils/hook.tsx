import type { SearchFormItems } from "@/components/ReSearchForm/src/types";
import type { PaginationProps } from "@pureadmin/table";
import { h, onMounted, reactive, ref } from "vue";
import * as attachmentApi from "@/api/common/attachment";
import { addDialog, closeDialog } from "@/components/ReDialog";
import editForm from "../form.vue";
import { UploadFilled } from "@element-plus/icons-vue";
import { isFunction } from "@pureadmin/utils";
import { message } from "@/utils/message";

export function useAttachment() {
  const formRef = ref<any>(null);

  const permissions = reactive({
    delete: ["common:attachment:delete"]
  });

  const searchData = reactive<{
    show: boolean;
    data: any;
    formItems: SearchFormItems;
  }>({
    show: true,
    data: {},
    formItems: [
      {
        label: "附件名称",
        type: "input",
        options: {
          prop: "displayName",
          placeholder: "请输入附件名称"
        }
      },
      {
        label: "附件类型",
        type: "input",
        options: {
          prop: "mediaType",
          placeholder: "请输入附件类型"
        }
      }
    ]
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
    columns: Array<any>;
  }>({
    loading: false,
    dataList: [],
    columns: [
      {
        label: "预览",
        slot: "preview"
      },
      {
        label: "附件类型",
        prop: "mediaType"
      },
      {
        label: "附件大小",
        prop: "size",
        formatter: (row: any) => {
          const size = row.size;
          if (size < 1024) {
            return size + "B";
          } else if (size < 1024 * 1024) {
            return (size / 1024).toFixed(2) + "KB";
          } else {
            return (size / 1024 / 1024).toFixed(2) + "MB";
          }
        }
      },
      {
        label: "附件地址",
        prop: "permalink",
        slot: "link"
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

  function openDialog() {
    addDialog({
      title: "添加附件",
      width: "30%",
      fullscreenIcon: false,
      closeOnClickModal: false,
      appendToBody: false,
      footerButtons: [
        {
          label: "取消",
          bg: true,
          btnClick: ({ dialog: { options, index } }) => {
            const done = () =>
              closeDialog(options, index, { command: "cancel" });
            if (options?.beforeCancel && isFunction(options?.beforeCancel)) {
              options.beforeCancel(done, { options, index });
            } else {
              done();
            }
          }
        },
        {
          label: "上传",
          type: "primary",
          bg: true,
          icon: () => h(UploadFilled),
          popconfirm: {
            title: "确定上传吗?",
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            confirmButtonType: "primary",
            cancelButtonType: "text"
          },
          btnClick: ({ dialog: { options, index } }) => {
            const done = () => closeDialog(options, index, { command: "sure" });
            if (options?.beforeSure && isFunction(options?.beforeSure)) {
              options.beforeSure(done, { options, index });
            } else {
              done();
            }
          }
        }
      ],
      contentRenderer: () =>
        h(editForm, {
          ref: formRef,
          onRefresh: () => {
            onSearch();
          }
        }),
      beforeSure: (drone: Function) => {
        // formRef.value.
        formRef.value.submitFileForm(drone);
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
      size: pagination.pageSize,
      sorts: "created"
    };
    const { success, data } = await attachmentApi
      .attachmentPage(params)
      .finally(() => (tableData.loading = false));
    if (success) {
      tableData.dataList = data.records;
      pagination.total = data.total;
    }
  }

  async function handleDelete(id: string) {
    tableData.loading = true;
    const { success } = await attachmentApi
      .deleteAttachment(id)
      .finally(() => (tableData.loading = false));
    if (success) {
      message("删除成功", { type: "success" });
      onSearch();
    }
  }

  onMounted(() => {
    onSearch();
  });

  return {
    permissions,
    searchData,
    tableData,
    pagination,
    onSearch,
    handleSetSearchForm,
    handleChangeCurrentPage,
    handleChangePageSize,
    openDialog,
    handleDelete
  };
}
