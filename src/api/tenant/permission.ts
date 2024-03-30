import * as http from "../base";

/**
 * 查询权限列表
 *
 * @param query
 * @returns
 */
export function loadPermission(query?: any) {
  return http.get<any, any>("/tenant/permission", query);
}
/**
 * 树形菜单结构
 *
 * @param filterBtn 是否过滤按钮类型
 * @returns
 */
export function listTree(filterButton = true) {
  return http.get<any, any>("/tenant/permission/menu/tree", { filterButton });
}
/**
 * 新增权限
 *
 * @param data
 * @returns
 */
export function savePermission(data: any) {
  return http.post<any, any>("/tenant/permission", data);
}

/**
 * 修改权限
 *
 * @param data
 * @returns
 */
export function updatePermission(data: any) {
  return http.put<any, any, string>("/tenant/permission", {}, data);
}

/**
 * 删除权限
 *
 * @param id
 * @returns
 */
export function deletePermission(id: number) {
  return http.del<any, any, string>(`/tenant/permission`, { id: id }, null);
}
