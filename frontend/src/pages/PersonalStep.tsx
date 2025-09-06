import { type JSX, useCallback } from "react";

import {
  FieldError,
  FieldErrorsImpl,
  Merge,
  useFormContext,
} from "react-hook-form";
import { useNavigate } from "react-router-dom";

import { FormField, PhoneInput, StepNavigation } from "@/components";
import { GENDERS, personalStepFields } from "@/components/form";
import { ROUTES } from "@/constants";

type FieldErrorType = FieldError | Merge<FieldError, FieldErrorsImpl<any>>;

export const PersonalStep = (): JSX.Element => {
  const {
    register,
    formState: { errors },
    trigger,
  } = useFormContext();
  const nav = useNavigate();

  const next = useCallback(async () => {
    const ok = await trigger(personalStepFields);
    if (ok) nav(ROUTES.step.address);
  }, [trigger, nav]);

  return (
    <section className="card p-4" aria-labelledby="step1-title">
      <h2 id="step1-title" className="visually-hidden">
        Личная информация
      </h2>
      <div className="row g-3">
        <div className="col-12 col-md-6">
          <FormField
            label="Телефон"
            error={errors.phone as FieldErrorType}
            required
          >
            <PhoneInput />
          </FormField>
        </div>
        <div className="col-12 col-md-6">
          <FormField
            label="Имя"
            error={errors.firstName as FieldErrorType}
            required
          >
            <input
              className="form-control"
              placeholder="Иван"
              {...register("firstName")}
            />
          </FormField>
        </div>
        <div className="col-12 col-md-6">
          <FormField
            label="Фамилия"
            error={errors.lastName as FieldErrorType}
            required
          >
            <input
              className="form-control"
              placeholder="Иванов"
              {...register("lastName")}
            />
          </FormField>
        </div>
        <div className="col-12 col-md-6">
          <FormField
            label="Пол"
            error={errors.gender as FieldErrorType}
            required
          >
            <select className="form-select" {...register("gender")}>
              {GENDERS.map((g) => (
                <option key={g.value} value={g.value}>
                  {g.label}
                </option>
              ))}
            </select>
          </FormField>
        </div>
      </div>

      <StepNavigation onNext={next} showPrev={false} />
    </section>
  );
};
