interface FormItemProps {
  id?: string;
  org?: any;
  orgId?: string;
  roles?: Array<any>;
  roleIds?: Array<string>;
  posts?: Array<any>;
  postIds?: Array<string>;
  username?: string;
  nickname?: string;
  password?: string;
  confirmPassword?: string;
  phone?: string;
  email?: string;
  avatar?: string;
  gender?: number;
  system?: boolean;
  enabled?: boolean;
}
interface FormProps {
  formInline: FormItemProps;
  roleList: Array<any>;
  orgList: Array<any>;
  postList: Array<any>;
}

export type { FormItemProps, FormProps };
