import * as http from "../base";

/**
 * 字典分页查询
 * @param query .
 * @returns .
 */
export function pageDict(query?: any) {
  return http.get<any, any>(`/sys/dict/page`, query);
}

/**
 * 字典列表
 * @param query .
 * @returns
 */
export function listDict(query?: any) {
  return http.get<any, any>(`/sys/dict`, query);
}

/**
 * 字典保存
 * @param data .
 * @returns .
 */
export function saveDict(data: any) {
  return http.post<any, any>(`/sys/dict`, data);
}

/**
 * 字典更新
 * @param data .
 * @returns .
 */
export function updateDict(data: any) {
  return http.put<any, any, string>(`/sys/dict`, {}, data);
}

/**
 * 字典删除
 * @param id .
 * @returns .
 */
export function delDict(id: string) {
  return http.del<any, any, string>(`/sys/dict`, { id });
}

/**
 * 字典项分页查询
 *
 * @param query .
 * @returns
 */
export function pageDictItem(query?: any) {
  return http.get<any, any>(`/sys/dict/item/page`, query);
}

/**
 * 字典项列表
 *
 * @param query .
 * @returns
 */
export function listDictItem(query?: any) {
  return http.get<any, any>(`/sys/dict/item`, query);
}

/**
 * 字典项保存
 *
 * @param data .
 * @returns
 */
export function saveDictItem(data: any) {
  return http.post<any, any>(`/sys/dict/item`, data);
}

/**
 * 字典项更新
 *
 * @param data .
 * @returns
 */
export function updateDictItem(data: any) {
  return http.put<any, any, string>(`/sys/dict/item`, {}, data);
}

/**
 * 字典项删除
 *
 * @param id .
 * @returns
 */
export function delDictItem(id: string) {
  return http.del<any, any, string>(`/sys/dict/item`, { id });
}
