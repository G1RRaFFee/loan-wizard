import { type JSX, useCallback } from "react";

import { useQuery } from "@tanstack/react-query";
import {
  FieldError,
  FieldErrorsImpl,
  Merge,
  useFormContext,
} from "react-hook-form";
import { useNavigate } from "react-router-dom";

import { fetchCategories } from "@/api/dummyjson";
import { FieldErrorText } from "@/components";
import { addressStepFields } from "@/components/form";
import { ROUTES } from "@/constants";

type FieldErrorType = FieldError | Merge<FieldError, FieldErrorsImpl<any>>;

export const AddressStep = (): JSX.Element => {
  const {
    register,
    formState: { errors },
    trigger,
  } = useFormContext();
  const nav = useNavigate();

  const {
    data: categories,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["categories"],
    queryFn: fetchCategories,
    // Обоснование: кэшируем список категорий для переиспользования на разных шагах/компонентах.
    staleTime: 5 * 60 * 1000,
  });

  const prev = useCallback(() => nav(ROUTES.step.personal), [nav]);

  const next = useCallback(async () => {
    const ok = await trigger(addressStepFields);
    if (ok) nav(ROUTES.step.loan);
  }, [trigger, nav]);

  return (
    <div className="card p-4">
      <div className="row g-3">
        <div className="col-12">
          <label className="form-label">Место работы</label>
          {isLoading ? (
            <div className="form-text">
              <span
                className="spinner-border spinner-border-sm me-2"
                role="status"
                aria-hidden="true"
              ></span>
              Загрузка категорий...
            </div>
          ) : isError ? (
            <div className="text-danger">
              Ошибка загрузки категорий. Попробуйте обновить страницу.
            </div>
          ) : (
            <select className="form-select" {...register("workPlace")}>
              <option value="">Выберите...</option>
              {categories?.map((c) => (
                <option key={c.value} value={c.value}>
                  {c.label}
                </option>
              ))}
            </select>
          )}
          <FieldErrorText error={errors.workPlace as FieldErrorType} />
        </div>

        <div className="col-12">
          <label className="form-label">Адрес проживания</label>
          <input
            className="form-control"
            placeholder="Город, улица, дом"
            {...register("address")}
          />
          <FieldErrorText error={errors.address as FieldErrorType} />
        </div>
      </div>

      <div className="d-flex justify-content-between gap-2 mt-4">
        <button className="btn btn-outline-secondary" onClick={prev}>
          Назад
        </button>
        <button className="btn btn-primary" onClick={next}>
          Далее
        </button>
      </div>
    </div>
  );
};
