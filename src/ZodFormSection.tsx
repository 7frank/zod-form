import React, { useEffect, useMemo, useState } from 'react';
import { FocusError } from 'focus-formik-error';
import { useFormik } from 'formik';
import { ZodArray, ZodObject, ZodObjectDef, ZodRawShape } from 'zod';
import {
  FactoriesRecord,
  FactoryType,
  ZodFormFactories,
} from './ZodFormFactories';
import { toFormikValidationSchema } from 'zod-formik-adapter';
import { Missing } from './bits';
import { ZodFormikContainer } from './ZodFormikContainer';

export type GenericFormTranslation<T> = Record<
  keyof T,
  { label: string; description: string }
>;

export interface ZodFormSectionProps<S extends ZodRawShape, T> {
  disabled?: boolean;

  initialValues: Partial<T>;
  translation: GenericFormTranslation<T>;
  onValidate?: (isValid: boolean, values: T) => void;
  schema: ZodObject<S> | ZodArray<ZodObject<S>>;
  factories?: (defaults: FactoriesRecord<T>) => FactoriesRecord<T>;
  className?: string;
  sectionName: string;
}

/**
 * This form uses the translations to create one input field per translation element. You need to make sure that your translations match your zod-schema.
 * Note: This is no jack of all trades frm implementation. If any it is sufficient for nrarrow scenarios where flat objects contains enums, numbers, text, or boolean.
 *
 * This form should only provide input fields for top level schema keys.
 * Nested data is currently out-of-scope and should be created handled separately.
 *
 * TODO we could unify the S,T generic type parameters by either using a factory and infering the type as below or possibly other means
    e.g. type TestType = z.infer<typeof schema>;
 * TODO add sections = Record<string,{t,schema,title,description}>
 */
export function ZodFormSection<S extends ZodRawShape, T>({
  disabled = false,
  schema,
  initialValues = {},
  onValidate,
  translation,
  factories = () => ZodFormFactories,
  className,
  sectionName,
}: ZodFormSectionProps<S, T>) {
  const { registerSection } = ZodFormikContainer.useContainer();

  const formikValues = useFormik({
    validationSchema: toFormikValidationSchema(schema),
    initialValues: initialValues as T,
    onSubmit: (v) => {
      // Note: will not be used
    },
  });

  useEffect(() => {
    if (formikValues) registerSection(sectionName, { formik: formikValues });
  }, [formikValues]);

  // we currently only support forms that have an object shape as top level as other less complex forms are out of scope
  const canBeInitialized = schema._def.typeName == 'ZodObject';

  if (!canBeInitialized)
    return (
      <>Form cannot be initialized. Schema root node must be a zod-object</>
    );

  const _factories = factories({});
  // select a factory to render form elements
  function pickFromFactory(props: FactoryType<T>) {
    const f = _factories[props.type] ?? _factories['DEFAULT'];
    return f ? f(props) : <></>;
  }

  return (
    <form noValidate onSubmit={formikValues.handleSubmit}>
      <div className={className}>
        <FocusError formik={formikValues} />
        {Object.keys(translation).map((key, index) => {
          const name = key as keyof T;

          const shape = (schema._def as any)?.shape();

          // TODO leverage error rendering to options
          if (!shape[name]) {
            return <Missing name={name} />;
          }
          const _def = shape[name]._def;
          const type = (_def as ZodObjectDef<any, any, any>).typeName;
          const otherPotentialValues = _def.values;

          // TODO try to leverage this functionality to only occur when status changes onValidationStatusChange instead
          onValidate?.(formikValues.isValid, formikValues.values);

          return pickFromFactory({
            index,
            values: otherPotentialValues,
            type,
            disabled,
            label: translation[name].label,
            formikValues,
            name: name as any,
            placeholder: translation[name].description,
          });
        })}
      </div>
    </form>
  );
}
