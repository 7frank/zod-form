import React, { ReactNode } from 'react';

import { ZodFormikContainer } from './ZodFormikContainer';

export interface ZodFormProps {
  children: ReactNode;
  onSubmit?: (values: any) => void;
  disabled?: boolean;
}

export function ZodFormInner({
  children,
  onSubmit,
  disabled = false,
}: ZodFormProps) {
  const { sections, submitForm } = ZodFormikContainer.useContainer();

  return (
    <>
      {children}
      {!disabled && (
        <div className="flex items-center justify-between m-4">
          <span></span>
          <button
            type="submit"
            onClick={(e) => {
              e.preventDefault();
              submitForm().then(onSubmit).catch(console.error);
            }}
          >
            Absenden
          </button>{' '}
          Connected forms: {Object.keys(sections).join(',')}
        </div>
      )}
    </>
  );
}
