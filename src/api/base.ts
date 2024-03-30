import { http } from "@/utils/http";

/**
 * 通用响应
 */
export interface Result<T> {
  code: number;
  message: string;
  data: T;
  success: boolean;
  timestamp: number;
}
/**
 * 通用拉下选择
 */
export interface SelectOption {
  label: string;
  value: string;
}
/**
 * 通用分页请求
 */
export interface BasePageQuery {
  /**
   * 分页大小
   */
  size?: number;
  /**
   * 当前页
   */
  current?: number;
}

/**
 *
 * post method
 *
 * @param url 请求地址
 * @param data 请求参数
 * @returns Promise<Result<P>>
 */
export function post<E, T>(url: string, data?: E): Promise<Result<T>> {
  return http.post<E, Result<T>>(url, { data: data });
}

/**
 * get method
 * @param url 请求地址
 * @param params 请求参数
 * @returns Promise<Result<P>>
 */
export function get<Q, T>(url: string, params?: Q): Promise<Result<T>> {
  return http.get<Q, Result<T>>(url, { params });
}

/**
 * put
 * @param url path
 * @param params query
 * @param data body
 * @returns .
 */
export function put<Q, E, T>(
  url: string,
  params?: Q,
  data?: E
): Promise<Result<T>> {
  return http.request("put", url, { params: params, data: data });
}
/**
 * delete
 * @param url .
 * @param params .
 * @param data .
 * @returns .
 */
export function del<Q, E, T>(
  url: string,
  params?: Q,
  data?: E
): Promise<Result<T>> {
  return http.request("delete", url, { params: params, data: data });
}
