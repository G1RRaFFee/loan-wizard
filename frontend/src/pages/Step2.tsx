import { useQuery } from "@tanstack/react-query";
import { useFormContext } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import FieldErrorText from "@/components/FieldError";
import { step2Fields } from "@/form/schema";
import { fetchCategories } from "@/api/dummyjson";
import { ROUTES } from "@/constants";
import { FieldError, FieldErrorsImpl, Merge } from "react-hook-form";

type FieldErrorType = FieldError | Merge<FieldError, FieldErrorsImpl<any>>;

export default function Step2() {
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

  const prev = () => nav(ROUTES.personal);

  const next = async () => {
    const ok = await trigger(step2Fields);
    if (ok) nav(ROUTES.loan);
  };

  return (
    <div className="card p-4">
      <div className="row g-3">
        <div className="col-12">
          <label className="form-label">Место работы</label>
          {isLoading ? (
            <div className="form-text">Загрузка...</div>
          ) : isError ? (
            <div className="text-danger">Ошибка загрузки категорий</div>
          ) : (
            <select className="form-select" {...register("workPlace")}>
              <option value="">Выберите...</option>
              {categories!.map((c) => (
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
}
