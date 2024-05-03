import * as http from "../base";

/**
 * 分页查询
 *
 * @param query
 * @returns
 */
export function pageUser(query?: any) {
  return http.get<any, any>("/bas/user", query);
}

/**
 * 账户是否存在
 *
 * @param username
 * @param id
 * @returns
 */
export function existsByUsername(username: string, id?: string) {
  return http.get<any, any>("/bas/user/existsByUsername", { username, id });
}

/**
 * 保存用户
 *
 * @param data
 * @returns
 */
export function saveUser(data: any) {
  return http.post<any, string>(`/bas/user`, data);
}

/**
 * 修改用户
 *
 * @param data
 * @returns
 */
export function updateUser(data: any) {
  return http.put<any, any, string>(`/bas/user`, {}, data);
}
/**
 * 重置密码
 *
 * @param data
 * @returns
 */
export function resetPassword(data: any) {
  return http.put<any, any, string>(`/bas/user/restPassword`, {}, data);
}

/**
 *  删除用户
 *
 * @param id
 * @returns
 */
export function deleteUser(id: string) {
  return http.del<any, any, string>(`/bas/user`, { id });
}
