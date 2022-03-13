import classnames from 'classnames';
import { FormikProps } from 'formik';
import React from 'react';
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
  const { indicateError, indicateSuccess } = computeFormElementState<T>(
    formikValues,
    name,
    disabled,
    true
  );
  return (
    <div key={index}>
      <label
        className={classnames({
          success: indicateSuccess,
          danger: indicateError,
          neutral: disabled,
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
        value={formikValues.values[name] as any}
      >
        {values?.map((value) => (
          <option value={value.toString()}>{value}</option>
        ))}
      </select>
      <div> {indicateError && <>{formikValues.errors[name]}</>} </div>
    </div>
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
    <div key={index}>
      <label
        className={classnames({
          success: indicateSuccess,
          danger: indicateError,
          neutral: disabled,
        })}
      >
        {label}
      </label>
      <input
        type="checkbox"
        disabled={disabled}
        name={name as any}
        onChange={(e) => {
          formikValues.setFieldValue(name.toString(), e.target?.checked);
        }}
        checked={Boolean(formikValues.values[name] as any)}
      />
      <div> {indicateError && <>{formikValues.errors[name]}</>} </div>
    </div>
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
    <div key={index}>
      <label
        className={classnames('text-sm font-bold', {
          success: indicateSuccess,
          danger: indicateError,
          neutral: disabled,
        })}
      >
        {label}
      </label>
      <input
        disabled={disabled}
        name={name as any}
        onChange={(e) => {
          const val = e.target?.value;
          formikValues.setFieldValue(
            name.toString(),
            type == 'ZodNumber' ? Number(val) : val
          );
        }}
        placeholder={placeholder}
        type={type == 'ZodNumber' ? 'number' : 'text'}
        value={formikValues.values[name] as any}
      />
      <div> {indicateError && <>{formikValues.errors[name]}</>} </div>
    </div>
  );
}
