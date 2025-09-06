import { Controller, useFormContext } from "react-hook-form";
import { InputHTMLAttributes } from "react";

function formatPhone(v: string) {
  const d = v.replace(/\D/g, "").slice(0, 10); // максимум 10 цифр
  let out = "";
  for (let i = 0; i < d.length; i++) {
    out += d[i];
    if (i === 3 || i === 6) out += " ";
  }
  return out;
}

type Props = Omit<
  InputHTMLAttributes<HTMLInputElement>,
  "name" | "onChange" | "value"
>;

export default function PhoneInput(props: Props) {
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
          aria-describedby={props["aria-describedby"]}
          autoComplete="tel"
        />
      )}
    />
  );
}
