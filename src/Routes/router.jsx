import React from 'react';
import { createBrowserRouter } from 'react-router';
import MainLayouts from '../Layouts/MainLayouts';
import Home from '../Pages/Home/Home';

const router = createBrowserRouter([
  {
    path: "/",
    Component: MainLayouts,
    children: [
        {
            index: true,
            Component: Home
        }
    ]
  },
]);

export default router;