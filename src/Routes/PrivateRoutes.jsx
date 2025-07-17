import React, { Children } from 'react';
import useAuth from '../hooks/useAuth';
import Loading from '../Pages/Loading/Loading';
import { Navigate, useLocation } from 'react-router';
import useUserRole from '../hooks/useUserRole ';

const PrivateRoutes = ({children}) => {
    const {user , loading} = useAuth();
    const {role} = useUserRole();
    const location = useLocation();
    const from = location.pathname;
    if(loading){
        return <Loading></Loading>;
    }
    if(!user){
        return <Navigate to='/login' state={{from}}></Navigate>
    }
    else if(role === 'admin' || role === 'tutor'){
        return <Navigate to='/' ></Navigate>
    }
    else{
        return children
    }
};

export default PrivateRoutes;