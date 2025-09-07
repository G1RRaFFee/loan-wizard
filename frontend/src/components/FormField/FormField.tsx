import {
  type JSX,
  type ReactNode,
  cloneElement,
  isValidElement,
  useId,
} from "react";

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

  const describedBy = [helpId, errorId].filter(Boolean).join(" ") || undefined;

  const child = isValidElement(children)
    ? cloneElement(children as React.ReactElement, {
        id: (children as any).props?.id ?? fieldId,
        "aria-describedby":
          [(children as any).props?.["aria-describedby"], describedBy]
            .filter(Boolean)
            .join(" ") || undefined,
      })
    : children;

  return (
    <div className="form-group">
      <label htmlFor={fieldId} className="form-label">
        {label}
        {required && (
          <span
            className="text-danger ms-1"
            title="обязательное поле"
            aria-hidden="true"
            role="presentation"
          >
            *
          </span>
        )}
      </label>
      <div>
        {child}
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
