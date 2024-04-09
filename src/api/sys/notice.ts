import * as http from "../base";

/**
 * 分页查询-系统公告
 *
 * @param query
 * @returns
 */
export function pageNotices(query?: any) {
  return http.get<any, any>(`/sys/notice`, query);
}

/**
 *  新增系统公告
 *
 * @param data
 * @returns
 */
export function saveNotice(data: any) {
  return http.post<any, string>(`/sys/notice`, data);
}
/**
 * 更新公告信息
 *
 * @param data
 * @returns
 */
export function updateNotice(data: any) {
  return http.put<any, any, string>(`/sys/notice`, {}, data);
}
/**
 *  删除公告
 *
 * @param ids
 * @returns
 */
export function deleteNotice(ids: string[]) {
  return http.del<any, any, string>(`/sys/notice`, {}, ids);
}
