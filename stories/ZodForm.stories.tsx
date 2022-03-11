import React, { Props } from 'react';
import { Meta, Story } from '@storybook/react';
import { ZodForm, ZodFormProps } from '../src';
import { z } from 'zod';
import { dummyFormTranslation } from '../src/utils';
import './index.css'

const meta: Meta = {
  title: 'Welcome',
  component: ZodForm,
  argTypes: {
    children: {
      control: {
        type: 'text',
      },
    },
  },
  parameters: {
    controls: { expanded: true },
  },
};

export default meta;

const Template: Story = (args) => <div {...args} />;

// By passing using the Args format for exported stories, you can control the props for a component for reuse in a test
// https://storybook.js.org/docs/react/workflows/unit-testing
export const Default = Template.bind({});

Default.args = {};

const exampleSchema = z.object({
  validFrom: z.string(),
  name: z.string(),
  category: z.enum(['first category', 'another category', 'more']),

  isActive: z.boolean(),
  numberOfParticipants: z.number(),
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
    <ZodForm
      className="grid grid-cols-6 gap-4 m-4"
      disabled={false}
      initialValues={{}}
      translation={routeFormTranslation}
      onSubmit={console.log}
      schema={exampleSchema}
    ></ZodForm>
  );
}
