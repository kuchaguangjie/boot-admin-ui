import { RSA } from "@/utils/crypto";
import * as http from "@/api/base";
import { useAuthStoreHook } from "@/store/modules/auth";
/**
 * 登录
 *
 * @param username 用户名
 * @param password 密码
 * @param tenantLogin 管理端登录
 * @returns
 */
export function login(username: string, password, tenantLogin?: boolean) {
  // password en
  const _pwd = RSA.loginEncrypt(password);
  return http.post("/auth/login", {
    username,
    password: _pwd,
    tenantLogin: tenantLogin
  });
}

/**
 * 获取当前用户信息
 * @returns
 */
export function getUserInfo(): Promise<http.Result<any>> {
  return http.get("/auth/info");
}
/**
 * 注销登出
 *
 * @returns .
 */
export function logout() {
  return http.post<any, string>("/auth/logout");
}

/**
 * 当前用户的routes
 */
export const currentRoutes = () => {
  //区分管理端与履约端
  const tenantId = useAuthStoreHook().getTenantId;
  if (tenantId) {
    return http.get<any, any>("/bas/permission/current/routes", { tenantId });
  }
  return http.get<any, any>("/sys/permission/current/routes");
};
