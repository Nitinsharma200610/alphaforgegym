import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar"; // ✅ correct path

const Layout = () => {
  return (
    <>
      <Navbar />
      <Outlet />
    </>
  );
};

export default Layout;
