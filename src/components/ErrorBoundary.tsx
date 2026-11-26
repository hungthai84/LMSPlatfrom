import React from "react";
import { AlertTriangle, RotateCcw } from "lucide-react";

interface ErrorBoundaryState {
  hasError: boolean;
  errorMessage: string;
}

export class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  ErrorBoundaryState
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false, errorMessage: "" };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return {
      hasError: true,
      errorMessage: error.message || "Đã xảy ra lỗi không mong muốn.",
    };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("EDU LMS ErrorBoundary caught:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="h-screen w-screen p-[15px] bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center font-sans">
          <div className="glass-liquid-card p-8 max-w-lg w-full text-center space-y-4 rounded-[14px]">
            <div className="w-14 h-14 bg-rose-100 text-rose-600 rounded-[14px] flex items-center justify-center mx-auto">
              <AlertTriangle className="w-7 h-7" />
            </div>
            <h2 className="text-lg font-bold text-slate-800">
              Hệ thống phát hiện lỗi truy cập dữ liệu
            </h2>
            <p className="text-xs text-slate-600 bg-white/70 p-3 rounded-[14px] border border-slate-200 break-words text-left font-mono">
              {this.state.errorMessage}
            </p>
            <button
              onClick={() => this.setState({ hasError: false, errorMessage: "" })}
              className="inline-flex items-center gap-2 bg-[#1951FC] hover:bg-blue-700 text-white text-xs font-bold px-5 py-2.5 rounded-[14px] cursor-pointer transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
              Khôi phục giao diện
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
