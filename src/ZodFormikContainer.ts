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
      Object.entries(sections).map(([name, section]) =>
        section.formik.submitForm().then(() => {
          console.log('section ', name, section.formik.values);
          return section.formik.values;
        })
      )
    );
  }

  return { sections, registerSection, submitForm };
}

export const ZodFormikContainer = createContainer(useZodFormik);
