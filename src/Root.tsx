import { Toaster } from "react-hot-toast";

import { TanstackQueryProvider } from "./core/tanstack-query/provider";

import { App } from "@/App";
import ATHandler from "./components/base/ATHandler";
import { ErrorBoundary } from "@/components/base/ErrorBoundary";
import { ParaProviders } from "./core/para/provider";

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
        <ParaProviders>
          <ATHandler>
            <App />
            <Toaster />
          </ATHandler>
        </ParaProviders>
      </TanstackQueryProvider>
    </ErrorBoundary>
  );
}
