import { useCallback, useEffect } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { FormProvider, useForm } from "react-hook-form";
import { Outlet, useLocation, useNavigate } from "react-router-dom";

import { ProgressBar } from "@/components";
import {
  addressStepFields,
  defaultValues,
  formSchema,
  personalStepFields,
} from "@/components/form";
import { LS_KEY, ROUTES } from "@/constants";

export function FormRoot() {
  const stored =
    typeof localStorage !== "undefined" ? localStorage.getItem(LS_KEY) : null;
  const initial = stored
    ? { ...defaultValues, ...JSON.parse(stored) }
    : defaultValues;

  const methods = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: initial,
    mode: "onBlur",
  });

  const { watch, getValues } = methods;

  const saveToLocalStorage = useCallback(() => {
    const data = getValues();
    localStorage.setItem(LS_KEY, JSON.stringify(data));
  }, [getValues]);

  useEffect(() => {
    const sub = watch(saveToLocalStorage);
    return () => sub.unsubscribe();
  }, [watch, saveToLocalStorage]);

  const nav = useNavigate();
  const loc = useLocation();

  useEffect(() => {
    const path = loc.pathname;
    if (path.includes("/address") || path.includes("/loan")) {
      methods.trigger(personalStepFields).then((valid) => {
        if (!valid) nav(ROUTES.step.personal, { replace: true });
      });
    }
    if (path.includes("/loan")) {
      methods.trigger(addressStepFields).then((valid) => {
        if (!valid) nav(ROUTES.step.address, { replace: true });
      });
    }
  }, [loc.pathname, methods, nav]);

  return (
    <main className="container py-4">
      <header>
        <h1 className="mb-4">Оформление займа</h1>
        <ProgressBar />
      </header>
      <FormProvider {...methods}>
        <Outlet />
      </FormProvider>
    </main>
  );
}
