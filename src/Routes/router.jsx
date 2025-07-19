import React from 'react';
import { createBrowserRouter } from 'react-router';
import MainLayouts from '../Layouts/MainLayouts';
import Home from '../Pages/Home/Home';
import Login from '../Pages/Authentication/Login';
import Register from '../Pages/Authentication/Register';
import About from '../Pages/About/About';
import StudySessions from '../Pages/StudySessions/StudySessions';
import StudySessionDetails from '../Pages/StudySessions/StudySessionDetails';
import MyBookedSessions from '../Pages/MyBookedSessions/MyBookedSessions';
import CreateNote from '../Pages/Notes/CreateNote';
import ManageNotes from '../Pages/Notes/ManageNotes';
import CreateSession from '../Pages/Create Sessions/CreateSession';
import AllStudySessions from '../Pages/AllStudySessions/AllStudySessions';
import ManageStudySessions from '../Pages/ManageSessions/ManageSessions';
import UploadMaterials from '../Pages/Upload Materials/UploadMaterials';
import MyMaterials from '../Pages/My Materials/MyMaterials';
import StudyMaterials from '../Pages/StudyMaterials/StudyMaterials';
import ManageUsers from '../Pages/ManageUsers/ManageUsers';
import ManageMaterialsAdmin from '../Pages/ManageMaterialAdmin/ManageMaterialsAdmin';
import Forbidden from '../Pages/Forbidden/Forbidden';
import PrivateRoutes from './PrivateRoutes';
import TutorRoutes from './TutorRoutes';
import AdminRoutes from './AdminRoutes';
import NotFound from '../Pages/Error/NotFound';
import AllTutors from '../Pages/AllTutors/AllTutors';
import Payment from '../Pages/Payment/Payment';

const router = createBrowserRouter([
  {
    path: "/",
    Component: MainLayouts,
    children: [
        {
            index: true,
            Component: Home
        },
        {
          path:'/study-sessions',
          Component: StudySessions
        },
        {
          path: '/study-sessions/:id',
          Component: StudySessionDetails
        },
        {
          path: '/all-tutors',
          Component: AllTutors
        },
        {
          path: '/payment/:id',
          Component: Payment
        },
        // for students
        {
          path: '/my-booked-sessions',
          element: <PrivateRoutes><MyBookedSessions></MyBookedSessions></PrivateRoutes>
        },
        {
          path: '/create-note',
          element: <PrivateRoutes><CreateNote></CreateNote></PrivateRoutes>
        },
        {
          path: '/manage-notes',
          element: <PrivateRoutes><ManageNotes></ManageNotes></PrivateRoutes>
        },
        {
          path: '/study-materials',
          element: <PrivateRoutes><StudyMaterials></StudyMaterials></PrivateRoutes>
        },
        // for teacher
        {
          path:'/create-session',
          element: <TutorRoutes><CreateSession></CreateSession></TutorRoutes>
        },
        {
          path: '/manage-sessions',
          element: <TutorRoutes><ManageStudySessions></ManageStudySessions></TutorRoutes>
        },
        {
          path: '/upload-materials',
          element: <TutorRoutes><UploadMaterials></UploadMaterials></TutorRoutes>
        },
        {
          path: '/my-materials',
          element: <TutorRoutes><MyMaterials></MyMaterials></TutorRoutes>
        },

        // for admins
        {
          path: '/all-sessions',
          element: <AdminRoutes><AllStudySessions></AllStudySessions></AdminRoutes>
        },
        {
          path: '/manage-users',
          element: <AdminRoutes><ManageUsers></ManageUsers></AdminRoutes>
        },
        {
          path: '/manage-materials',
          element: <AdminRoutes><ManageMaterialsAdmin></ManageMaterialsAdmin></AdminRoutes>
        },

        // for all
        {
            path:'/login',
            Component: Login
        }
        ,
        {
            path: '/register',
            Component: Register
        },
        {
          path:'/about',
          Component: About
        },
        {
          path: '/forbidden',
          Component: Forbidden
        }
    ]
  },
  {
    path: '*',
    Component: NotFound
  }
]);

export default router;