interface FormItemProps {
  id?: number;
  code?: string;
  name?: string;
  principal?: string;
  contact?: string;
  enabled?: boolean;
  description?: string;
}

interface FormProps {
  formInline: FormItemProps;
}

export type { FormItemProps, FormProps };
