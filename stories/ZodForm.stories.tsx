import React, { Props } from 'react';
import { Meta, Story } from '@storybook/react';
import { ZodForm } from '../src';
import { ZodFormValues } from '../src/ZodFormValues';
import { z } from 'zod';
import { dummyFormTranslation } from '../src/utils';
import './index.css';

const meta: Meta = {
  title: 'Welcome',
  component: ZodFormValues,
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
  numberOfParticipants: z.number().min(2),
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


const secondSchemaTranslation = dummyFormTranslation(
  'isCookieConsent',

);

export function AnExampleForm() {
  return (
    <ZodForm>
      <ZodFormValues
        sectionName="section1"
        className="grid"
        disabled={false}
        initialValues={{category: 'company' }}
        translation={firstSchemaTranslation}
        onSubmit={console.log}
        schema={firstSchema}
      ></ZodFormValues>
    </ZodForm>
  );
}

/**
 *
 * @returns we might need a hook / context within ZodForm to trigger submit & partia validation
 */
export function AnFormWithTwoSections() {
  return (
    <ZodForm>
      <ZodFormValues
        sectionName="section1"
        className="grid"
        disabled={false}
        initialValues={{ category: 'company' }}
        translation={firstSchemaTranslation}
        onValidate={console.log}
        onSubmit={console.log}
        schema={firstSchema}
      ></ZodFormValues>
      <ZodFormValues
        sectionName="section2"
        className="grid"
        disabled={false}
        initialValues={{ }}
        translation={secondSchemaTranslation}
        onValidate={console.log}
        onSubmit={console.log}
        schema={secondSchema}
      ></ZodFormValues>
    </ZodForm>
  );
}
