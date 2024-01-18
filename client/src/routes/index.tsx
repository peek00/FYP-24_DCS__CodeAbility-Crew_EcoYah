import {createBrowserRouter} from "react-router-dom";
import App from "../App";
import ErrorPage from "../pages/ErrorPage";
import SignUp from "../pages/SignUp";
import Profile from "../pages/Profile";
import EditProfile from "../pages/EditProfile";
// import ContactUs from "../pages/ContactUs";
import Home from "../pages/Index";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "/sign-up",
        element: <SignUp />,
      },
      {
        path: "/profile",
        element: <Profile />,
      },
      {
        path: "/edit-profile",
        element: <EditProfile />,
      },
      // {
      //   path: "/contactUs",
      //   element: <ContactUs />,
      // }
    ],
  },
]);

export default router;
