interface FormItemProps {
  id?: string;
  /** 角色名称 */
  name: string;
  /** 角色编号 */
  code: string;
  /** 数据权限 */
  dataScope?: number;
  /**数据范围 */
  orgIds?: string[];
  /** 是否启用 */
  enabled?: boolean;
  /** 备注 */
  description: string;
}
interface FormProps {
  formInline: FormItemProps;
}

export type { FormItemProps, FormProps };
