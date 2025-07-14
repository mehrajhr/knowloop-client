import React from 'react';
import { Outlet } from 'react-router';
import Navbar from '../Pages/Navbar/Navbar';
import Footer from '../Pages/Footer/Footer';

const MainLayouts = () => {
    return (
        <div>
            <Navbar></Navbar>
            <Outlet></Outlet>
            <Footer></Footer>
        </div>
    );
};

export default MainLayouts;