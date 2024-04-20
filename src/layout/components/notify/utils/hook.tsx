import "./index.scss";

import { type Ref, h, onMounted, reactive, ref } from "vue";
import * as noticeApi from "@/api/basic/notice";
import { addDialog } from "@/components/ReDialog";
import InfoNotice from "../info.vue";

export function useNotice(dropdownRef: Ref) {
  const notices = ref([]);

  const loading = ref(false);
  const dialogOpen = ref(false);
  const pagination = reactive({
    page: 0,
    pageSize: 10,
    total: 0,
    next: false
  });
  const unReadCount = ref(0);
  async function getUnReadCount() {
    const { success, data } = await noticeApi.countUnread();
    if (success) {
      unReadCount.value = data;
    }
  }
  async function loadNotice() {
    loading.value = true;
    pagination.page += 1;
    const { success, data } = await noticeApi
      .pageNotice({
        current: pagination.page,
        size: pagination.pageSize
      })
      .finally(() => {
        loading.value = false;
      });
    if (success) {
      if (data?.records?.length > 0) {
        pagination.next = true;
      }
      if (data?.records) {
        notices.value = notices.value.concat(data.records);
      }
      pagination.total = data?.total;
    }
  }

  function openDialog(notice) {
    addDialog({
      title: "通知详情",
      width: "30%",
      props: {
        formInline: notice
      },
      hideFooter: true,
      fullscreenIcon: true,
      closeOnClickModal: false,
      appendToBody: false,
      contentRenderer: () => h(InfoNotice),
      open: () => {
        dialogOpen.value = true;
      },
      close: () => {
        dialogOpen.value = false;
      }
    });
    markRead(notice);
  }

  async function markRead(notice) {
    const { success } = await noticeApi.readNotice([notice.id]);
    if (success) {
      notice.read = true;
      getUnReadCount();
    }
  }
  function visibleChange() {
    if (dialogOpen.value) {
      dropdownRef.value.handleOpen();
    }
  }

  async function handleReadAll() {
    const { success } = await noticeApi.readNotice([]);
    if (success) {
      notices.value.forEach(item => {
        item.read = true;
      });
      getUnReadCount();
    }
  }

  onMounted(() => {
    getUnReadCount();
    loadNotice();
  });
  return {
    notices,
    unReadCount,
    loading,
    pagination,
    loadNotice,
    openDialog,
    visibleChange,
    handleReadAll
  };
}
