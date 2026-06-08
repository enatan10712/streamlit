'use client';

import { AuthProvider } from '@/lib/auth-context';
import ThemeProvider from '@/components/ThemeProvider';
import { Toaster } from 'sonner';

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <ThemeProvider>
        {children}
        <Toaster position="top-center" theme="dark" />
      </ThemeProvider>
    </AuthProvider>
  );
}
