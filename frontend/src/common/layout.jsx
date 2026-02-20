import { Outlet, Navigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { useAuth } from "../hooks/useAuth";
import AdminNavbar from "../components/AdminNavbar";

const Layout = () => {
  const { user } = useAuth();

  // SuperAdmin should only see their dashboard, not the public site
  if (user?.role === "SUPERADMIN") {
    return <Navigate to="/superadmin" replace />;
  }

  return (
    <>
      {
        user?.role === "ADMIN" ? <AdminNavbar /> : <Navbar />
      }
      <Outlet />
    </>
  );
};

export default Layout;
