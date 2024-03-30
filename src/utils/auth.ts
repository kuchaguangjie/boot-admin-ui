import { storageSession } from "@pureadmin/utils";
import Cookies from "js-cookie";
/**
 * 通过`multiple-tabs`是否在`cookie`中，判断用户是否已经登录系统，
 * 从而支持多标签页打开已经登录的系统后无需再登录。
 * 浏览器完全关闭后`multiple-tabs`将自动从`cookie`中销毁，
 * 再次打开浏览器需要重新登录系统
 * */
export const multipleTabsKey = "multiple-tabs";
export const userKey = "user-info";
export const tokenKey = "user-token";
export const tenantKey = "user-tenant";
export const isTenantLoginKey = "tenant-login";

/**
 * 规范token
 * @param token token
 * @returns 格式化后的token
 */
export const formatToken = (token: string) => {
  return token;
};

/**
 *  保存 auth
 * @param auth .
 */
export const saveAuth = (auth: any) => {
  Cookies.set(multipleTabsKey, "true", {
    expires: 7
  });
  storageSession().setItem(userKey, auth);
};

export const saveAccessToken = (token: string) => {
  storageSession().setItem(tokenKey, token);
};
export const isTenantLogin = (tenantLogin: string) => {
  return storageSession().setItem(isTenantLoginKey, tenantLogin);
};
export const saveTenantKey = (data: string) => {
  return storageSession().setItem(tenantKey, data);
};

/**
 * 清理 auth 相关缓存
 */
export const clearAuth = () => {
  Cookies.remove(multipleTabsKey);
  storageSession().removeItem(tokenKey);
  storageSession().removeItem(userKey);
  storageSession().removeItem(tenantKey);
  storageSession().removeItem(isTenantLoginKey);
};
