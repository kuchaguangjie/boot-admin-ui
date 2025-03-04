type FormItemProps = {
  id?: number;
  jobName?: string;
  jobClassName?: string;
  parameter?: string;
  cronExpression?: string;
  sysCode?: string;
  enabled?: boolean;
  description?: string;
};
interface FormItem {
  formInline: FormItemProps;
}

export type { FormItem, FormItemProps };
