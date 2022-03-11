import { FormikValues } from 'formik';

type Severity = 'success' | 'danger' | undefined;

export function computeFormElementState<T>(
  { touched, submitCount, errors }: FormikValues,
  name: keyof T,
  disabled?: boolean,
  strictType: boolean = false
): {
  severity: Severity;
  indicateSuccess: boolean;
  indicateError: boolean;
} {
  const shouldValidate = touched[name] || submitCount > 0;

  const hasError = strictType
    ? errors[name] !== undefined
    : errors[name] != undefined;

  function isValid() {
    return !disabled ? shouldValidate && !hasError : false;
  }

  function isInvalid() {
    return !disabled ? shouldValidate && hasError : false;
  }

  return {
    severity: !shouldValidate ? undefined : isValid() ? 'success' : 'danger',
    indicateSuccess: isValid(),
    indicateError: isInvalid(),
  };
}

export function dummyFormTranslation<T = object>(
  ...keys: (keyof T)[]
): Record<keyof T, { label: string; description: string }> {
  const res: any = {};

  keys.forEach((k) => {
    res[k] = {
      label: k,
      description: 'enter a ' + k,
    };
  });

  return res;
}
