interface FormItemDictProps {
  id?: string;
  type?: string;
  name?: string;
  enabled?: boolean;
  description?: string;
}

interface FormItemDictItemProps {
  id?: string;
  dict?: FormItemDictProps;
  label?: string;
  value?: string;
  sort?: number;
  enabled?: boolean;
  description?: string;
}

interface FormDictProps {
  formInline: FormItemDictProps;
}

interface FormDictItemProps {
  formInline: FormItemDictItemProps;
}

export type {
  FormItemDictProps,
  FormItemDictItemProps,
  FormDictProps,
  FormDictItemProps
};
