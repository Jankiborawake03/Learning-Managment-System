// import { useState } from 'react'
// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'
// import './App.css'
// import { Button } from "./components/ui/button";
import {Route,Routes} from "react-router-dom";
import AuthPage from "./pages/auth"; 
import RouteGuard from "./components/route-guard";
import { useContext } from "react";
import { AuthContext } from "./context/auth-context";
import InstructorDashboardpage from "./pages/instructor";
import AdminDashboardpage from "./pages/admin";
import StudentHomePage from "./pages/student/home";
import NotFoundPage from "./pages/not-found";
import AddNewCoursepage from "./pages/instructor/add-new-course";
import StudentViewCommonLayout from "./components/student-view/common-layout";
import StudentViewCoursesPage from "./pages/student/courses";
import StudentViewCourseDetailsPage from "./pages/student/course-details";
import PaypalPaymentReturnPage from "./pages/student/payment-return";
import StudentCoursesPage from "./pages/student/student-courses";
import StudentViewCourseProgressPage from "./pages/student/course-progress";

function App() {
  const {auth}=useContext(AuthContext)
  return (
    <Routes>
      {/* <Button className="bg-red-500">Check it</Button> */}
      {/* <Route path="/auth" element={<AuthPage/>} /> */}
      <Route
      path="/auth" 
      element={
        <RouteGuard
        element={<AuthPage/>}
        authenticated={auth?.authenticate}
        user={auth?.user}/>
      }/>
      
      <Route
      path="/instructor"
      element={
        <RouteGuard
        element={<InstructorDashboardpage/>}
        authenticated={auth?.authenticate}
        user={auth?.user}/>
      }/>
      
      
      <Route
      path="/admin"
      element={
        <RouteGuard
        element={<AdminDashboardpage/>}
        authenticated={auth?.authenticate}
        user={auth?.user}/>
      }/>

    <Route
      path="/instructor/create-new-course"
      element={
        <RouteGuard
        element={<AddNewCoursepage/>}
        authenticated={auth?.authenticate}
        user={auth?.user}/>
      }/>

<Route
      path="/instructor/edit-course/:courseId"
      element={
        <RouteGuard
        element={<AddNewCoursepage/>}
        authenticated={auth?.authenticate}
        user={auth?.user}/>
      }/>

      <Route
      path="/"
      element={
        <RouteGuard
        element={<StudentViewCommonLayout/>}
        authenticated={auth?.authenticate}
        user={auth?.user}/>
         }>

          
      
      <Route path="" element={<StudentHomePage />}/>
      <Route path="home" element={<StudentHomePage />}/>
      <Route path="courses" element={<StudentViewCoursesPage />}/>
      <Route path="course/details/:id" element={<StudentViewCourseDetailsPage />}/>
      <Route path="payment-return" element={<PaypalPaymentReturnPage/>}/>
      <Route path="student-courses" element={<StudentCoursesPage/>}/>
      <Route path="course-progress/:id" element={<StudentViewCourseProgressPage/>}/>

      
      </Route>
      <Route path="*" element={<NotFoundPage></NotFoundPage>} />
    </Routes> 
  );
}


export default App