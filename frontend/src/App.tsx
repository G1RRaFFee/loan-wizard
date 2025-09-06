import { Navigate, Route, Routes } from "react-router-dom";

import { ErrorBoundary } from "@/components";
import { FormRoot } from "@/components/form";
import { ROUTES } from "@/constants";
import { AddressStep, LoanStep, PersonalStep } from "@/pages";

export default function App() {
  return (
    <ErrorBoundary>
      <Routes>
        <Route
          path={ROUTES.root}
          element={<Navigate to={ROUTES.step.personal} replace />}
        />
        <Route element={<FormRoot />}>
          <Route path={ROUTES.step.personal} element={<PersonalStep />} />
          <Route path={ROUTES.step.address} element={<AddressStep />} />
          <Route path={ROUTES.step.loan} element={<LoanStep />} />
        </Route>
        <Route
          path="*"
          element={<Navigate to={ROUTES.step.personal} replace />}
        />
      </Routes>
    </ErrorBoundary>
  );
}
