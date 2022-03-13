import React from 'react';
import { ZodFormProps } from './index';
import { ZodFormikContainer } from './ZodFormikContainer';

/**
 * Example form wrapper. use ZodFormValues
 
 */

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
              submitForm();
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
