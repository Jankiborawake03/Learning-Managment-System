// const { Fragment } = require("react");
// const { useLocation, Navigate } = require("react-router-dom");

import { Fragment } from "react";
import { useLocation, Navigate } from "react-router-dom";



function RouteGuard({authenticated,user,element})
{
    const location = useLocation();

    console.log(authenticated,user);

    if(!authenticated && !location.pathname.includes('/auth'))
    {
       return <Navigate to={'/auth'} />
    }

    if(authenticated && user?.role !== 'instructor' && (location.pathname.includes('instructor') || location.pathname.includes('/auth')))
    {
        return <Navigate to={'/home'} />
    }

    if(authenticated && user.role === 'instructor' && user.access===true && !location.pathname.includes('instructor'))
    {
        return <Navigate to={'/instructor'} />
    }
 
    //
    if(authenticated && user.role === 'admin' && !location.pathname.includes('admin'))
        {
            return <Navigate to={'/admin'} />
        }
    //
    
    return <Fragment>{element}</Fragment>
}


export default RouteGuard;