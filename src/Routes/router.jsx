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