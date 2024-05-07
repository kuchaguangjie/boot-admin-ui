import * as http from "../base";

/**
 * 岗位编码是否存在
 *
 * @param code
 * @param id
 * @returns
 */
export function existPostCode(code: string, id?: string) {
  return http.get<any, any>("/bas/post/exists/code", { code, id });
}

/**
 * 岗位分页
 * @param query .
 * @returns .
 */
export function postPage(query?: any) {
  return http.get<any, any>("/bas/post/page", query);
}

/**
 *  岗位列表
 *
 * @param query
 * @returns
 */
export function postList(query?: any) {
  return http.get<any, any>("/bas/post/list", query);
}

/**
 * 保存岗位
 *
 * @param data
 * @returns
 */
export function postSave(data: any) {
  return http.post<any, any>("/bas/post", data);
}

/**
 * 更新岗位
 *
 * @param data
 * @returns
 */
export function postUpdate(data: any) {
  return http.put<any, any, string>("/bas/post", {}, data);
}

/**
 * 删除岗位
 *
 * @param data
 * @returns
 */
export function postDelete(id: string) {
  return http.del<any, any, string>("/bas/post", { id });
}
