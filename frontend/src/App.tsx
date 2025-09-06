import { Navigate, Route, Routes } from "react-router-dom";
import { FormRoot } from "./form/FormRoot";
import Step1 from "./pages/Step1";
import Step2 from "./pages/Step2";
import Step3 from "./pages/Step3";
import { ROUTES } from "@/constants";
import { ErrorBoundary } from "@/components";

export default function App() {
  return (
    <ErrorBoundary>
      <Routes>
        <Route
          path={ROUTES.root}
          element={<Navigate to={ROUTES.personal} replace />}
        />
        <Route element={<FormRoot />}>
          <Route path={ROUTES.personal} element={<Step1 />} />
          <Route path={ROUTES.address} element={<Step2 />} />
          <Route path={ROUTES.loan} element={<Step3 />} />
        </Route>
        <Route path="*" element={<Navigate to={ROUTES.personal} replace />} />
      </Routes>
    </ErrorBoundary>
  );
}
