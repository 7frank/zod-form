import { FormikValues } from 'formik';
import { useState } from 'react';

import { createContainer } from 'unstated-next';

export type Section = {
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
