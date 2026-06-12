import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { InstructorContext } from "@/context/instructor-context";
import { useContext, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { courseCurriculumInitialFormData } from "@/config";
import { mediaBulkUploadService, mediaDeleteService, mediaUploadService } from "@/services";
import MediaProgressbar from "@/components/media-progress-bar";
import VideoPlayer from "@/components/video-player";
import { Upload } from "lucide-react";
// import { useState } from "react";

function CourseCurriculum() {
  
    const {courseCurriculumFormData,setCourseCurriculumFormData,mediaUploadProgress,
        setMediaUploadProgress,mediaUploadProgressPercentage,setMediaUploadProgressPercentage} = useContext(InstructorContext);
    
    const bulkUploadInputRef = useRef(null);
    function handleNewLecture()
    {
         setCourseCurriculumFormData([
            ...courseCurriculumFormData,
            {
                ...courseCurriculumInitialFormData[0],
            }
         ])
    }

    function handleCourseTitleChange(event,currentIndex)
    {
        let cpyCourseCurriculumFormData = [...courseCurriculumFormData]
        // console.log(cpyCourseCurriculumFormData,"cpyCourseCurriculumFormData");
        cpyCourseCurriculumFormData[currentIndex] = 
        {
            ...cpyCourseCurriculumFormData[currentIndex],
            title:event.target.value
        }
        // console.log(cpyCourseCurriculumFormData,"cpyCourseCurriculumFormData");
        setCourseCurriculumFormData(cpyCourseCurriculumFormData)
    }

    function handleFreePreviewChange(currentValue,currentIndex)
    {
       console.log(currentValue,currentIndex);
       let cpyCourseCurriculumFormData = [...courseCurriculumFormData]
        // console.log(cpyCourseCurriculumFormData,"cpyCourseCurriculumFormData");
        cpyCourseCurriculumFormData[currentIndex] = 
        {
            ...cpyCourseCurriculumFormData[currentIndex],
            freePreview:currentValue,
        };
        setCourseCurriculumFormData(cpyCourseCurriculumFormData)
    }

    async function handleSingleLectureUpload(event,currentIndex)
    {
        console.log(event.target.files);
        const selectedFile = event.target.files[0];

        if(selectedFile)
        {
            const videoFormData = new FormData();
            videoFormData.append('file',selectedFile)

            try 
            {
               setMediaUploadProgress(true);
               const response=await mediaUploadService(videoFormData,setMediaUploadProgressPercentage);
                if(response.success)
                {
                    let cpyCourseCurriculumFormData = [...courseCurriculumFormData]
                    cpyCourseCurriculumFormData[currentIndex]={
                        ...cpyCourseCurriculumFormData[currentIndex],
                        videoUrl : response?.data?.url,
                        public_id : response?.data?.public_id
                    }
                    setCourseCurriculumFormData(cpyCourseCurriculumFormData);
                    setMediaUploadProgress(false)
                }
            //    console.log(response,'response');
            }
            catch(error)
            {
              console.log(error);
            }
        }
    }

    console.log(courseCurriculumFormData);
   
    async function handleReplaceVideo(currentIndex)
    {
        let cpyCourseCurriculumFormData = [...courseCurriculumFormData];
        const getCurrentVideoPublicId = cpyCourseCurriculumFormData[currentIndex] .public_id;

        const deleteCurrentMediaResponse = await mediaDeleteService(getCurrentVideoPublicId)

        console.log(deleteCurrentMediaResponse,deleteCurrentMediaResponse);

        if (deleteCurrentMediaResponse?.success) {
            cpyCourseCurriculumFormData[currentIndex] = {
              ...cpyCourseCurriculumFormData[currentIndex],
              videoUrl: "",
              public_id: "",
            };
            setCourseCurriculumFormData(cpyCourseCurriculumFormData);
        }
    }
    function isCourseCurriculumFormDataValid() {
        return courseCurriculumFormData.every((item) => {
          return (
            item &&
            typeof item === "object" &&
            item.title.trim() !== "" &&
            item.videoUrl.trim() !== ""
          );
        });
      }

      function handleOpenBulkUpload()
      {
        bulkUploadInputRef.current?.click()
      }

    function areAllCourseCurriculumFormDataObjectsEmpty(arr)
    {
       return arr.every((obj)=>{
        return Object.entries(obj).every(([key,value])=>
        {
            if(typeof value === 'boolean')
            {
                return true
            }
            return value===''
        })
       })
    }
     
    async function handleMediaBulkUpload(event) {
        const selectedFiles = Array.from(event.target.files);
        const bulkFormData = new FormData();
    
        selectedFiles.forEach((fileItem) => bulkFormData.append("files", fileItem));
    
        try {
          setMediaUploadProgress(true);
          const response = await mediaBulkUploadService(
            bulkFormData,
            setMediaUploadProgressPercentage
          );
    
          console.log(response, "bulk");
          if (response?.success) {
            let cpyCourseCurriculumFormdata =
              areAllCourseCurriculumFormDataObjectsEmpty(courseCurriculumFormData)
                ? []
                : [...courseCurriculumFormData];
    
            cpyCourseCurriculumFormdata = [
              ...cpyCourseCurriculumFormdata,
              ...response?.data.map((item, index) => ({
                videoUrl: item?.url,
                public_id: item?.public_id,
                title: `Lecture ${
                  cpyCourseCurriculumFormdata.length + (index + 1)
                }`,
                freePreview: false,
              })),
            ];
            setCourseCurriculumFormData(cpyCourseCurriculumFormdata);
            setMediaUploadProgress(false);
          }
        } catch (e) {
          console.log(e);
        }
      }
    
      console.log(courseCurriculumFormData);

      async function handleDeletelectLecture(currentIndex)
      {
        let cpyCourseCurriculumFormData = [...courseCurriculumFormData]
        console.log(cpyCourseCurriculumFormData[currentIndex]);
        const getCurrentSelectedVideoPublicId = cpyCourseCurriculumFormData[currentIndex].public_id;

        const response = await mediaDeleteService(getCurrentSelectedVideoPublicId);

        if(response?.success)
        {
            cpyCourseCurriculumFormData = cpyCourseCurriculumFormData.filter((_,index) => index!==currentIndex);
            setCourseCurriculumFormData(cpyCourseCurriculumFormData);
        }
      }

    return ( 
        <Card>
            <CardHeader className="flex flex-row justify-between">
                <CardTitle>
                    Create Course Curriculum
                </CardTitle>
                <div>
                    <Input 
                    type="file"
                    ref={bulkUploadInputRef}
                    accept="video/*"
                    multiple
                    className = "hidden"
                    id="bulk-media-upload"
                    onChange={handleMediaBulkUpload}
                    />
                    <Button 
                     as="label"
                     htmlFor="bulk-media-upload"
                     variant="outline"
                     className="cursor-pointer"
                     onClick={handleOpenBulkUpload}>
                        <Upload className="w-4 h-5 mr-2" />Bulk Upload
                    </Button>
                </div>
            </CardHeader>
            <CardContent>
                {/* <Button disabled={!isCourseCurriculumFormDataValid() || mediaUploadProgress} onClick={handleNewLecture}>
                    Add lecture
                </Button> */}
                <Button 
                 onClick={handleNewLecture} 
                 className={` ${!isCourseCurriculumFormDataValid() || mediaUploadProgress ? 'bg-red-900 cursor-not-allowed' : 'bg-orange-500'} `}
                 disabled={!isCourseCurriculumFormDataValid() || mediaUploadProgress}
                >
                {mediaUploadProgress ? (
                <span>Adding lecture</span> // You can replace this with a spinner component
                ) : (
                <span>Add Lecture</span>
                )}
                </Button>
                {!isCourseCurriculumFormDataValid() && (
                <p className="text-red-500 text-sm"><b>Please fill in all required fields.(Aleast one free preview is mandatory)</b></p>
                )}
                {mediaUploadProgress && (
                <p className="text-orange-600 text-sm">Uploading media, please wait...(Size of media must be less than 40MB)</p>
                )}

                {
                    mediaUploadProgress ? 
                    <MediaProgressbar 
                     isMediaUploading={mediaUploadProgress}
                     progress={mediaUploadProgressPercentage}/> : null
                }
                <div className="mt-4 space-y-4">
                    {
                        courseCurriculumFormData.map((curriculumItem,index) =>(
                            <div className="border p-5 rounded-md">
                                <div className="flex gap-5 item-center">
                                 <h3 className="font-semibold">Lecture {index+1}</h3>
                                 <Input 
                                 name={`title-${index+1}`}
                                 placeholder="Enter lecture title"
                                 className="max-w-96"
                                 onChange={(event)=>handleCourseTitleChange(event,index)}
                                 value={courseCurriculumFormData[index]?.title}
                                 />
                                 <div className="flex-item-center space-x-2">
                                    <Switch onCheckedChange={(value)=>handleFreePreviewChange(value,index)}
                                    checked={courseCurriculumFormData[index]?.freePreview}
                                    id={`freePreview-${index+1}`}></Switch>
                                    <Label htmlFor={`freePreview-${index+1}`}>Free Preview</Label>
                                 </div>
                                </div>
                                <div className="mt-6">
                                    {
                                        courseCurriculumFormData[index]?.videoUrl ? 
                                        <div className="flex gap-3">
                                            <VideoPlayer url={courseCurriculumFormData[index]?.videoUrl} 
                                            width="450px"
                                            height="200px"/>
                                            <Button onClick={()=>handleReplaceVideo(index)}>Replace video</Button>
                                            <Button onClick={()=>handleDeletelectLecture(index)} className="bg-red-900">Delete Lecture</Button>
                                        </div> : <Input type="file" accept="video/*" onChange={(event)=>handleSingleLectureUpload(event,index)} className="mb-4" />
                                    }
                                    
                                </div>
                            </div>
                        ))
                    }
                </div>
            </CardContent>
        </Card>
        
 );
}

export default CourseCurriculum;
