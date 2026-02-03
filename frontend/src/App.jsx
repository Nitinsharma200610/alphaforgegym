import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Layout from "./common/layout";

import Home from "./Pages/Home";
import About from "./Pages/About";
import Contact from "./Pages/Contact";
import Membership from "./Pages/Membership";
import Login from "./Pages/Login";
import Signup from "./Pages/Signup";
import Cards from "./Pages/Cards";
import ServicesDetails from "./Pages/ServicesDetails";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      { index: true, element: <Home /> },
      { path: "about", element: <About /> },
      { path: "contact", element: <Contact /> },
      { path: "membership", element: <Membership /> },
      { path: "login", element: <Login /> },
      { path: "signup", element: <Signup /> },
      { path: "cards", element: <Cards /> },

      { path: "services/:id", element: <ServicesDetails /> },
    ],
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
