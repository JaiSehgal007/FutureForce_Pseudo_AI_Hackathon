import { createBrowserRouter } from "react-router-dom";
import AuthLayout from "./Layout/AuthLayout";
import MainLayout from "./Layout/MainLayout";
import Home from "./pages/Home";
import Login from "./pages/Auth/Login.jsx";
import Register from "./pages/Auth/Register.jsx";
import ExperienceFields from "./pages/Auth/ExperienceFields";
import InterestedAreas from "./pages/Auth/InterestedAreas.jsx";
import AddCourse from "./pages/AddCourse";
import CourseDetails from "./pages/CourseDetails"; // Import the CourseDetails component
import AllCourses from "./pages/AllCourses";
export const router = createBrowserRouter([
    {
    path: '/login',
    element: (
      <AuthLayout>
        <Login />
      </AuthLayout>
    )
  },
  {
    path: '/register',
    element: (
      <AuthLayout>
        <Register />
      </AuthLayout>
    )
  },
  {
    path: '/interested-areas',
    element: (
      <AuthLayout>
        <InterestedAreas />
      </AuthLayout>
    )
  },
  {
    path: '/experience-fields',
    element: (
      <AuthLayout>
        <ExperienceFields />
      </AuthLayout>
    )
  },
  {
    path: '/',
    element: <MainLayout />,
    children: [
        {
            path: '/',
            element: <Home />,
        },
        {
            path: '/dashboard',
            element: <Home />,
        },
        {
            path: '/addCourse',
            element: <AddCourse />,
        },
        {
            path: '/courses/:courseId', // New route for viewing individual courses
            element: <CourseDetails />,
        },
        {
            path: '/discover',
            element: <AllCourses />,
        }
    ]
  }
]);
