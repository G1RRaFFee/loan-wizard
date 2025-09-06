import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useFormContext } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import FieldErrorText from "@/components/FieldError";
import { step3Fields } from "@/form/schema";
import Modal from "@/components/Modal";
import { addProduct } from "@/api/dummyjson";
import { ROUTES } from "@/constants";
import { FieldError, FieldErrorsImpl, Merge } from "react-hook-form";

type FieldErrorType = FieldError | Merge<FieldError, FieldErrorsImpl<any>>;

export default function Step3() {
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
  });

  const prev = () => nav(ROUTES.address);

  const submit = async () => {
    const ok = await trigger(step3Fields);
    if (!ok) return;
    const { firstName, lastName } = getValues();
    mutation.mutate(`${firstName} ${lastName}`);
  };

  const { firstName, lastName } = getValues();
  const fio = `${lastName} ${firstName}`;

  const amount = watch("amount");
  const termDays = watch("termDays");

  return (
    <div className="card p-4">
      <div className="row g-4">
        <div className="col-12 col-md-6">
          <label className="form-label d-flex justify-content-between">
            <span>
              Сумма займа: <strong>${amount}</strong>
            </span>
            <span className="text-muted small">$200 — $1000</span>
          </label>
          <input
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
          <label className="form-label d-flex justify-content-between">
            <span>
              Срок займа: <strong>{termDays}</strong> дней
            </span>
            <span className="text-muted small">10 — 30 дней</span>
          </label>
          <input
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
}
