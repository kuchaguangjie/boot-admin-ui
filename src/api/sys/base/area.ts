import * as http from "../../base";

/**
 * 获取地区树
 *
 * @returns
 */
export function areaTree() {
  return http.get<any, any>("sys/area/tree");
}
/**
 * 地区分页查询
 *
 * @param query .
 * @returns .
 */
export function areaPage(query?: any) {
  return http.get<any, any>("sys/area/page", query);
}

/**
 *  地区列表查询
 *
 * @param query
 * @returns
 */
export function areaList(query?: any) {
  return http.get<any, any>("sys/area/list", query);
}

/**
 * 保存地区
 *
 * @param data
 * @returns
 */
export function saveArea(data: any) {
  return http.post<any, any>("sys/area", data);
}

/**
 * 更新地区
 *
 * @param data
 * @returns
 */
export function updateArea(data: any) {
  return http.put<any, any, any>("sys/area", {}, data);
}

/**
 * 删除地区
 *
 * @param data
 * @returns
 */
export function deleteArea(id: any) {
  return http.del<any, any, any>("sys/area", { id }, {});
}
