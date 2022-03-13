# zod-form

Generate forms from zod.js schemas

Note: forms are hard - only a case study as of now

see it in action at https://7frank.github.io/zod-form/?path=/docs/welcome--a-form-with-two-sections

```typescript
const firstSchema = z.object({
  name: z.string().min(3),
  category: z.enum(['freelancer', 'student', 'company']),
  isActive: z.boolean(),
  numberOfParticipants: z.number().min(1),
});

const firstSchemaTranslation = dummyFormTranslation(
  'name',
  'category',
  'isActive',
  'numberOfParticipants'
);

export function AFormWithTwoSections() {
  const [data, setData] = useState();
  return (
    <>
      <ZodForm onSubmit={setData}>
        <ZodFormSection
          sectionName="section1"
          disabled={false}
          initialValues={{}}
          translation={firstSchemaTranslation}
          schema={firstSchema}
          factories={() => ZodFormFactories},
        ></ZodFormSection>
      </ZodForm>
      <pre> data: {JSON.stringify(data, null, '  ')}</pre>
    </>
  );
}
```

override the default cell factories with your own implementation via

```
  ...
  factories={() => ZodFormFactories},
  ...
```

# Development

[Development](./Development.md)
