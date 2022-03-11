import classnames from 'classnames';
import { FormikProps } from 'formik';
import React, { Fragment } from 'react';
import { ReactNode } from 'react';
import { ZodFirstPartyTypeKind } from 'zod';
import { computeFormElementState } from './utils';

export type FactoryType<T> = {
  index: number;
  disabled?: boolean;
  label: ReactNode;
  placeholder?: string;
  formikValues: FormikProps<T>;
  name: keyof T;
  /**
   * Potential values. For now only string | number are supported.
   */
  values?: (string | number)[];
  type: ZodFirstPartyTypeKind;
};

export type FactoriesRecord<T> = Partial<
  Record<
    ZodFirstPartyTypeKind | 'DEFAULT',
    (props: FactoryType<T>) => ReactNode
  >
>;

export const ZodFormFactories = {
  DEFAULT: defaultCellFactory,
  ZodEnum: enumCellFactory,
  ZodBoolean: booleanCellFactory,
};

export function enumCellFactory<T extends {}>({
  formikValues,
  index,
  label,
  name,
  type,
  disabled,
  placeholder,
  values,
}: FactoryType<T>) {
  const { severity } = computeFormElementState<T>(formikValues, name, disabled);
  const { indicateError, indicateSuccess } = computeFormElementState<T>(
    formikValues,
    name,
    disabled,
    true
  );
  return (
    <Fragment key={index}>
      <label
        className={classnames('block text-gray-700 text-sm font-bold mb-2', {
          'text-lime-600': indicateSuccess,
          'text-red-600': indicateError,
          'text-gray-400': disabled,
        })}
      >
        {label}
      </label>
      <select
        disabled={disabled}
        placeholder={placeholder}
        name={name as any}
        onChange={(e) => {
          formikValues.setFieldValue(name.toString(), e.target?.value);
        }}
        severity={severity}
        value={formikValues.values[name] as any}
      >
        {values?.map((value) => (
          <option value={value.toString()}>{value}</option>
        ))}
      </select>
    </Fragment>
  );
}

export function booleanCellFactory<T extends {}>({
  formikValues,
  index,
  label,
  name,
  type,
  disabled,
  placeholder,
  values,
}: FactoryType<T>) {
  const { indicateError, indicateSuccess } = computeFormElementState<T>(
    formikValues,
    name,
    disabled,
    true
  );
  return (
    <Fragment key={index}>
      <label
        className={classnames('block text-gray-700 text-sm font-bold mb-2', {
          'text-lime-600': indicateSuccess,
          'text-red-600': indicateError,
          'text-gray-400': disabled,
        })}
      >
        {label}
      </label>
      <input
        type="checkbox"
        className={
          'shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
        }
        key={index}
        disabled={disabled}
        name={name as any}
        onChange={(e) => {
          formikValues.setFieldValue(name.toString(), e.target?.checked);
        }}
      />
    </Fragment>
  );
}

/**
 * This is our default form element factory, which is used when no other factory is specified.
 */
export function defaultCellFactory<T extends {}>({
  formikValues,
  index,
  label,
  name,
  type,
  disabled,
  placeholder,
  values,
}: FactoryType<T>) {
  const { indicateError, indicateSuccess } = computeFormElementState<T>(
    formikValues,
    name,
    disabled,
    true
  );

  return (
    <Fragment key={index}>
      <label
        className={classnames('text-sm font-bold', {
          'text-lime-600': indicateSuccess,
          'text-red-600': indicateError,
          'text-gray-400': disabled,
        })}
      >
        {label}
      </label>
      <input
        key={index}
        disabled={disabled}
        name={name as any}
        onChange={(e) => {
          formikValues.setFieldValue(name.toString(), e.target?.checked);
        }}
        placeholder={placeholder}
        type={type == 'ZodNumber' ? 'number' : 'text'}
      />
    </Fragment>
  );
}
