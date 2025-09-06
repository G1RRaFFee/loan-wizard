import type { InputHTMLAttributes, JSX } from "react";

import { Controller, useFormContext } from "react-hook-form";

import { formatPhone } from "@/utils";

type PhoneInputProps = Omit<
  InputHTMLAttributes<HTMLInputElement>,
  "name" | "onChange" | "value"
>;

export const PhoneInput = (props: PhoneInputProps): JSX.Element => {
  const { control } = useFormContext();

  return (
    <Controller
      name="phone"
      control={control}
      render={({ field }) => (
        <input
          {...props}
          {...field}
          className={`form-control ${props.className ?? ""}`}
          inputMode="numeric"
          placeholder="0XXX XXX XXX"
          value={field.value ?? ""}
          onChange={(e) => field.onChange(formatPhone(e.target.value))}
          autoComplete="tel"
        />
      )}
    />
  );
};
