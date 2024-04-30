<script setup lang="ts">
import { onMounted, ref, nextTick } from "vue";
import { loadTreePermission } from "@/api/basic/permission";
import { getPermission } from "@/api/basic/role";
const props = withDefaults(
  defineProps<{
    formInline?: any;
  }>(),
  {
    formInline: {
      role: undefined,
      selectedKeys: []
    }
  }
);
const permissionTree = ref([]);
const newFormInline = ref(props.formInline);
const dataProps = ref({
  value: "id",
  children: "children"
});
const treeRef = ref();
const checkStrictly = ref(false);
const loading = ref(false);

function loadPermissionTree() {
  loading.value = true;
  loadTreePermission({ enabled: true, sorts: "rank" })
    .then(res => {
      if (res.success) {
        permissionTree.value = res.data;
        loadRolePermission();
      }
    })
    .catch(() => {
      loading.value = false;
    });
}

function handleCheckChange(data: any, checked: boolean) {
  const selectedNodes = treeRef.value.getCheckedNodes(); // 重点
  let selectedKeys = [];
  selectedNodes.forEach(e => {
    selectedKeys.push(e.id);
  });
  selectedKeys = selectedKeys.concat(treeRef.value.getHalfCheckedKeys());
  newFormInline.value.selectedIds = selectedKeys;
}

function loadRolePermission() {
  // const selectedIds = newFormInline.value.role?.permissionIds ?? [];
  getPermission(newFormInline.value.role.id)
    .then(res => {
      if (res.success) {
        const selectedIds = res.data;
        setPermission(selectedIds);
      }
    })
    .finally(() => {
      loading.value = false;
    });
}

function setPermission(selectedIds: any) {
  checkStrictly.value = true; //赋值之前先设置为true
  nextTick(() => {
    treeRef.value.setCheckedKeys(selectedIds); //给树节点赋值
    newFormInline.value.selectedIds = selectedIds;
    setTimeout(function () {
      checkStrictly.value = false; //赋值完成后设置为false
    }, 2000);
  });
}

/**
 * 全部展开
 */
function handleExpandAll() {
  Object.values(treeRef.value.store.nodesMap).forEach((v: any) => v.expand());
}

/**
 * 全部折叠
 */
function handleCollapseAll() {
  // 获取
  Object.values(treeRef.value.store.nodesMap).forEach((v: any) => v.collapse());
}

/**
 * 全部取消
 */
function handleUnSelectAll() {
  treeRef.value.setCheckedNodes([]);
}

/**
 * 全部选中
 */
function handleSelectAll() {
  treeRef.value.setCheckedNodes(permissionTree.value);
}

onMounted(() => {
  loadPermissionTree();
});

defineExpose({
  handleExpandAll,
  handleCollapseAll,
  handleUnSelectAll,
  handleSelectAll
});
</script>

<template>
  <div>
    <h5 style="margin-bottom: 20px">
      【{{ newFormInline?.role?.name }}】所拥有的权限：
    </h5>
    <el-tree
      ref="treeRef"
      :data="permissionTree"
      :props="dataProps"
      show-checkbox
      :height="500"
      node-key="id"
      :check-strictly="checkStrictly"
      @check-change="handleCheckChange"
    >
      <template #default="{ data }">
        <span>{{ data.title }}</span>
      </template>
    </el-tree>
  </div>
</template>
