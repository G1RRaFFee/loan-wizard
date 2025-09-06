import { type JSX, type ReactNode, useId } from "react";

import { FieldError, FieldErrorsImpl, Merge } from "react-hook-form";

import { FieldErrorText } from "@/components";

type FieldErrorType = FieldError | Merge<FieldError, FieldErrorsImpl<any>>;

interface FormFieldProps {
  label: string;
  children: ReactNode;
  error?: FieldErrorType;
  required?: boolean;
  helpText?: string;
  id?: string;
}

export const FormField = ({
  label,
  children,
  error,
  required = false,
  helpText,
  id: providedId,
}: FormFieldProps): JSX.Element => {
  const generatedId = useId();
  const fieldId = providedId || generatedId;
  const helpId = helpText ? `${fieldId}-help` : undefined;
  const errorId = error ? `${fieldId}-error` : undefined;

  return (
    <div className="form-group">
      <label htmlFor={fieldId} className="form-label">
        {label}
        {required && (
          <span className="text-danger ms-1" aria-label="обязательное поле">
            *
          </span>
        )}
      </label>
      <div>
        {children}
        {helpText && (
          <div id={helpId} className="form-text">
            {helpText}
          </div>
        )}
        <FieldErrorText error={error} id={errorId} />
      </div>
    </div>
  );
};
