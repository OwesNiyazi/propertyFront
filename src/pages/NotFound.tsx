import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Home } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-center space-y-6">
        <div className="text-8xl font-bold bg-gradient-primary bg-clip-text text-transparent">
          404
        </div>
        <h1 className="text-2xl font-semibold text-foreground">Page not found</h1>
        <p className="text-muted-foreground max-w-md">
          The page you're looking for doesn't exist. It might have been moved or deleted.
        </p>
        <Button asChild variant="gradient">
          <Link to="/home">
            <Home size={16} />
            Return to Home
          </Link>
        </Button>
      </div>
    </div>
  );
};

export default NotFound;
