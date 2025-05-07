export enum FormFieldType {
  Select = "select",
  Search = "search",
  Text = "text",
}

export interface FormField {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  options?: { _id: string; name: string }[];
  type: FormFieldType;
  error?: boolean;
}
