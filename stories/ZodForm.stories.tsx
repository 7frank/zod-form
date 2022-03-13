import React, { Props } from 'react';
import { Meta, Story } from '@storybook/react';
import { ZodForm, ZodFormValues } from '../src';
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

const exampleSchema = z.object({
  name: z.string().min(3),
  category: z.enum(['first category', 'another category', 'other']),
  isActive: z.boolean(),
  numberOfParticipants: z.number().min(2),
});

type ExampleType = z.infer<typeof exampleSchema>;

const routeFormTranslation = dummyFormTranslation(
  'validFrom',
  'name',

  'category',
  'isActive',
  'numberOfParticipants'
);

export function AnExampleForm() {
  return (
    <ZodForm>
      <ZodFormValues
        className="grid"
        disabled={false}
        initialValues={{ category: 'other' }}
        translation={routeFormTranslation}
        onSubmit={console.log}
        schema={exampleSchema}
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
        className="grid"
        disabled={false}
        initialValues={{ category: 'other' }}
        translation={routeFormTranslation}
        onValidate={console.log}
        onSubmit={console.log}
        schema={exampleSchema}
      ></ZodFormValues>
      <ZodFormValues
        className="grid"
        disabled={false}
        initialValues={{ category: 'first category' }}
        translation={routeFormTranslation}
        onValidate={console.log}
        onSubmit={console.log}
        schema={exampleSchema}
      ></ZodFormValues>
    </ZodForm>
  );
}
