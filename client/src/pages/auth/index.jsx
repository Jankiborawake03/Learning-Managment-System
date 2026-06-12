// import {handleRegisterUser} from "@/context/auth-context";
import { ArrowUpDownIcon, CheckCircle, GraduationCap, PlayCircle } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {Link} from "react-router-dom";
import React, { useContext, useRef, useState } from "react";
import { courseCategories, signUpFormControls, sortOptions } from "@/config";
import { signInFormControls } from "@/config";
import CommonForm from "@/components/common-form";
import {Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AuthContext } from "@/context/auth-context";
import { Button } from "@/components/ui/button";
import banner from "/p5.png";
import { StudentContext } from "@/context/student-context";
import { fetchInstructorCourseListService, fetchStudentViewCourseListService } from "@/services";
import { useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose } from "@/components/ui/dialog"; // Import Dialog components
import { DropdownMenu, DropdownMenuContent, DropdownMenuRadioGroup, DropdownMenuRadioItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useNavigate } from "react-router-dom"; // Import useNavigate


export default function AuthPage() {

  const [activeTab,setActiveTab] = useState('signin');
  const {signInFormData,setSignInFormData,signUpFormData,setSignUpFormData,handleRegisterUser,handleLoginUser}=useContext(AuthContext);
   const { studentViewCoursesList, setStudentViewCoursesList} =useContext(StudentContext);
   const [sort, setSort] = useState("price-lowtohigh");
   const [filters, setFilters] = useState({});
   const [dialogOpen, setDialogOpen] = useState(false); // State for dialog visibility
  const [dialogMessage, setDialogMessage] = useState(""); // State for dialog message
  const [selectedCategory, setSelectedCategory] = useState(courseCategories[0].id);
  const [hoveredCourseId, setHoveredCourseId] = useState(null); // State to track hovered course
  const navigate = useNavigate(); // Initialize useNavigate 
  const signInSignUpRef = useRef(null);

 
  const getSelectedCategory = () => {
    return courseCategories.find(category => category.id === selectedCategory);
  };

  const selectedCategoryObject = getSelectedCategory();

  function toggleSignInSignUp() {
    setActiveTab(activeTab === 'signin' ? 'signup' : 'signin');
    if (signInSignUpRef.current) {
      signInSignUpRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }

  function handleTabChange(value){
    setActiveTab(value)
  }

  function checkIfSignInFormIsValid()
  {
    return signInFormData && signInFormData.userEmail !=='' && signInFormData.password !=='' ;
  }

  function checkIfSignUpFormIsValid()
  {
    return signUpFormData && signUpFormData.userName !=='' && signUpFormData.userEmail !=='' && signUpFormData.password !==''  && signUpFormData.role !== '' ;
  }
  console.log(signInFormData);

  async function fetchAllStudentViewCourses() {
      const response = await fetchInstructorCourseListService();
      console.log("instrucors courses list is: ", response);

      if(response?.success)  setStudentViewCoursesList(response?.data)
  
      console.log(response);                    //fetching all the courses to students
     
  }

   useEffect(()=>{
          fetchAllStudentViewCourses()
      },[]);

      async function fetchAllStudentViewCourses(filters, sort) {
        const query = new URLSearchParams({
            ...filters,
            sortBy: sort,
            category: selectedCategory || undefined // Add the selected category to the query
        });
        const response = await fetchStudentViewCourseListService(query);
        if (response?.success) {
            setStudentViewCoursesList(response?.data);
            // setLoadingState(false);
        }
    }
    

    useEffect(() => {
      if (filters !== null && sort !== null) {
          fetchAllStudentViewCourses(filters, sort);
      }
  }, [filters, sort]);

  // UseEffect to fetch courses based on filters, sort, and selectedCategory
useEffect(() => {
    fetchAllStudentViewCourses(filters, sort);
}, [filters, sort, selectedCategory]);



  //dialog 
  const handleRegistration = async (event) => {
    try {
        const response = await handleRegisterUser(event);
        console.log(response);
        if (response.success) {
            setDialogMessage("Registration successful! SIGN IN now...");
            setDialogOpen(true);
        } else if (response.error === "Email already exists") {
            setDialogMessage("This email is already registered.");
            setDialogOpen(true);
        } else {
            setDialogMessage("Registration failed. Please try again.");
            setDialogOpen(true);
        }
    } catch (error) {
        console.error("Registration error:", error);
        setDialogMessage("User with  this email id already exist.");
        setDialogOpen(true);
    }
};

const resetSignUpForm = () => {
  setSignUpFormData({
      userName: '',
      userEmail: '',
      password: '',
      role: ''
  });
};

const resetSignInForm = () => {
  setSignInFormData({
     
      userEmail: '',
      password: '',
     
  });
};


const handleDialogClose = () => {
    setDialogOpen(false);
    resetSignUpForm(); // Reset the signup form when the dialog is closed
    resetSignInForm();  //Reset signin form data

};

const handleLogin = async (event) => {
  try {
      const response = await handleLoginUser(event); // Call handleLoginUser and await its response
      if (response.success && response.data.user) {

        console.log("user who is logging in is", response);
        const accessValue = response.data.user.access; // Access the access value
        console.log("Access value:", accessValue);
        const userrole = response.data.user.role; // Access the user role
        console.log("User role:", userrole);
    
        if (userrole === 'instructor') {
          if (accessValue === 'true') {
            // Proceed with the login
            setDialogMessage("Login successful!"); // Success message
          } else {
            // If access is denied for instructor
            setDialogMessage("Instructor, You didn't have an access yet...try later!"); // Unauthorized message
            setDialogOpen(true); // Open the dialog to show the message
          }
        } else {
          // Handle other user roles if necessary
          setDialogMessage("Login successful!"); // Success message for other roles
        }
      } else {
          setDialogMessage("Login credentials are not valid...try again!"); // Error message
      }
      setDialogOpen(true); // Open the dialog to show the message
  } catch (error) {
      console.error("Login error:", error);
      setDialogMessage("Invalid username or password!"); // General error message
      setDialogOpen(true); // Open the dialog to show the error message
  }
};

const handleExploreCourse = () => {
  setDialogMessage("You need to log in or register to explore this course.");
  setDialogOpen(true);
  // navigate("/"); // Redirect to the home page
   // Scroll to the sign-in/sign-up section
   if (signInSignUpRef.current) {
    signInSignUpRef.current.scrollIntoView({ behavior: 'smooth' });
  }
};

  return (
    
    <div className="flex flex-col min-h-screen ">

      <header className="px-4 lg:px-6 h-14 flex items-center border-b">
        <Link href="/" className="flex items-center justify-center">
        <GraduationCap className="h-10 w-10 mr-4 text-orange-500"/>
        <span className="font-bold text-xl text-orange-500">LMS-App</span>
        </Link>
        <Button onClick={toggleSignInSignUp} className="ml-auto bg-orange-500">
          {activeTab === 'signin' ? 'Switch to Sign Up' : 'Switch to Sign In'}
        </Button>
      </header>
    

<div className="flex items-center justify-end min-h-screen" style={{ backgroundImage: "url('src/assets/p2.jpeg')" ,
   backgroundRepeat: "no-repeat",
   backgroundSize: "cover",
   backgroundPosition: "center",
   height: "100vh", // optional if you're using min-h-screen
   width: "100vw"
}}>
 {/*<Tabs value={activeTab} defaultValue="signin" onValueChange={handleTabChange} className="w-full max-w-md mr-8">
  <TabsList className="grid w-full grid-cols-2">
    <TabsTrigger value="signin">Sign In</TabsTrigger>
    <TabsTrigger value="signup">Sign Up</TabsTrigger>
  </TabsList>
  <TabsContent value="signin">
   <CommonForm formControls={signInFormControls}/> 
   <Card className="p-6 space-y-4">
   <CardHeader>
    <CardTitle>Sign in to your account</CardTitle>
    <CardDescription>
      Enter your email and password to access your account
    </CardDescription>
   </CardHeader>
   <CardContent className="space-y-2">
    <CommonForm 
    formControls={signInFormControls}
    buttonText={'Sign In'}
    formData={signInFormData}
    setFormData={setSignInFormData}
    isButtonDisabled={!checkIfSignInFormIsValid()}
    handleSubmit={handleLogin}/>
   </CardContent>
   </Card>
   </TabsContent>
  <TabsContent value="signup">
    <CommonForm formControls={signUpFormControls}/> 
    <Card className="p-6 space-y-4">
   <CardHeader>
    <CardTitle>Sign Up to create your account</CardTitle>
    <CardDescription>
      Let's enter a details to create the account
    </CardDescription>
   </CardHeader>
   <CardContent className="space-y-2">
    <CommonForm 
    formControls={signUpFormControls}
    buttonText={'Sign Up'}
    formData={signUpFormData}
    setFormData={setSignUpFormData}
    isButtonDisabled={!checkIfSignUpFormIsValid()}
    handleSubmit={handleRegistration}
    />
   </CardContent>
   </Card>
  </TabsContent>
</Tabs>*/}
</div>
{/* Dialog for messages */}
<Dialog open={dialogOpen} onOpenChange={handleDialogClose}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{dialogMessage}</DialogTitle>
          </DialogHeader>
          <DialogClose>Close</DialogClose>
        </DialogContent>
      </Dialog>
    {/* adding about us  */}
     {/* <section className="flex flex-col lg:flex-row items-center jusitfy-between py-8 px-4 lg:px-8">
            <div className="lg:w-1/2 lg:pr-12">
            <p className="text-2xl mb-4"><span className="text-blue-600 font-bold shadow-lg h-6 w-10">Know About us !!! </span></p>
           <h1 className="text-2xl font-bold mb-4 text-violet-800">Technology and the world of work change fast — with us, you’re faster. 
            Get the skills to achieve goals and stay competitive.</h1>
              <p className="text-xl">
              From critical skills to technical topics, <span className="text-pink-400 font-bold shadow-lg h-6 w-10">LMS-App - By BytesBrigade</span> will supports your professional development.
              So lets improved your skills and knowledge with our LMS-App.
    
              </p>
            </div>
            <div className="lg:w-full mb-8 lg:mb-0">
              <img
                src={banner}
                width={600}
                height={300}
                className="w-full h-auto rounded-lg shadow-lg"
              />
            </div>
      </section> */}
    
    {/* adding categoies part section  */}
     <section className="py-8 px-4 lg:px-8 bg-gray-100">
             <h2 className="text-2xl font-bold mb-6">Available Course Categories</h2>
             <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
               {courseCategories.map((categoryItem) => (
                 <Button
                 className="justify-start"
                 variant="outline"
                 key={categoryItem.id}
                 onClick={() => {
                     if (selectedCategory === categoryItem.id) {
                         // If the category is already selected, reset to show all courses
                         setSelectedCategory(null); // Reset the selected category
                     } else {
                         // Set the selected category and fetch courses for that category
                         setSelectedCategory(categoryItem.id); // Set the selected category
                     }
                     setFilters({}); // Reset filters if needed
                     fetchAllStudentViewCourses(); // Fetch courses based on the selected category
                 }}
             >
                 {categoryItem.label}
             </Button>
               ))}
              
             </div>
           </section>
      {/* till this */}
      <section className="py-12 px-4 lg:px-8">
        
        <h2 className="text-2xl font-bold mb-6">Our Courses for {selectedCategoryObject ? selectedCategoryObject.label : "All Categories"} </h2>
        {/* adding the logic for sorting */}

        <div className="flex justify-end items-center mb-4 gap-5">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-2 p-5"
                >
                  <ArrowUpDownIcon className="h-4 w-4" />
                  <span className="text-[16px] font-medium">Sort By</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-[180px]">
                <DropdownMenuRadioGroup
                  value={sort}
                  onValueChange={(value) => setSort(value)}
                >
                  {sortOptions.map((sortItem) => (
                    <DropdownMenuRadioItem
                      value={sortItem.id}
                      key={sortItem.id}
                    >
                      {sortItem.label}
                    </DropdownMenuRadioItem>
                  ))}
                </DropdownMenuRadioGroup>
              </DropdownMenuContent>
            </DropdownMenu>
            <span className="text-sm text-black font-bold">
              {studentViewCoursesList.length} Results
            </span>
          </div>

        {/* till here  */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {studentViewCoursesList && studentViewCoursesList.length > 0 ? (
            studentViewCoursesList.map((courseItem) => (
              <div
                // onClick={() => handleCourseNavigate(courseItem?._id)}
                key={courseItem?._id}
                // onMouseEnter={() => setHoveredCourseId(courseItem?.id)} // Set hovered course ID on mouse enter
                onMouseEnter={() => {
                  console.log(courseItem);
                  setHoveredCourseId(courseItem?._id); // Set hovered course ID on mouse enter
                  console.log("Hovered Course ID:", courseItem?._id); // Log the hovered course ID
                }}
                onMouseLeave={() => setHoveredCourseId(null)} // Reset on mouse leave
                className="border rounded-lg overflow-hidden shadow cursor-pointer relative"
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
                  <p className="text-sm text-gray-700 mb-2">
                    Level : {courseItem?.level}
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
                 {/* Hover Information */}
        {hoveredCourseId === courseItem?._id && (
          <div className="absolute inset-0 bg-black bg-opacity-50 flex flex-col justify-center items-center text-white p-4">
            <h4 className="font-bold">{courseItem?.title}</h4>
            created on:<p>{courseItem?.date.split("T")[0]}</p>
            {/* Description :- <p>{courseItem?.description}</p> */}
            <p className="font-bold">What you will learn</p>
            <ul className="">
                {courseItem?.objectives
                  .split(",")
                  .slice(0, 2) // Only take the first three objectives
                  .map((objective, index) => (
                    <li key={index} className="flex items-start">
                      <CheckCircle className="mr-2 h-5 w-5 text-green-500 flex-shrink-0" />
                      <span>{objective}</span>
                    </li>
                  
                  ))}
              </ul>
            
            <Button className="mt-2 bg-red-600" onClick={handleExploreCourse}>Explore Course </Button>
          </div>
        )}
              </div>
            ))
          ) : (
            <h1>No Courses Found</h1>
          )}
        </div>
      </section>
      {/* added courses  */}
      <hr></hr>
       {/* adding about us  */}
     <section className="flex flex-col lg:flex-row items-center jusitfy-between py-8 px-4 lg:px-8">
            <div className="lg:w-1/2 lg:pr-12">
            <p className="text-2xl mb-4"><span className="text-blue-600 font-bold shadow-lg h-6 w-10">Know About us !!! </span></p>
           <h1 className="text-2xl font-bold mb-4 text-violet-800">Technology and the world of work change fast — with us, you’re faster. 
            Get the skills to achieve goals and stay competitive.</h1>
              <p className="text-xl">
              From critical skills to technical topics, <span className="text-pink-400 font-bold shadow-lg h-6 w-10">LMS-App - By BytesBrigade</span> will supports your professional development.
              So lets improved your skills and knowledge with our LMS-App.
    
              </p>
            </div>
            <div className="lg:w-full mb-8 lg:mb-0">
              <img
                src={banner}
                width={600}
                height={100}
                className="w-full h-auto rounded-lg shadow-lg"
              />
            </div>
      </section>
      <hr></hr><br></br><br></br>
  <section ref={signInSignUpRef}className="flex items-center justify-center">
  <Tabs value={activeTab} defaultValue="signin" onValueChange={handleTabChange} className="w-full max-w-md">
  <TabsList className="grid w-full grid-cols-2">
    <TabsTrigger value="signin">Sign In</TabsTrigger>
    <TabsTrigger value="signup">Sign Up</TabsTrigger>
  </TabsList>
  <TabsContent value="signin">
   {/* <CommonForm formControls={signInFormControls}/> */}
   <Card className="p-6 space-y-4">
   <CardHeader>
    <CardTitle>Sign in to your account</CardTitle>
    <CardDescription>
      Enter your email and password to access your account
    </CardDescription>
   </CardHeader>
   <CardContent className="space-y-2">
    <CommonForm 
    formControls={signInFormControls}
    buttonText={'Sign In'}
    formData={signInFormData}
    setFormData={setSignInFormData}
    isButtonDisabled={!checkIfSignInFormIsValid()}
    handleSubmit={handleLogin}/>
   </CardContent>
   </Card>
   </TabsContent>
  <TabsContent value="signup">
    {/* <CommonForm formControls={signUpFormControls}/> */}
    <Card className="p-6 space-y-4">
   <CardHeader>
    <CardTitle>Sign Up to create your account</CardTitle>
    <CardDescription>
      Let's enter a details to create the account
    </CardDescription>
   </CardHeader>
   <CardContent className="space-y-2">
    <CommonForm 
    formControls={signUpFormControls}
    buttonText={'Sign Up'}
    formData={signUpFormData}
    setFormData={setSignUpFormData}
    isButtonDisabled={!checkIfSignUpFormIsValid()}
    handleSubmit={handleRegistration}
    />
   </CardContent>
   </Card>
  </TabsContent>
</Tabs>

  </section>
      <br></br><br></br>
      <footer className="bg-gray-800 text-white py-8">
  <div className="container mx-auto px-4">
    <div className="flex flex-col md:flex-row justify-between">
      <div className="mb-6 md:mb-0">
        <h2 className="text-lg font-bold mb-2">About Us</h2>
        <p className="text-sm">
          LMS-App is dedicated to providing the best learning experience. Join us to enhance your skills and knowledge.
        </p>
      </div>
      <div className="mb-6 md:mb-0">
        <h2 className="text-lg font-bold mb-2">Quick Links</h2>
        <ul className="space-y-1">
          <li><Link to="/" className="text-gray-400 hover:text-white">LMS-APP</Link></li>
          {/* <li><Link to="/about" className="text-gray-400 hover:text-white">About</Link></li> */}
         
        </ul>
      </div>
      <div>
        <h2 className="text-lg font-bold mb-2">Contact Us</h2>
        <p className="text-sm">Email: support@lms-app.com</p>
        <p className="text-sm">Phone: +1 (234) 567-890</p>
      </div>
    </div>
    <div className="mt-8 border-t border-gray-700 pt-4 text-center">
      <p className="text-sm">&copy; 2025 LMS-App. All rights reserved.</p>
      <div className="flex justify-center space-x-4 mt-2">
        <Link to="#" className="text-gray-400 hover:text-white">
          <i className="fab fa-facebook-f"></i>
        </Link>
        <Link to="#" className="text-gray-400 hover:text-white">
          <i className="fab fa-twitter"></i>
        </Link>
        <Link to="#" className="text-gray-400 hover:text-white">
          <i className="fab fa-instagram"></i>
        </Link>
      </div>
    </div>
  </div>
</footer>


      </div>
      

  );
}
