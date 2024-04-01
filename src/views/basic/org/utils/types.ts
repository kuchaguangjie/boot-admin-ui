interface FormItemProps {
  id?: string;
  parentId?: string;
  name?: string;
  linkMan?: string;
  linkTel?: string;
  linkEmail?: string;
  address?: string;
  type?: number;
  memo?: string;
  system?: boolean;
  enabled?: boolean;
  saas?: boolean;
}

interface TableColumnsProps extends FormItemProps {
  hasChildren: boolean;
}
interface FormProps {
  formInline: FormItemProps;
}

export type { FormItemProps, TableColumnsProps, FormProps };
