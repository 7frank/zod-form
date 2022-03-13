import React, { ReactNode } from 'react';

import { ZodFormInner } from './ZodFormInner';
import { ZodFormikContainer } from './ZodFormikContainer';

export interface ZodFormProps {
  children: ReactNode;
  onSubmit?: (values: any) => void;
  disabled?: boolean;
}

// TODO additional functionality - have alternative implementation with multiple form steps
// TODO additional functionality - have local storage keep a backup & state until form is actually submitted & invalidated by providiing onChange & onRestore callbacks

// each schema/translation
// create form and keep handle
// on submit button click trigger validateForm on each

export function ZodForm(props: ZodFormProps) {
  return (
    <ZodFormikContainer.Provider>
      <ZodFormInner {...props}></ZodFormInner>
    </ZodFormikContainer.Provider>
  );
}
