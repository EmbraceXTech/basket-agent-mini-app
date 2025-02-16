import { Toaster } from 'react-hot-toast';

import PrivyProvider from "@/core/privy/provider.tsx";
import { TanstackQueryProvider } from "./core/tanstack-query/provider";

import { App } from "@/App";
import ATHandler from "./components/base/ATHandler";
import { ErrorBoundary } from "@/components/base/ErrorBoundary";



function ErrorBoundaryError({ error }: { error: unknown }) {
  return (
    <div>
      <p>An unhandled error occurred:</p>
      <blockquote>
        <code>
          {error instanceof Error
            ? error.message
            : typeof error === "string"
            ? error
            : JSON.stringify(error)}
        </code>
      </blockquote>
    </div>
  );
}

export function Root() {
  return (
    <ErrorBoundary fallback={ErrorBoundaryError}>
      <TanstackQueryProvider>
        <PrivyProvider>
          <ATHandler>
            <App />
            <Toaster />
          </ATHandler>
        </PrivyProvider>
      </TanstackQueryProvider>
    </ErrorBoundary>
  );
}
