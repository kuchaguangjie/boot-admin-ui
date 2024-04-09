interface FormItemProps {
  id?: string;
  title?: string;
  content?: string;
  enabled?: boolean;
  noticeTime?: any;
  noticeTimeStart?: string;
  noticeTimeEnd?: string;
  orgIds?: Array<String>;
  orgId?: string;
}
interface FormProps {
  formInline: FormItemProps;
  tenantOrgList: Array<any>;
}

export type { FormItemProps, FormProps };
