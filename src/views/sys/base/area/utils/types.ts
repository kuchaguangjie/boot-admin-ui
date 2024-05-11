interface FormItemProps {
  /**
   * 主键
   */
  id?: string;
  /**
   * 父主键
   */
  parentId?: string;
  /**
   * 名称
   */
  name?: string;
  /**
   * 编码
   */
  code?: string;
  /**
   * 状态
   */
  enabled?: boolean;
  /**
   * 备注
   */
  remark?: string;
}
/**
 * 树形数据
 */
interface TreeData extends FormItemProps {
  /**
   * 是否有子节点
   */
  hasChildren?: boolean;
  /**
   * 子节点
   */
  children?: TreeData[];
}

/**
 * 表单属性
 */
interface FormProps {
  formInline: FormItemProps;
}

export type { FormItemProps, TreeData, FormProps };
