<script setup lang="ts">
import { message } from "@/utils/message";
import { UploadFilled } from "@element-plus/icons-vue";
import { ref } from "vue";
import { useUpload } from "@/components/Attachment";
import { ElMessageBox, type UploadProps } from "element-plus";
import { watch } from "vue";

const fileList = ref<any[]>([]);
const data = ref({ path: "" });
const loading = ref(false);
const uploadRef = ref<any>(null);
const droneFunc = ref<Function>(null);
const previewImageUrl = ref("");
const previewVisible = ref(false);
const uploadNum = ref(0);
const uploadSuccessNum = ref(0);
const { uploadRequest } = useUpload();

function handleExceed() {
  message("最多只能上传 5 张图片！", { type: "warning" });
}
watch(
  () => uploadNum.value,
  () => {
    if (uploadNum.value >= fileList.value.length) {
      loading.value = false;
      if (uploadSuccessNum.value === fileList.value.length) {
        ElMessageBox.confirm("上传全部成功,是否继续上传？", "提示", {
          confirmButtonText: "继续上传",
          cancelButtonText: "取消",
          type: "success"
        })
          .then(() => {
            uploadRef.value?.clearFiles();
          })
          .catch(() => {
            // 关闭弹窗
            droneFunc.value();
          });
      } else {
        message("存在上传失败的图片，如需请重新上传", { type: "error" });
      }
      emit("refresh");
    }
  }
);
/** 上传错误提示 */
const submitFormError = (): void => {
  uploadNum.value++;
};
/** 处理上传的文件发生变化 */
const handleFileChange = file => {
  data.value.path = file.name;
};

/** 重置表单 */
const resetForm = () => {
  fileList.value = [];
  loading.value = false;
  uploadRef.value?.clearFiles();
};

const emit = defineEmits(["refresh"]);
const submitFormSuccess = () => {
  uploadNum.value++;
  uploadSuccessNum.value++;
};

/** 提交表单 */
const submitFileForm = (drone: Function) => {
  if (fileList.value.length === 0) {
    message("请先选择文件！", { type: "warning" });
    return;
  }
  droneFunc.value = drone;
  loading.value = true;
  previewVisible.value = false;
  uploadRef.value?.submit();
};

const handlePictureCardPreview: UploadProps["onPreview"] = uploadFile => {
  previewImageUrl.value = uploadFile.url!;
  previewVisible.value = true;
};

defineExpose({ submitFileForm });
</script>

<template>
  <div v-loading="loading">
    <el-upload
      ref="uploadRef"
      v-model:file-list="fileList"
      :data="data"
      action="#"
      multiple
      :auto-upload="false"
      drag
      accept="image/*"
      :on-exceed="handleExceed"
      :on-error="submitFormError"
      :on-change="handleFileChange"
      :on-success="submitFormSuccess"
      :http-request="uploadRequest"
      :on-preview="handlePictureCardPreview"
      :disabled="loading"
      list-type="picture-card"
    >
      <el-icon>
        <UploadFilled />
      </el-icon>
      <div class="el-upload__text">将文件拖到此处，或 <em>点击上传</em></div>
      <template #tip>
        <div class="el-upload__tip" style="color: red">
          提示：仅允许导入图片格式文件！
        </div>
      </template>
    </el-upload>

    <el-image-viewer
      v-if="previewVisible"
      :url-list="fileList.map(item => item.url)"
      @close="previewVisible = false"
    />
  </div>
</template>
