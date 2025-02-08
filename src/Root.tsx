import { App } from "@/App";
import { ErrorBoundary } from "@/components/base/ErrorBoundary";
import PrivyProvider from "@/core/privy/provider.tsx";
import { TanstackQueryProvider } from "./core/tanstack-query/provider";

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
          <App />
        </PrivyProvider>
      </TanstackQueryProvider>
    </ErrorBoundary>
  );
}
