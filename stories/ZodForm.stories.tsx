import React, { Props, useState } from 'react';
import { Meta, Story } from '@storybook/react';
import { ZodForm } from '../src';
import { ZodFormSection } from '../src/ZodFormSection';
import { z } from 'zod';
import { dummyFormTranslation } from '../src/utils';
import './index.css';

const meta: Meta = {
  title: 'Welcome',
  component: ZodFormSection,
  parameters: {},
};

export default meta;

const Template: Story = (args) => <div {...args} />;

// By passing using the Args format for exported stories, you can control the props for a component for reuse in a test
// https://storybook.js.org/docs/react/workflows/unit-testing
export const Default = Template.bind({});

Default.args = {};

const firstSchema = z.object({
  name: z.string().min(3),
  category: z.enum(['freelancer', 'student', 'company']),
  isActive: z.boolean(),
  numberOfParticipants: z.number().min(1),
});

const secondSchema = z.object({
  isCookieConsent: z.boolean(),
});

const firstSchemaTranslation = dummyFormTranslation(
  'name',
  'category',
  'isActive',
  'numberOfParticipants'
);

const secondSchemaTranslation = dummyFormTranslation('isCookieConsent');

export function AFormWithTwoSections() {
  const [data, setData] = useState();

  return (
    <>
      <ZodForm onSubmit={setData}>
        <ZodFormSection
          sectionName="section1"
          className="grid"
          disabled={false}
          initialValues={{
            name: '7frank',
            numberOfParticipants: 1,
            isActive: true,
            category: 'company',
          }}
          translation={firstSchemaTranslation}
          onValidate={console.log}
          schema={firstSchema}
        ></ZodFormSection>
        <ZodFormSection
          sectionName="section2"
          className="grid"
          disabled={false}
          initialValues={{}}
          translation={secondSchemaTranslation}
          onValidate={console.log}
          schema={secondSchema}
        ></ZodFormSection>
      </ZodForm>
      <pre> data: {JSON.stringify(data, null, '  ')}</pre>
    </>
  );
}
