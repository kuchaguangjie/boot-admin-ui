interface FormItemProps {
  id?: string;
  code?: string;
  name?: string;
  principal?: string;
  contact?: string;
  siteNum?: number;
  accountNum?: number;
  enabled?: boolean;
  description?: string;
}

interface FormProps {
  formInline: FormItemProps;
}

export type { FormItemProps, FormProps };
