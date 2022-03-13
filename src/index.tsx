import React, { ReactNode, useEffect, useState } from 'react';

import { ConnectedFocusError, FocusError } from 'focus-formik-error';
import { Formik, FormikValues, useFormik } from 'formik';
import { createContainer } from 'unstated-next';
import { ZodArray, ZodObject, ZodObjectDef, ZodRawShape } from 'zod';
import {
  FactoriesRecord,
  FactoryType,
  ZodFormFactories,
} from './ZodFormFactories';

import { toFormikValidationSchema } from 'zod-formik-adapter';
import { Missing } from './bits';

export type GenericFormTranslation<T> = Record<
  keyof T,
  { label: string; description: string }
>;

export interface ZodFormValuesProps<S extends ZodRawShape, T> {
  disabled?: boolean;

  initialValues: Partial<T>;
  translation: GenericFormTranslation<T>;
  onValidate?: (isValid: boolean, values: T) => void;
  schema: ZodObject<S> | ZodArray<ZodObject<S>>;
  factories?: (defaults: FactoriesRecord<T>) => FactoriesRecord<T>;
  className?: string;
  onSubmit?: (values: any) => void;
}

type Section = {
  formik: FormikValues;
};

function useZodFormik() {
  let [sections, setSections] = useState<Record<string, Section>>({});
  const registerSection = (key: string, section: Section) =>
    setSections({ ...sections, [key]: section });

  return { sections, registerSection };
}

const ZodFormikContainer = createContainer(useZodFormik);
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
export function ZodFormValues<S extends ZodRawShape, T>({
  disabled = false,
  schema,
  initialValues = {},
  onValidate,
  translation,
  factories = () => ZodFormFactories,
  className,
  onSubmit,
}: ZodFormValuesProps<S, T>) {
  const { registerSection } = ZodFormikContainer.useContainer();

  const formikValues = useFormik({
    validationSchema: toFormikValidationSchema(schema),
    initialValues: initialValues as T,
    onSubmit: (v) => {
      onSubmit?.(v);
    },
  });

  useEffect(() => {
    if (formikValues) registerSection('key1', formikValues);
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
  const { sections } = ZodFormikContainer.useContainer();

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
            }}
          >
            Absenden
          </button>{' '}
          Connected forms: {Object.keys(sections).length}
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
