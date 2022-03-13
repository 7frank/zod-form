import { FormikValues } from 'formik';
import { useState } from 'react';

import { createContainer } from 'unstated-next';

export type Section = {
  formik: FormikValues;
};

async function submitForm(sections: Record<string, Section>) {
  return Promise.all(
    Object.entries(sections).map(([name, section]) =>
      section.formik.submitForm().then(() => {
        return { section: name, values: section.formik.values };
      })
    )
  );
}

function useZodFormik() {
  let [sections, setSections] = useState<Record<string, Section>>({});
  const registerSection = (key: string, section: Section) =>
    (sections[key] = section);
  // setSections((s) => ({ ...s, [key]: section }));

  return { sections, registerSection, submitForm: () => submitForm(sections) };
}

export const ZodFormikContainer = createContainer(useZodFormik);
