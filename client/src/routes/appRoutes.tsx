import AdminHome from '../pages/Admin/AdminHome';
import Home from '../pages/Donor/Index';
import SignUp from '../pages/Donor/SignUp';
import SignIn from '../pages/Donor/SignIn';
import Profile from '../pages/Donor/Profile';
import EditProfile from '../pages/Donor/EditProfile';
import ImageComponentExample from '../pages/Donor/ImageComponentExample';
import { DonorHome } from '../pages/Donor/DonorHome';
import AdminSignIn from '../pages/Admin/AdminSignIn';

type AppRoutesT = {
  path: string;
  description: string; // for developers to understand what this route is for
  element: JSX.Element;
  isAdmin: boolean; // all admin routes are prefixed with /admin
};

export const ADMIN_PREFIX = 'admin';

export const APP_ROUTES: AppRoutesT[] = [
  {
    path: '',
    description: 'Generic landing page for unauthenticated donor',
    element: <Home />,
    isAdmin: false,
  },
  {
    path: 'sign-up',
    description: 'Sign up page for the donor',
    element: <SignUp />,
    isAdmin: false,
  },
  {
    path: 'sign-in',
    description: 'Sign in page for the donor',
    element: <SignIn />,
    isAdmin: false,
  },
  {
    path: 'profile',
    description: 'Profile page for the donor',
    element: <Profile />,
    isAdmin: false,
  },
  {
    path: 'edit-profile',
    description: 'Edit profile page for the donor',
    element: <EditProfile />,
    isAdmin: false,
  },
  {
    path: 'image-component-example',
    description: 'Image component example page for the donor',
    element: <ImageComponentExample />,
    isAdmin: false,
  },
  {
    path: 'home',
    description: 'Home page for authenticated admin',
    element: <AdminHome />,
    isAdmin: true,
  },
  {
    path: 'home',
    description: 'Home page for authenticated donor',
    element: <DonorHome />,
    isAdmin: false,
  },
  {
    path: 'sign-in',
    description: 'Sign in page for the admin',
    element: <AdminSignIn />,
    isAdmin: true,
  },
];
