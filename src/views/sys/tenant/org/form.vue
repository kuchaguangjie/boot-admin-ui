<script setup lang="ts">
import { ref } from "vue";
import { FormProps } from "./utils/types";
import ReCol from "@/components/ReCol";
import { onMounted } from "vue";
import { listProduct } from "@/api/sys/tenant/product";
import { computed } from "vue";
import { useFormRule } from "./utils/rules";

const props = withDefaults(defineProps<FormProps>(), {
  formInline: () => ({
    id: undefined,
    name: "",
    sysCode: "",
    linkMan: "",
    linkTel: "",
    linkEmail: "",
    address: "",
    productId: "",
    usedEndTime: "",
    enabled: true
  })
});
const productList = ref([]);
const ruleFormRef = ref();
const newFormInline = ref(props.formInline);
const isUpdate = computed(() => !!newFormInline.value.id);

function getRef() {
  return ruleFormRef.value;
}
async function loadProduct() {
  const { success, data } = await listProduct({ enabled: true });
  if (success) {
    productList.value = data;
  }
}

onMounted(() => {
  loadProduct();
});
defineExpose({ getRef });
</script>

<template>
  <div class="flex items-center">
    <el-form
      ref="ruleFormRef"
      :model="newFormInline"
      label-width="150px"
      :rules="useFormRule(newFormInline)"
      position="right"
    >
      <el-row :gutter="30">
        <re-col :value="16" :xs="24" :sm="24">
          <el-form-item label="商户名称" prop="name">
            <el-input
              v-model="newFormInline.name"
              clearable
              placeholder="请输入商户名称"
              :disabled="isUpdate"
            />
          </el-form-item>
        </re-col>
        <re-col :value="16" :xs="24" :sm="24">
          <el-form-item label="商户识别码" prop="sysCode">
            <el-input
              v-model="newFormInline.sysCode"
              clearable
              placeholder="请输入商户识别码"
              :disabled="isUpdate"
            />
          </el-form-item>
        </re-col>
        <re-col :value="16" :xs="24" :sm="24">
          <el-form-item label="联系人" prop="linkMan">
            <el-input
              v-model="newFormInline.linkMan"
              clearable
              placeholder="请输入联系人"
            />
          </el-form-item>
        </re-col>
        <re-col :value="16" :xs="24" :sm="24">
          <el-form-item label="预约手机号" prop="linkTel">
            <el-input
              v-model="newFormInline.linkTel"
              clearable
              placeholder="请输入接收saas账号密码的手机号"
            />
          </el-form-item>
        </re-col>
        <re-col :value="16" :xs="24" :sm="24">
          <el-form-item label="联系邮箱" prop="linkEmail">
            <el-input
              v-model="newFormInline.linkEmail"
              clearable
              placeholder="请输入联系邮箱"
            />
          </el-form-item>
        </re-col>
        <re-col :value="16" :xs="24" :sm="24">
          <el-form-item label="商户地址" prop="address">
            <el-input
              v-model="newFormInline.address"
              clearable
              placeholder="请输入商户地址"
            />
          </el-form-item>
        </re-col>
        <re-col :value="16" :xs="24" :sm="24">
          <el-form-item label="产品" prop="productId">
            <el-select
              v-model="newFormInline.productId"
              placeholder="请选择产品"
              filterable
            >
              <el-option
                v-for="item in productList"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              />
            </el-select>
          </el-form-item>
        </re-col>
        <re-col :value="16" :xs="24" :sm="24">
          <el-form-item label="是否启用" prop="enabled">
            <el-switch
              v-model="newFormInline.enabled"
              active-color="#13ce66"
              inactive-color="#ff4949"
              :active-value="true"
              :inactive-value="false"
            />
          </el-form-item>
        </re-col>
        <re-col :value="16" :xs="24" :sm="24">
          <el-form-item label="备注" prop="remark">
            <el-input
              v-model="newFormInline.memo"
              clearable
              type="textarea"
              :rows="3"
              placeholder="请输入200字以内的备注信息"
              maxlength="200"
            />
          </el-form-item>
        </re-col>
      </el-row>
    </el-form>
  </div>
</template>

<style lang="scss" scoped>
.el-form-item {
  margin-bottom: 30px;
}
</style>
../../sys/hooks @/api/tenant/product @/api/sys/tenant/product
