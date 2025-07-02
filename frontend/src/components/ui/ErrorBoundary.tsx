import React from "react";
import { Alert, Button } from "react-bootstrap";
import { RefreshCw } from "lucide-react";
import { ErrorBoundary as ReactErrorBoundary } from "react-error-boundary";
// path issue fixing
function ErrorFallback() {
  return (
    <div className="container py-5">
      <Alert variant="danger" className="text-center">
        <Alert.Heading>Something went wrong!</Alert.Heading>
        <p>We're sorry, but something unexpected happened.</p>
        <Button
          variant="outline-danger"
          onClick={() => window.location.reload()}
        >
          <RefreshCw size={16} className="me-2" />
          Reload Page
        </Button>
      </Alert>
    </div>
  );
}

export function ErrorBoundary({ children }: { children: React.ReactNode }) {
  return (
    <ReactErrorBoundary FallbackComponent={ErrorFallback}>
      {children}
    </ReactErrorBoundary>
  );
}
