// components/theme-provider.tsx - Simple version
import React from "react";

type ThemeProviderProps = {
  children: React.ReactNode;
  attribute?: string;
  defaultTheme?: string;
  enableSystem?: boolean;
};

export function ThemeProvider({ children }: ThemeProviderProps): React.ReactElement {
  // Simple implementation that just renders children
  return <>{children}</>;
}
