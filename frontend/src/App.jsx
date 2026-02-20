import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import Layout from "./common/layout";
import AdminLayout from "./common/AdminLayout";
import ProtectedAdminRoute from "./components/ProtectedAdminRoute";
import ProtectedSuperAdminRoute from "./components/ProtectedSuperAdminRoute";
import SuperAdminLayout from "./common/SuperAdminLayout";
import ProtectedMemberRoute from "./components/ProtectedMemberRoute";

import Home from "./Pages/Home";
import About from "./Pages/About";
import Contact from "./Pages/Contact";
import Membership from "./Pages/Membership";
import Login from "./Pages/Login";
import Signup from "./Pages/Signup";
import Cards from "./Pages/Cards";
import ServicesDetails from "./Pages/ServicesDetails";
import CheckoutSuccess from "./Pages/CheckoutSuccess";
import MyPlans from "./Pages/MyPlans";

import AdminDashboard from "./Pages/Admin/AdminDashboard";
import AddService from "./Pages/Admin/AddService";
import AddMembership from "./Pages/Admin/AddMembership";
import ViewUsers from "./Pages/Admin/ViewUsers";
import SuperAdminDashboard from "./Pages/Admin/SuperAdminDashboard";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      { index: true, element: <Home /> },
      { path: "about", element: <About /> },
      { path: "contact", element: <Contact /> },
      { path: "membership", element: <Membership /> },
      { path: "checkout/success", element: <CheckoutSuccess /> },
      { path: "login", element: <Login /> },
      { path: "signup", element: <Signup /> },
      { path: "cards", element: <Cards /> },
      { path: "my-plans", element: <MyPlans /> },
      {
        path: "services/:id",
        element: (
          <ProtectedMemberRoute>
            <ServicesDetails />
          </ProtectedMemberRoute>
        ),
      },
    ],
  },
  {
    path: "/admin",
    element: (
      <ProtectedAdminRoute>
        <AdminLayout />
      </ProtectedAdminRoute>
    ),
    children: [
      { index: true, element: <AdminDashboard /> },
      { path: "add-service", element: <AddService /> },
      { path: "add-membership", element: <AddMembership /> },
      { path: "users", element: <ViewUsers /> },
    ],
  },
  {
    path: "/superadmin",
    element: (
      <ProtectedSuperAdminRoute>
        <SuperAdminLayout />
      </ProtectedSuperAdminRoute>
    ),
    children: [
      { index: true, element: <SuperAdminDashboard /> },
    ],
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
