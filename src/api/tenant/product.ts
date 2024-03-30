import * as http from "../base";

/**
 * code是否存在
 *
 * @param code code
 * @param id 需要排除的ID
 * @returns
 */
export function existsByCode(code: string, id?: number) {
  return http.get<any, boolean>("/sys/product/existsByCode", {
    code: code,
    id: id
  });
}
/**
 * 产品-分页查询
 *
 * @param query
 * @returns
 */
export function pageProduct(query?: any) {
  return http.get<any, any>("/sys/product", query);
}
/**
 * 列表查询
 *
 * @param query .
 * @returns
 */
export function listProduct(query?: any) {
  return http.get<any, any>("/sys/product/list", query);
}

/**
 * 产品-保存
 *
 * @param data
 * @returns
 */
export function saveProduct(data: any) {
  return http.post<any, any>("/sys/product", data);
}

/**
 * 产品-更新
 *
 * @param data
 * @returns
 */
export function updateProduct(data: any) {
  return http.put<any, any, string>("/sys/product", {}, data);
}

/**
 * 产品-删除
 *
 * @param id
 * @returns
 */
export function deleteProduct(id: number) {
  return http.del<any, any, string>("/sys/product", { id: id });
}

/**
 * 产品-授权
 *
 * @param data
 * @returns
 */
export function grantProduct(id: number, data: any) {
  return http.put<any, any, string>(`/sys/product/grant`, { id: id }, data);
}
