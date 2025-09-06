import { Component, ReactNode, ErrorInfo } from "react";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("ErrorBoundary caught an error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        this.props.fallback || (
          <div className="alert alert-danger" role="alert">
            <h4 className="alert-heading">Произошла ошибка!</h4>
            <p>
              Что-то пошло не так. Пожалуйста, обновите страницу или попробуйте
              позже.
            </p>
            <hr />
            <p className="mb-0">
              <button
                className="btn btn-outline-danger btn-sm"
                onClick={() => window.location.reload()}
              >
                Обновить страницу
              </button>
            </p>
          </div>
        )
      );
    }

    return this.props.children;
  }
}
