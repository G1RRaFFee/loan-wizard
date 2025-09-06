import { ReactElement } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { RenderOptions, render } from "@testing-library/react";
import { FormProvider, useForm } from "react-hook-form";
import { BrowserRouter } from "react-router-dom";

import { defaultValues, formSchema } from "@/components/form";

const AllTheProviders = ({ children }: { children: React.ReactNode }) => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });

  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>{children}</BrowserRouter>
    </QueryClientProvider>
  );
};

const FormWrapper = ({ children }: { children: React.ReactNode }) => {
  const methods = useForm({
    resolver: zodResolver(formSchema),
    defaultValues,
    mode: "onBlur",
  });

  return <FormProvider {...methods}>{children}</FormProvider>;
};

const customRender = (
  ui: ReactElement,
  options?: Omit<RenderOptions, "wrapper">
) => render(ui, { wrapper: AllTheProviders, ...options });

const renderWithForm = (
  ui: ReactElement,
  options?: Omit<RenderOptions, "wrapper">
) => {
  const Wrapper = ({ children }: { children: React.ReactNode }) => (
    <AllTheProviders>
      <FormWrapper>{children}</FormWrapper>
    </AllTheProviders>
  );

  return render(ui, { wrapper: Wrapper, ...options });
};

export * from "@testing-library/react";
export { customRender as render, renderWithForm };
