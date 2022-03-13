import React, { ReactNode, useState } from 'react';


import {  FormikValues } from 'formik';
import { createContainer } from 'unstated-next';



type Section = {
  formik: FormikValues;
};

function useZodFormik() {
  let [sections, setSections] = useState<Record<string, Section>>({});
  const registerSection = (key: string, section: Section) =>
    setSections((s) => ({ ...s, [key]: section }));

  async function submitForm() {
    return Promise.all(
      Object.values(sections).map((section) => section.formik.submitForm())
    );
  }

  return { sections, registerSection, submitForm };
}

export const ZodFormikContainer = createContainer(useZodFormik);
interface ZodFormProps {
  children: ReactNode;
  onSubmit?: (values: any) => void;
  disabled?: boolean;
}

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
