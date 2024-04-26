import * as http from "../base";

/**
 * code是否存在
 *
 * @param code
 * @param id
 * @returns
 */
export function existsByCode(code: string, id: string) {
  return http.get<any, any>(`/bas/role/existsByCode`, { code, id });
}
/**
 * 列表查询-角色
 *
 * @param query
 * @returns
 */
export function listRole(query?: any) {
  return http.get<any, any>("/bas/role/list", query);
}
/**
 * 分页查询
 *
 * @param query
 * @returns
 */
export function pageRole(query?: any) {
  return http.get<any, any>("/bas/role", query);
}
/**
 * 新增-角色
 *
 * @param data
 * @returns
 */
export function saveRole(data: any) {
  return http.post<any, string>("/bas/role", data);
}

/**
 * 修改-角色
 *
 * @param data
 * @returns
 */
export function updateRole(data: any) {
  return http.put<any, any, string>("/bas/role", {}, data);
}

/**
 * 删除-角色
 *
 * @param id
 * @returns
 */
export function deleteRole(id: string) {
  return http.del<any, any, string>(`/bas/role`, { id: id });
}

/**
 * 分配权限
 *
 * @param id
 * @param permissionIds
 * @returns
 */
export function assignPermission(id: string, permissionIds: any) {
  return http.put<any, any, string>("/bas/role/grant", { id }, permissionIds);
}
