interface FormItemProps {
  /** 主键 */
  id?: string;
  /** 岗位编号 */
  code?: string;
  /** 岗位名称 */
  name?: string;
  /** 岗位描述 */
  description?: string;
  /** 排序 */
  sort?: number;
  /** 是否启用 */
  enabled?: boolean;
}

interface FormProps {
  formInline: FormItemProps;
}

export type { FormItemProps, FormProps };
