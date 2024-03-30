import * as http from "../base";

/**
 * 商户识别码是否存在
 *
 * @param sysCode
 * @param id
 * @returns
 */
export function existsBySysCode(sysCode: string, id?: string) {
  return http.get<any, boolean>(`/tenant/org/existsBySysCode`, {
    sysCode: sysCode,
    id: id
  });
}
/**
 * 分页查询-商户
 *
 * @param query .
 * @returns
 */
export function pageTenant(query?: any) {
  return http.get<any, any>(`/tenant/org`, query);
}
/**
 * 保存-商户
 *
 * @param data
 * @returns
 */
export function saveTenant(data?: any) {
  return http.post<any, any>(`/tenant/org`, data);
}

/**
 * 更新-商户
 *
 * @param data
 * @returns
 */
export function updateTenant(data?: any) {
  return http.put<any, any, string>(`/tenant/org`, {}, data);
}

/**
 * 重置商户的超管密码
 * @param id .
 * @returns .
 */
export function resetPwdTenant(id: string) {
  return http.put<any, any, string>(`/tenant/org/resetPassword`, { id: id });
}

/**
 * 更新商户的相关配置
 *
 * @param data .
 * @returns .
 */
export function updateConfigTenant(data: any) {
  return http.put<any, any, string>(`/tenant/org/config`, {}, data);
}
