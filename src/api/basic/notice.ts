import * as http from "../base";

/**
 * 分页查询
 *
 * @param query .
 * @returns .
 */
export function pageNotice(query?: any) {
  return http.get<any, any>(`/bas/notice/page`, query);
}

/**
 * 统计未读消息
 *
 * @returns
 */
export function countUnread() {
  return http.get<any, any>(`/bas/notice/unread/count`);
}

/**
 * 读取消息
 *
 * @param ids .
 * @returns .
 */
export function readNotice(ids: string[]) {
  return http.put<any, any, string>(`/bas/notice/read`, {}, ids);
}
