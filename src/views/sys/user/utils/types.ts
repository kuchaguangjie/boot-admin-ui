interface FormItemProps {
  id?: string;
  roles?: any[];
  roleList?: any[];
  roleIds?: number[];
  /**
   * 用户名
   */
  username?: string;
  /**
   * 密码
   */
  password?: string;
  /**
   * 确认密码
   */
  confirmPassword?: string;
  /**
   * 昵称
   */
  nickname?: string;
  /**
   * 邮箱
   */
  email?: string;
  /**
   * 手机号
   */
  phone?: string;
  /**
   * 性别
   */
  gender?: number;
  /**
   * 头像
   */
  avatar?: string;
  /**
   * 是否管理员
   */
  admin?: boolean;
  /**
   * 状态
   * <p>
   */
  enabled?: boolean;
}
interface FormProps {
  formInline: FormItemProps;
}

export type { FormItemProps, FormProps };
