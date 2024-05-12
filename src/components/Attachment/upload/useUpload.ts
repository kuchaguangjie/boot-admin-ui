import axios from "axios";
import * as attchmentApi from "@/api/common/attachment";
import type { UploadRawFile, UploadRequestOptions } from "element-plus";

/**
 *  上传文件
 * @returns
 */
export const useUpload = () => {
  //合并两种上传方式
  async function uploadRequest(options: UploadRequestOptions) {
    // 判断文件大小 2M 以下后端上传，2M 以上前端直传
    const sized = options.file.size > 1024 * 1024 * 5;
    if (sized) {
      return uploadFile(options);
    } else {
      return uploadPreSignedUrl(options);
    }
  }
  // 第一种前端直传
  async function uploadPreSignedUrl(options: UploadRequestOptions) {
    const filename = generateFileName(options.file);
    // 生成预签名地址
    const { success, data } = await attchmentApi.getPresignedUrl(
      filename,
      options.file.type
    );
    if (!success) {
      return Promise.reject("获取预签名地址失败");
    }
    // 上传文件
    return axios
      .put(data.uploadUrl, options.file, {
        headers: {
          "Content-Type": options.file.type
        }
      })
      .then(() => {
        // 上传后记录上传信息
        createFile(filename, options.file, data);
        return { data: data.accessUrl };
      });
  }

  // 第二种后端上传
  function uploadFile(options: UploadRequestOptions) {
    // 上传文件
    return new Promise((resolve, reject) => {
      attchmentApi
        .uploadFile({ file: options.file })
        .then(res => {
          if (!res.success) {
            reject("上传失败");
          } else {
            resolve({ data: res.data.permalink });
          }
        })
        .catch(() => {
          reject("上传失败");
        });
    });
  }

  /**
   *  创建上传的文件信息
   * @param name
   * @param file
   */
  async function createFile(name: string, file: UploadRawFile, data: any) {
    const body = {
      displayName: name,
      mediaType: file.type,
      size: file.size,
      permalink: data.accessUrl
    };
    await attchmentApi.createFile(body);
  }

  /**
   * 生成文件名
   * @param file
   */
  function generateFileName(file: UploadRawFile) {
    // 生成文件名
    const filename = `${file.name.substring(0, file.name.lastIndexOf("."))}_${new Date().getTime()}`;
    // 拼接后缀
    const ext = file.name.substring(file.name.lastIndexOf("."));
    return `${filename}${ext}`;
  }

  return {
    uploadRequest,
    uploadPreSignedUrl,
    uploadFile
  };
};
