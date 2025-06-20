'use client';

import { ThemeProvider } from "@/components/theme-provider";

export default function Error() {
  return (
    <ThemeProvider>
      <div style={{ padding: 32, textAlign: 'center' }}>
        <h1>Something went wrong</h1>
        <p>Please try again or contact support.</p>
      </div>
    </ThemeProvider>
  );
} 