"use client";
import * as React from "react";
import { ReactNode } from "react";

class GlobalErrorBoundary extends React.Component<{ children: ReactNode }, { hasError: boolean; error: Error | null }> {
  constructor(props: { children: ReactNode }) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }
  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // No toast usage
    console.error("Error caught by boundary:", error, errorInfo);
  }
  render() {
    if (this.state.hasError) {
      return <div className="p-4 text-red-500">Something went wrong: {this.state.error?.message}</div>;
    }
    return this.props.children;
  }
}

export default GlobalErrorBoundary; 