export const formField = {
  isEditingName: 'isEditingName',
  isEditingEmail: 'isEditingEmail',
} as const;

export type FormFieldType = (typeof formField)[keyof typeof formField];
