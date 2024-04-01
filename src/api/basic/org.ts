import * as http from "../base";

/**
 * 机构树
 *
 * @param query
 * @returns
 */
export function treeOrg(query?: any) {
  return http.get<any, any>(`/bas/org/tree`, query);
}
/**
 * 列表查询
 * @param query .
 * @returns .
 */
export function listOrg(query?: any) {
  return http.get<any, any>(`/bas/org`, query);
}

/**
 * 新增机构
 *
 * @param data .
 * @returns
 */
export function saveOrg(data: any) {
  return http.post<any, string>(`/bas/org`, data);
}
/**
 * 更新机构
 *
 * @param data .
 * @returns
 */
export function updateOrg(data: any) {
  return http.put<any, any, string>(`/bas/org`, {}, data);
}
