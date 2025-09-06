import { useFormContext } from "react-hook-form";
import { PhoneInput, FormField, StepNavigation } from "@/components";
import { GENDERS, step1Fields } from "@/form/schema";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "@/constants";
import { FieldError, FieldErrorsImpl, Merge } from "react-hook-form";

type FieldErrorType = FieldError | Merge<FieldError, FieldErrorsImpl<any>>;

export default function Step1(): JSX.Element {
  const {
    register,
    formState: { errors },
    trigger,
  } = useFormContext();
  const nav = useNavigate();

  const next = async () => {
    const ok = await trigger(step1Fields);
    if (ok) nav(ROUTES.address);
  };

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
            helpText="Формат: 0XXX XXX XXX"
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
}
