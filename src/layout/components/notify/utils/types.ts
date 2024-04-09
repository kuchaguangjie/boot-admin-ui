interface Notice {
  id: string;
  title: string;
  content: string;
  created: string;
  createdBy: string;
  read: boolean;
}
interface FormProps {
  formInline: Notice;
}
export type { Notice, FormProps };
