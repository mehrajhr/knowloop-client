import React from 'react';
import { createBrowserRouter } from 'react-router';
import MainLayouts from '../Layouts/MainLayouts';
import Home from '../Pages/Home/Home';
import Login from '../Pages/Authentication/Login';
import Register from '../Pages/Authentication/Register';
import About from '../Pages/About/About';
import StudySessions from '../Pages/StudySessions/StudySessions';

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