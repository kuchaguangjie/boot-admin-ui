<script setup lang="ts">
import type { UploadProps } from "element-plus";
import { ref } from "vue";
import ReCropperPreview from "@/components/ReCropperPreview";
import { useUpload } from "@/components/Attachment";
import { message } from "@/utils/message";

const imgSrc = ref("");
const dialogVisible = ref(false);
const filename = ref("");
const blobValue = ref(null);
const loading = ref(false);
const { uploadRequestFile } = useUpload();

const model = defineModel();
const emits = defineEmits(["update:modelValue"]);

const sourceValue = ref<any>(model);

const onUploadChange: UploadProps["onChange"] = uploadFile => {
  const reader = new FileReader();
  reader.onload = e => {
    imgSrc.value = e.target.result as string;
    filename.value = uploadFile.name;
    dialogVisible.value = true;
  };
  reader.readAsDataURL(uploadFile.raw);
};

const onCropper = ({ blob }) => {
  blobValue.value = blob;
};

const handleClose = () => {
  dialogVisible.value = false;
};

const handleSubmitImage = async () => {
  loading.value = true;
  const file = new File([blobValue.value], filename.value, {
    type: blobValue.value.type
  });
  uploadRequestFile(file)
    .then((res: any) => {
      sourceValue.value = res.data;
      dialogVisible.value = false;
      message("上传成功", { type: "success" });
      emits("update:modelValue", res.data);
    })
    .catch(err => {
      message(err, { type: "error" });
    })
    .finally(() => {
      loading.value = false;
    });
};
</script>

<template>
  <el-upload
    ref="uploadRef"
    accept="image/*"
    action="#"
    :auto-upload="false"
    :multiple="false"
    :show-file-list="false"
    class="avatar-uploader"
    :on-change="onUploadChange"
  >
    <el-avatar
      v-if="sourceValue"
      :size="120"
      :src="sourceValue"
      class="avatar"
    />
    <el-avatar v-else :size="120" src="/src/assets/user.jpg" class="avatar" />
  </el-upload>

  <el-dialog
    v-model="dialogVisible"
    width="40%"
    title="头像预览"
    destroy-on-close
  >
    <ReCropperPreview :imgSrc="imgSrc" @cropper="onCropper" />
    <template #footer>
      <div class="dialog-footer">
        <el-button bg text @click="handleClose">取消</el-button>
        <el-button
          v-loading="loading"
          bg
          text
          type="primary"
          @click="handleSubmitImage"
        >
          确定
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<style lang="scss" scoped>
.avatar-uploader {
  .avatar {
    width: 120px;
    height: 120px;
    border-radius: 50%;

    &:hover::after {
      position: absolute;
      width: 120px;
      height: 120px;
      font-size: 24px;
      font-style: normal;
      line-height: 120px;
      color: #eee;
      text-align: center;
      cursor: pointer;
      content: "+";
      background: rgb(0 0 0 / 50%);
      border-radius: 50%;
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
    }
  }
}
</style>
