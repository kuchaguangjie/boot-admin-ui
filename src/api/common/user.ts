import * as http from "../base";

/**
 *  获取当前用户信息
 * @returns
 */
export function getCurrentUserInfo() {
  return http.get<any, any>("/common/user");
}
/**
 * 修改用户信息
 *
 * @param data
 * @returns
 */
export function changeUserInfo(data: any) {
  return http.put<any, any, string>("/common/user", {}, data);
}

/**
 * 修改密码
 *
 * @param data
 * @returns
 */
export function changePassword(data: any) {
  return http.put<any, any, string>("/common/user/password", {}, data);
}

/**
 *  修改头像
 * @param url .
 * @returns
 */
export function changeAvatar(url: string) {
  return http.put<any, any, string>("/common/user/avatar", { avatarUrl: url });
}
