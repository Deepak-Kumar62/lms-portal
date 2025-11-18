import MediaProgressbar from "@/components/MediaProgressbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useInstructorContext } from "@/contexts/InstructorContext";

const CourseSettings = () => {
  const {
    courseLandingFormData,
    mediaUploadProgress,
    mediaUploadProgressPercentage,
    handleImageUpload
  } = useInstructorContext();

  return (
    <Card className="w-full shadow-md">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg sm:text-xl md:text-2xl font-bold">
          Course Settings
        </CardTitle>
      </CardHeader>

      {/* Upload Progress */}
      <div className="px-4 sm:px-6">
        {mediaUploadProgress && (
          <MediaProgressbar
            isMediaUploading={mediaUploadProgress}
            progress={mediaUploadProgressPercentage}
          />
        )}
      </div>

      <CardContent className="p-4 sm:p-6 space-y-4">

        {/* IMAGE PREVIEW RESPONSIVE */}
        {courseLandingFormData?.image ? (
          <div className="w-full flex justify-center">
            <img
              src={courseLandingFormData.image}
              alt="Course"
              className="w-full max-w-xs sm:max-w-sm md:max-w-md rounded-md shadow-md object-cover"
            />
          </div>
        ) : (
          <div className="flex flex-col gap-3 w-full">
            <Label className="text-sm sm:text-base font-semibold">
              Upload Course Image
            </Label>
            <Input
              className="cursor-pointer text-sm sm:text-base"
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
            />
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default CourseSettings;
