import { ReactNode } from "react";

interface StepNavigationProps {
  onPrev?: () => void;
  onNext?: () => void;
  nextText?: string;
  prevText?: string;
  isLoading?: boolean;
  showPrev?: boolean;
  children?: ReactNode;
}

export default function StepNavigation({
  onPrev,
  onNext,
  nextText = "Далее",
  prevText = "Назад",
  isLoading = false,
  showPrev = true,
  children,
}: StepNavigationProps) {
  return (
    <div className="d-flex justify-content-between gap-2 mt-4">
      {showPrev && onPrev ? (
        <button
          className="btn btn-outline-secondary"
          onClick={onPrev}
          type="button"
        >
          {prevText}
        </button>
      ) : (
        <div />
      )}

      {children}

      {onNext && (
        <button
          className="btn btn-primary"
          onClick={onNext}
          disabled={isLoading}
          type="button"
        >
          {isLoading ? "Загрузка..." : nextText}
        </button>
      )}
    </div>
  );
}
