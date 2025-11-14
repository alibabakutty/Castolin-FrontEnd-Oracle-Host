import { Navigate } from "react-router-dom";
import { useAuth } from "./ContextProvider";

const ProtectedRoutes = ({ children, roles }) => {

  const { user, role } = useAuth();

  if (!user) {
    return <Navigate to='/' replace />
  }

  if (!roles.includes(role)) {
    return <Navigate to='/unauthorized' />
  }
  return children;
}

export default ProtectedRoutes