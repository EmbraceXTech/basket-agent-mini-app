import { App } from "@/App";
import { ErrorBoundary } from "@/components/base/ErrorBoundary";
import PrivyProvider from "@/core/privy/provider.tsx";

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
      <PrivyProvider>
        <App />
      </PrivyProvider>
    </ErrorBoundary>
  );
}
