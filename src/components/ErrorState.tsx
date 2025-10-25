import { AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface ErrorStateProps {
  message?: string;
  onRetry?: () => void;
}

const ErrorState = ({ message = "Failed to fetch news articles", onRetry }: ErrorStateProps) => {
  return (
    <div className="flex items-center justify-center min-h-[400px]">
      <Alert variant="destructive" className="max-w-md">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription className="mt-2">
          {message}. Please try again later.
        </AlertDescription>
        {onRetry && (
          <Button 
            onClick={onRetry} 
            variant="outline" 
            className="mt-4 border-destructive text-destructive hover:bg-destructive hover:text-destructive-foreground"
          >
            Retry
          </Button>
        )}
      </Alert>
    </div>
  );
};

export default ErrorState;
