import { Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import toast from "react-hot-toast";
import { useEffect, useRef } from "react";

const ProtectedMemberRoute = ({ children }) => {
  const { user, hasMembership } = useAuth();
  const hasShownToast = useRef(false);

  useEffect(() => {
    if (user && !hasMembership && !hasShownToast.current) {
      toast.error("You need an active membership to access services");
      hasShownToast.current = true;
    }
  }, [user, hasMembership]);

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (!hasMembership) {
    return <Navigate to="/membership" replace />;
  }

  return children;
};

export default ProtectedMemberRoute;
