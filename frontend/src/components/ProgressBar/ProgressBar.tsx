import { JSX, useMemo } from "react";

import { useLocation } from "react-router-dom";

export const ProgressBar = (): JSX.Element => {
  const location = useLocation();

  const currentStep = useMemo(() => {
    const path = location.pathname;
    if (path.includes("/personal")) return 1;
    if (path.includes("/address")) return 2;
    if (path.includes("/loan")) return 3;
    return 1;
  }, [location.pathname]);

  const progressPercentage = useMemo(
    () => (currentStep / 3) * 100,
    [currentStep]
  );

  return (
    <div className="mb-4">
      <div
        className="progress"
        role="progressbar"
        aria-valuenow={currentStep}
        aria-valuemin={1}
        aria-valuemax={3}
        aria-label={`Шаг ${currentStep} из 3`}
      >
        <div
          className="progress-bar"
          style={{ width: `${progressPercentage}%` }}
          aria-label={`Прогресс: ${Math.round(progressPercentage)}%`}
        >
          Шаг {currentStep} из 3
        </div>
      </div>
    </div>
  );
};
