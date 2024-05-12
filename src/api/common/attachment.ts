import * as http from "../base";

/**
 * 获取预签名URL
 *
 * @param filename .
 */
export function getPresignedUrl(filename: string, contentType?: string) {
  return http.get<any, any>("/common/attachment/presigned-url", {
    filename: filename,
    contentType: contentType
  });
}

/**
 * 创建上传的文件信息
 *
 * @param data .
 */
export function createFile(data: any) {
  return http.post<any, any>("/common/attachment/create", data);
}
/**
 * 上传文件
 */
export function uploadFile(data: any, params?: any) {
  return http.upload<any, any, any>("common/attachment/upload", data, params);
}

/**
 * 附件分页
 * @param data .
 * @returns
 */
export function attachmentPage(data?: any) {
  return http.get<any, any>("/common/attachment/page", data);
}

/**
 * 删除附件
 * @param id .
 * @returns
 */
export function deleteAttachment(id: string) {
  return http.del<any, any, any>(`/common/attachment`, { id });
}
