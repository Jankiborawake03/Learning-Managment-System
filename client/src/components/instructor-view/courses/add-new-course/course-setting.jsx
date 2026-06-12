import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useContext, useState } from "react";
import { InstructorContext } from "@/context/instructor-context";
import { mediaUploadService, mediaDeleteService } from "@/services"; // Ensure mediaDeleteService is imported
import MediaProgressbar from "@/components/media-progress-bar";
import { Button } from "@/components/ui/button";

function CourseSetting() {
    const {
        courseLandingFormData,
        setCourseLandingFormData,
        mediaUploadProgress,
        setMediaUploadProgress,
        mediaUploadProgressPercentage,
        setMediaUploadProgressPercentage
    } = useContext(InstructorContext);

    const [isReplacing, setIsReplacing] = useState(false); // State to track if we are replacing an image

    async function handleImageUploadChange(event) {
        const selectedImage = event.target.files[0];

        if (selectedImage) {
            const imageFormData = new FormData();
            imageFormData.append('file', selectedImage);

            try {
                setMediaUploadProgress(true);
                const response = await mediaUploadService(imageFormData, setMediaUploadProgressPercentage);
                console.log(response, "response");
                if (response.success) {
                    setCourseLandingFormData({
                        ...courseLandingFormData,
                        image: response.data.url
                    });
                    setMediaUploadProgress(false);
                    setIsReplacing(false); // Reset replacing state after upload
                }
            } catch (error) {
                console.log(error);
            }
        }
    }

    async function handleReplaceImage() {
        // If there's an existing image, delete it before uploading a new one
        if (courseLandingFormData?.image) {
            const publicId = courseLandingFormData.image.split('/').pop().split('.')[0]; // Extract public ID from URL
            try {
                const response = await mediaDeleteService(publicId); // Call your delete service
                if (response?.success) {
                    console.log("Image deleted successfully");
                    setCourseLandingFormData({
                        ...courseLandingFormData,
                        image: null // Clear the image from state
                    });
                }
            } catch (error) {
                console.error("Error deleting image:", error);
            }
        }
        setIsReplacing(true); // Set replacing state to true to show the upload input
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>
                    Course Settings
                </CardTitle>
            </CardHeader>
            {mediaUploadProgress && (
                <p className="text-orange-600 text-sm p-2 ml-3">Uploading media, please wait...</p>
            )}
            <div className="p-2">
                {mediaUploadProgress ? 
                    <MediaProgressbar 
                        isMediaUploading={mediaUploadProgress}
                        progress={mediaUploadProgressPercentage}/> : null
                }
            </div>
            <CardContent>
                {courseLandingFormData?.image ? 
                    <div>
                        <img src={courseLandingFormData.image} alt="Course" />
                        <Button className="bg-red-600 mt-4" onClick={handleReplaceImage}>Replace Image</Button>
                    </div> :
                    <div className="flex flex-col gap-3">
                        <Label>Upload Course Image</Label>
                        <Input onChange={handleImageUploadChange}
                               type="file"
                               accept="image/*"
                               className="mb-4" />
                    </div>
                }
                
            </CardContent>
        </Card>
    );
}

export default CourseSetting;
