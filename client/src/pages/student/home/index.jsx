import { Button } from "@/components/ui/button";
import { AuthContext } from "@/context/auth-context";
import { useContext, useEffect, useState } from "react";
// import banner from "../../../../public/banner_img.jpeg";
import { courseCategories } from "@/config";
import fingerImage from "/hand.jpg";
import { StudentContext } from "@/context/student-context";
import { checkCoursePurchaseInfoService, fetchInstructorCourseListService } from "@/services";
import { useNavigate } from "react-router-dom";
// import React, { useState } from "react";

function StudentHomePage() {
    const { auth } = useContext(AuthContext); // Access auth context to give username
    const { studentViewCoursesList, setStudentViewCoursesList } =useContext(StudentContext);
    const navigate = useNavigate();

    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const images = [
        "/Web.jpg",
        "/backend.jpg",
        "/datascience.png",
        "/machine1.jpeg",
        "/cyber.avif",
        "/game.webp",

    ];

    useEffect(() => {
      const interval = setInterval(() => {
          setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
      }, 5000); // Change image every 5 seconds

      return () => clearInterval(interval); // Cleanup interval on component unmount
  }, []);

function handleNavigateToCoursesPage(getCurrentId)
{
   console.log(getCurrentId);
   sessionStorage.removeItem('filters');
   const currentFilter = {
    category :[getCurrentId]
   }

   sessionStorage.setItem('filters',JSON.stringify(currentFilter));
   navigate("/courses");
}

async function fetchAllStudentViewCourses() {
    const response = await fetchInstructorCourseListService();
    if(response?.success)  setStudentViewCoursesList(response?.data)

    console.log(response);                    //fetching all the courses to students
    
}

 async function handleCourseNavigate(getCurrentCourseId)
      {
        const response = await checkCoursePurchaseInfoService(getCurrentCourseId,auth?.user?._id);
        if(response?.success)
        {
          if(response?.data)
          {
            navigate(`/course-progress/${getCurrentCourseId}`)
          }
          else 
          {
            navigate(`/course/details/${getCurrentCourseId}`)
          }
        }
        // console.log(response,"handleCourseNavigate");
      }

    useEffect(()=>{
        fetchAllStudentViewCourses()
    },[])
   
    
// -------------there is only this file to show home page content u can show it on your home page too---
    return (
        <div className="min-h-screen bg-white">
            {/* Welcome message */}
             {auth.authenticate && auth.user && (
                <h1 className="text-1xl font-bold m-2 text-pink-400">
                Welcome {auth.user.userName} !
                </h1>
                )}
        <section className="flex flex-col lg:flex-row items-center jusitfy-between py-8 px-4 lg:px-8">
        <div className="lg:w-1/2 lg:pr-12">
          <h1 className="text-4xl font-bold mb-4 text-violet-800">Learn all the skills you need in one place !!!</h1>
          <p className="text-xl">
          From critical skills to technical topics, <span className="text-pink-400 font-bold shadow-lg h-6 w-10">LMS-App - By BytesBrigade</span> will supports your professional development.
          </p>
          <p className="text-green-600 font-3xl font-bold p-4">
           VARIETIES YOU WILL GET 
           <img src={fingerImage} alt="Finger pointing right" className="inline w-10 h-10" />
           <img src={fingerImage} alt="Finger pointing right" className="inline w-10 h-10" />
          </p>
        </div>
        <div className="lg:w-full mb-8 lg:mb-0">
          <img
            // src={banner}
            src={images[currentImageIndex]}
            width={600}
            height={400}
            className="w-full h-auto rounded-lg shadow-lg"
             alt="Banner"
          />
        </div>
        </section>
        <section className="py-8 px-4 lg:px-8 bg-gray-100">
        <h2 className="text-2xl font-bold mb-6">Course Categories</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {courseCategories.map((categoryItem) => (
            <Button
              className="justify-start"
              variant="outline"
              key={categoryItem.id}
              onClick={() => handleNavigateToCoursesPage(categoryItem.id)}
            >
              {categoryItem.label}
            </Button>
          ))}
        </div>
      </section>
      <section className="py-12 px-4 lg:px-8">
        <h2 className="text-2xl font-bold mb-6">Our Courses</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {studentViewCoursesList && studentViewCoursesList.length > 0 ? (
            studentViewCoursesList.map((courseItem) => (
              <div
                onClick={() => handleCourseNavigate(courseItem?._id)}
                className="border rounded-lg overflow-hidden shadow cursor-pointer"
              >
                <img
                  src={courseItem?.image}
                  width={300}
                  height={150}
                  className="w-full h-40 object-cover"
                />
                <div className="p-4">
                  <h3 className="font-bold mb-2">{courseItem?.title}</h3>
                  <p className="text-sm text-gray-700 mb-2">
                    {courseItem?.instructorName}
                  </p>
                  <p className="font-bold text-[16px]">
                    ${courseItem?.pricing}
                  </p>
                  <p className="text-sm text-gray-700 mb-2">
                  <span>
                  {courseItem?.students?.length}{" "}
                  {courseItem?.students?.length <= 1
                  ? "Student"
                  : "Students"}
                  </span>
                  </p>
                </div>
              </div>
            ))
          ) : (
            <h1>No Courses Found</h1>
          )}
        </div>
      </section>
     </div>
    );
    
    
}

export default StudentHomePage;