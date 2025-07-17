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
        // for students
        {
          path: '/my-booked-sessions',
          Component: MyBookedSessions
        },
        {
          path: '/create-note',
          Component: CreateNote
        },
        {
          path: '/manage-notes',
          Component: ManageNotes
        },
        {
          path: '/study-materials',
          Component: StudyMaterials
        },
        // for teacher
        {
          path:'/create-session',
          Component: CreateSession
        },
        {
          path: '/manage-sessions',
          Component: ManageStudySessions
        },
        {
          path: '/upload-materials',
          Component: UploadMaterials
        },
        {
          path: '/my-materials',
          Component: MyMaterials
        },

        // for admins
        {
          path: '/all-sessions',
          Component: AllStudySessions
        },
        {
          path: '/manage-users',
          Component: ManageUsers
        },
        {
          path: '/manage-materials',
          Component: ManageMaterialsAdmin
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
        }
    ]
  },
]);

export default router;