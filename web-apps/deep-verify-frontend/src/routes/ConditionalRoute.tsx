import { ReactElement } from 'react';
import { Navigate } from 'react-router-dom';

interface ConditionalRouteProps {
  condition: boolean | undefined;
  redirectTo: string;
  children: ReactElement;
}

function ConditionalRoute({
  condition,
  redirectTo,
  children,
}: ConditionalRouteProps) {
  return condition ? <>{children}</> : <Navigate to={redirectTo} replace />;
}

export default ConditionalRoute;
