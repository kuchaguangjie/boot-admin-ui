import * as http from "../base";

/**
 * 查询权限树
 *
 * @param query
 * @returns
 */
export function loadTreePermission(query?: any) {
  return http.get<any, any>(`/bas/permission/tree`, query);
}
