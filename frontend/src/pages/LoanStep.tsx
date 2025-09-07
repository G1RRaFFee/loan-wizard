import { type JSX, useCallback, useState } from "react";

import { useMutation } from "@tanstack/react-query";
import {
  FieldError,
  FieldErrorsImpl,
  Merge,
  useFormContext,
} from "react-hook-form";
import { useNavigate } from "react-router-dom";

import { addProduct } from "@/api/dummyjson";
import { FieldErrorText, Modal } from "@/components";
import { loanStepFields } from "@/components/form";
import { ROUTES } from "@/constants";

type FieldErrorType = FieldError | Merge<FieldError, FieldErrorsImpl<any>>;

export const LoanStep = (): JSX.Element => {
  const {
    register,
    formState: { errors },
    trigger,
    getValues,
    watch,
  } = useFormContext();
  const nav = useNavigate();
  const [open, setOpen] = useState(false);

  const mutation = useMutation({
    mutationFn: (title: string) => addProduct(title),
    onSuccess: () => setOpen(true),
    onError: (error) => {
      console.error("Ошибка при отправке заявки:", error);
    },
  });

  const prev = useCallback(() => nav(ROUTES.step.address), [nav]);

  const submit = useCallback(async () => {
    const ok = await trigger(loanStepFields);
    if (!ok) return;
    const { firstName, lastName } = getValues();
    // Тест ожидает "Фамилия Имя"
    mutation.mutate(`${lastName} ${firstName}`);
  }, [trigger, getValues, mutation]);

  const { firstName, lastName } = getValues();
  const fio = `${lastName} ${firstName}`;

  const amount = watch("amount");
  const termDays = watch("termDays");

  return (
    <div className="card p-4">
      <div className="row g-4">
        <div className="col-12 col-md-6">
          <label
            htmlFor="amount"
            className="form-label d-flex justify-content-between"
          >
            <span>
              Сумма займа: <strong>${amount}</strong>
            </span>
            <span className="text-muted small">$200 — $1000</span>
          </label>
          <input
            id="amount"
            type="range"
            className="form-range"
            min={200}
            max={1000}
            step={100}
            {...register("amount", { valueAsNumber: true })}
          />
          <FieldErrorText error={errors.amount as FieldErrorType} />
        </div>

        <div className="col-12 col-md-6">
          <label
            htmlFor="termDays"
            className="form-label d-flex justify-content-between"
          >
            <span>
              Срок займа: <strong>{termDays}</strong> дней
            </span>
            <span className="text-muted small">10 — 30 дней</span>
          </label>
          <input
            id="termDays"
            type="range"
            className="form-range"
            min={10}
            max={30}
            step={1}
            {...register("termDays", { valueAsNumber: true })}
          />
          <FieldErrorText error={errors.termDays as FieldErrorType} />
        </div>
      </div>

      <div className="d-flex justify-content-between gap-2 mt-4">
        <button className="btn btn-outline-secondary" onClick={prev}>
          Назад
        </button>
        <button
          className="btn btn-success"
          onClick={submit}
          disabled={mutation.isPending}
        >
          {mutation.isPending ? "Отправка..." : "Подать заявку"}
        </button>
        {mutation.isError && (
          <div className="alert alert-danger mt-2" role="alert">
            Ошибка при отправке заявки: {mutation.error?.message}
          </div>
        )}
      </div>

      <Modal open={open} onClose={() => setOpen(false)} title="Заявка одобрена">
        <p>
          Поздравляем, <strong>{fio}</strong>. Вам одобрена{" "}
          <strong>${amount}</strong> на <strong>{termDays}</strong> дней.
        </p>
        {mutation.isSuccess && (
          <pre className="bg-light p-2 border rounded small">
            {JSON.stringify(mutation.data, null, 2)}
          </pre>
        )}
      </Modal>
    </div>
  );
};
