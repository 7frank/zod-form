import React from 'react';

import { ZodFormInner, ZodFormProps } from './ZodFormInner';
import { ZodFormikContainer } from './ZodFormikContainer';

export function ZodForm(props: ZodFormProps) {
  return (
    <ZodFormikContainer.Provider>
      <ZodFormInner {...props}></ZodFormInner>
    </ZodFormikContainer.Provider>
  );
}
