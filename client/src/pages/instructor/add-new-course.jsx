import CourseCurriculum from "@/components/instructor-view/courses/add-new-course/course-curriculum";
import CourseLanding from "@/components/instructor-view/courses/add-new-course/course-landing";
import CourseSetting from "@/components/instructor-view/courses/add-new-course/course-setting";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs,TabsContent,TabsList, TabsTrigger } from "@/components/ui/tabs";
import { courseCurriculumInitialFormData, courseLandingInitialFormData } from "@/config";
import { AuthContext } from "@/context/auth-context";
import { InstructorContext } from "@/context/instructor-context";
import { addNewCourseService, fetchInstructorCourseDetailsService, updateCourseByIdService } from "@/services";
import { useContext, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";


function AddNewCoursepage() {
const {courseLandingFormData,courseCurriculumFormData,setCourseLandingFormData,
  setCourseCurriculumFormData,currentEditedCourseId,setCurrentEditedCourseId} = useContext(InstructorContext);

const {auth} = useContext(AuthContext)
const navigate = useNavigate();
const params = useParams();

console.log(params);
function isEmpty(value)
{
  if(Array.isArray(value))
  {
    return value.length === 0
  }
  return value==="" || value ===null || value ===undefined
}
  function validateFormData()
  {
    for(const key in courseLandingFormData)
    {
      if(isEmpty(courseLandingFormData[key]))
      {
        return false
      }
    }

    let hasFreePreview = false;

    for(const item of courseCurriculumFormData)
    {
      if(isEmpty(item.title) || isEmpty(item.videoUrl) || isEmpty(item.public_id))
      {
        return false;
      }
       if(item.freePreview)
       {
        hasFreePreview = true //found at least one free preview
       }
    }
    return hasFreePreview;
  }

  async function handleCreateCourse()
  { 
    const courseFinalFormData = 
    {
      instructorId: auth?.user?._id,
      instructorName: auth?.user?.userName,
      date: new Date(),
      ...courseLandingFormData,
      students: [
       
      ],
      curriculum: courseCurriculumFormData,
      isPublised: true,
    }
    
    const response = 
    currentEditedCourseId !== null ? await updateCourseByIdService(currentEditedCourseId,courseFinalFormData) : 
    await addNewCourseService(courseFinalFormData);

    if(response ?.success)
    {
      setCourseLandingFormData(courseLandingInitialFormData)
      setCourseCurriculumFormData(courseCurriculumInitialFormData)
      navigate(-1);
      setCurrentEditedCourseId(null)
    }
    console.log(courseFinalFormData,'courseFinalFormData');
    
  }

  async function fetchCurrentCourseDetails() {
    const response = await fetchInstructorCourseDetailsService(
      currentEditedCourseId
    );

    if (response?.success) {
      const setCourseFormData = Object.keys(
        courseLandingInitialFormData
      ).reduce((acc, key) => {
        acc[key] = response?.data[key] || courseLandingInitialFormData[key];

        return acc;
      }, {});

      console.log(setCourseFormData, response?.data, "setCourseFormData");
      setCourseLandingFormData(setCourseFormData);
      setCourseCurriculumFormData(response?.data?.curriculum);
    }

    console.log(response, "response");
  }

  useEffect(() => {
    if (currentEditedCourseId !== null) fetchCurrentCourseDetails();
  }, [currentEditedCourseId]);

  useEffect(() => {
    if (params?.courseId) setCurrentEditedCourseId(params?.courseId);
  }, [params?.courseId]);

  console.log(params, currentEditedCourseId, "params");

  const isButtonDisabled = !validateFormData();
    return ( 
        <div className="container mx-auto p-4">
            <div className="flex justify-between">
                <h1 className="text-3xl font-extrabold mb-5 text-orange-500">Create a new course here !</h1>
                <Button className="text-sm tracking-wider font-bold px-8 bg-orange-500" style={{ border: '2px solid black' }} disabled={!validateFormData()} onClick={handleCreateCourse}>Submit</Button>
                
            </div>
            <Card>
              <CardContent>
                <div className="container mx-auto p-4">
                    <Tabs defaultValue="course-landing-page" className="space-y-4">
                      <TabsList>
                        <TabsTrigger value="course-landing-page">Course Landing Page</TabsTrigger>
                        <TabsTrigger value="curriculum">Curriculum</TabsTrigger>
                        <TabsTrigger value="settings">Settings</TabsTrigger>
                      </TabsList>
                      {/* {isButtonDisabled && (
                      <p className="text-red-500 mb-8 font-bold">
                       Must follow all 3 phases --- course-landing --- course-curriculum --- course setting to add your course.
                      </p>
                      )} */}
                      {isButtonDisabled && (
                       <p className="text-red-500 mb-8 font-bold">
                        Must follow all 3 phases 
                       <span className="mx-2">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 inline" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14M12 5l7 7-7 7" />
                       </svg>
                       </span>
                        course-landing 
                       <span className="mx-2">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 inline" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14M12 5l7 7-7 7" />
                        </svg>
                       </span>
                        course-curriculum 
                       <span className="mx-2">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 inline" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14M12 5l7 7-7 7" />
                        </svg>
                        </span>
                        course setting to add your course.
                        </p>
                        )}

                      <TabsContent value="curriculum">
                       <CourseCurriculum/>
                      </TabsContent>
                      <TabsContent value="course-landing-page">
                        <CourseLanding />
                      </TabsContent>
                      <TabsContent value="settings">
                        <CourseSetting/>
                      </TabsContent>
                    </Tabs>

                </div>
              </CardContent>
            </Card>
            
        </div>
       
 );
}

export default AddNewCoursepage;
