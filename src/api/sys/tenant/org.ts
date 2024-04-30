import * as http from "../../base";

/**
 * 商户识别码是否存在
 *
 * @param sysCode
 * @param id
 * @returns
 */
export function existsBySysCode(sysCode: string, id?: string) {
  return http.get<any, boolean>(`/sys/tenant/org/existsBySysCode`, {
    sysCode: sysCode,
    id: id
  });
}

/**
 * 列表查询-商户
 *
 * @param query
 * @returns
 */
export function tenantList(query?: any) {
  return http.get<any, any>("/sys/tenant/org/list", query);
}
/**
 * 分页查询-商户
 *
 * @param query .
 * @returns
 */
export function pageTenant(query?: any) {
  return http.get<any, any>(`/sys/tenant/org`, query);
}
/**
 * 保存-商户
 *
 * @param data
 * @returns
 */
export function saveTenant(data?: any) {
  return http.post<any, any>(`/sys/tenant/org`, data);
}

/**
 * 更新-商户
 *
 * @param data
 * @returns
 */
export function updateTenant(data?: any) {
  return http.put<any, any, string>(`/sys/tenant/org`, {}, data);
}

/**
 * 重置商户的超管密码
 * @param id .
 * @returns .
 */
export function resetPwdTenant(id: string) {
  return http.put<any, any, string>(`/sys/tenant/org/resetPassword`, {
    id: id
  });
}

/**
 *  获取商户的基础配置
 *
 * @param id
 * @returns
 */
export function getBasicConfigTenant(id: string) {
  return http.get<any, any>(`/sys/tenant/org/basic/config`, { id: id });
}

/**
 * 更新商户的相关配置
 *
 * @param data .
 * @returns .
 */
export function updateBasicConfigTenant(data: any) {
  return http.put<any, any, string>(`/sys/tenant/org/basic/config`, {}, data);
}

/**
 *
 * 获取商户的oss配置
 *
 * @param sysCode
 */
export function getOssConfig(sysCode: string) {
  return http.get<any, any>("/sys/tenant/oss/config", { sysCode: sysCode });
}

/**
 *  更新商户的oss配置
 *
 * @param data .
 * @returns .
 */
export function updateOssConfig(data: any) {
  return http.put<any, any, string>(`/sys/tenant/oss/config`, {}, data);
}
