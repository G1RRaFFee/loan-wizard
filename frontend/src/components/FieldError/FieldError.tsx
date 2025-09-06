import { type JSX } from "react";

import { FieldError, FieldErrorsImpl, Merge } from "react-hook-form";

type FieldErrorType = FieldError | Merge<FieldError, FieldErrorsImpl<any>>;

interface FieldErrorTextProps {
  error?: FieldErrorType;
  id?: string;
}

export const FieldErrorText = ({
  error,
  id,
}: FieldErrorTextProps): JSX.Element | null => {
  if (!error) return null;
  return (
    <div
      id={id}
      className="text-danger small mt-1"
      role="alert"
      aria-live="polite"
    >
      {typeof error.message === "string" ? error.message : "Ошибка валидации"}
    </div>
  );
};
