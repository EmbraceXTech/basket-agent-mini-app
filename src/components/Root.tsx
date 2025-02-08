import { App } from "@/components/App.tsx";
import { ErrorBoundary } from "@/components/ErrorBoundary.tsx";
// import PrivyProvider from "@/core/privy/provider.tsx";

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
      <div>VITE_TEST: {import.meta.env.VITE_TEST}</div>
      <div>VITE_PRIVY_APP_ID: {import.meta.env.VITE_PRIVY_APP_ID}</div>
      {/* <PrivyProvider> */}
        <App />
      {/* </PrivyProvider> */}
    </ErrorBoundary>
  );
}
