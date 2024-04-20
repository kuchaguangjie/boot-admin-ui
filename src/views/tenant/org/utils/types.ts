interface FormItemProps {
  id?: string;
  name?: string;
  sysCode?: string;
  linkMan?: string;
  linkTel?: string;
  linkEmail?: string;
  address?: string;
  productId?: string;
  usedEndTime?: string;
  product?: any;
  memo?: string;
  enabled?: boolean;
}

interface FormProps {
  formInline: FormItemProps;
}

interface BasicConfigFormIemProps {
  id?: string;
  usedEndTime?: string;
}

interface BasicConfigFormProps {
  formInline: BasicConfigFormIemProps;
}

export type {
  FormItemProps,
  FormProps,
  BasicConfigFormIemProps,
  BasicConfigFormProps
};
