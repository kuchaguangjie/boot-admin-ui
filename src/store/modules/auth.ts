import { storageLocal, storageSession } from "@pureadmin/utils";
import { defineStore } from "pinia";
import { store } from "..";
import * as authCache from "@/utils/auth";
import * as authRequest from "@/api/auth";
import { useMultiTagsStoreHook } from "./multiTags";
import { routerArrays } from "@/layout/types";
import router, { resetRouter } from "@/router";
import type { Result } from "@/api/base";

export type LoginRequest = {
  username: string;
  password: string;
  rememberMe: boolean;
  tenantLogin?: boolean;
};
/**
 * 认证与授权相关 cache
 */
export const useAuthStore = defineStore({
  id: "auth-store",
  state: () => ({
    loginUser: storageLocal().getItem("login_user") ?? {
      username: "",
      password: "",
      rememberMe: false
    },
    tenantLogin: storageSession().getItem(authCache.isTenantLoginKey) ?? false,
    userInfo: storageSession().getItem(authCache.userKey),
    tenantInfo: storageSession().getItem(authCache.tenantKey),
    sysCode: storageSession().getItem(authCache.sysCode),
    accessToken: storageSession().getItem(authCache.tokenKey)
  }),
  getters: {
    getUserInfo(state): any | undefined | null {
      return state.userInfo;
    },
    getAccessToken(state): string | null {
      return state.accessToken;
    },
    getSysCode(state): string | null {
      return state.userInfo?.sysCode;
    },
    getTenantInfo(state): any | undefined | null {
      return state.tenantInfo;
    },
    getPermissions(state): string[] | undefined | null {
      return state.userInfo?.permissions;
    },
    getRoles(state): string[] | undefined | null {
      return state.userInfo?.roles;
    }
  },
  actions: {
    SET_USERINFO(userInfo: any) {
      this.userInfo = userInfo;
    },
    SET_ACCESS_TOKEN(accessToken: string) {
      this.accessToken = accessToken;
    },
    SET_IS_LOGIN_TENANT(tenantLogin?: boolean) {
      this.tenantLogin = tenantLogin;
    },
    SET_TENANT_INFO(tenantInfo: any) {
      this.tenantInfo = tenantInfo;
    },
    _cacheRememberMe(data: LoginRequest) {
      if (data.rememberMe) {
        storageLocal().setItem("login_user", data);
        this.loginUser = data;
      } else {
        storageLocal().removeItem("login_user");
        this.loginUser = {
          username: "",
          password: "",
          rememberMe: false
        };
      }
    },
    /**
     * 登录
     * @param data 登录信息
     */
    login(data: LoginRequest): Promise<any> {
      this._cacheRememberMe(data);
      return authRequest
        .login(data.username, data.password, data.tenantLogin)
        .then((res: Result<any>) => {
          if (res.success) {
            this.SET_USERINFO(res.data);
            this.SET_ACCESS_TOKEN(res.data.token);
            this.SET_IS_LOGIN_TENANT(data.tenantLogin);
            this.SET_TENANT_INFO(res.data.tenantInfo);

            authCache.saveTenantInfo(res.data.tenantInfo);
            authCache.saveAuth(res.data);
            authCache.saveAccessToken(res.data.token);
            if (!data.tenantLogin) {
              authCache.saveSysCode(res.data.sysCode);
            }
          }
          return res;
        });
    },
    async refreshUserInfo() {
      return authRequest.getUserInfo().then(res => {
        if (res.success) {
          this.SET_USERINFO(res.data);
          authCache.saveAuth(res.data);
        }
        return res;
      });
    },
    /**
     * 注销,清空缓存
     */
    async logout() {
      const res = await authRequest.logout();
      const { code } = res;
      if (code === 200 || code === 401) {
        authCache.clearAuth();
        useMultiTagsStoreHook().handleTags("equal", [...routerArrays]);
        resetRouter();
        router.push("/login");
        //刷新
        window.location.reload();
      }
    }
  }
});

export function useAuthStoreHook() {
  return useAuthStore(store);
}
