import MediaProgressbar from "@/components/MediaProgressbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import VideoPlayer from "@/components/VideoPlayer";
import { useInstructorContext } from "@/contexts/InstructorContext";
import { Upload } from "lucide-react";
import { useRef } from "react";

const CourseCurriculum = () => {
  const {
    courseCurriculumFormData,
    handleSingleLectureUpload,
    mediaUploadProgress,
    mediaUploadProgressPercentage,
    handleLectureTitleChange,
    handleLectureFreePreviewChange,
    handleLectureReplace,
    handleLectureDelete,
    handleBulkLectureUpload,
    handleAddLecture,
    isCourseCurriculumFormDataValid
  } = useInstructorContext();

  const bulkUploadInputRef = useRef();

  function handleOpenBulkUploadDialog() {
    bulkUploadInputRef.current?.click();
  }

  return (
    <Card className="w-full">
      {/* HEADER */}
      <CardHeader className="flex flex-col sm:flex-row justify-between gap-4">
        <CardTitle className="text-xl sm:text-2xl font-bold">
          Create Course Curriculum
        </CardTitle>

        <div>
          <Input
            type="file"
            accept="video/*"
            ref={bulkUploadInputRef}
            multiple
            className="hidden"
            id="bulk-media-upload"
            onChange={handleBulkLectureUpload}
          />
          <Button
            as="label"
            htmlFor="bulk-media-upload"
            variant="outline"
            className="cursor-pointer w-full sm:w-auto flex items-center"
            onClick={handleOpenBulkUploadDialog}
          >
            <Upload className="w-4 h-5 mr-2" />
            Bulk Upload
          </Button>
        </div>
      </CardHeader>

      {/* CONTENT */}
      <CardContent className="space-y-4">
        <Button
          className="cursor-pointer w-full sm:w-auto"
          disabled={!isCourseCurriculumFormDataValid() || mediaUploadProgress}
          onClick={handleAddLecture}
        >
          Add Lecture
        </Button>

        {mediaUploadProgress && (
          <MediaProgressbar
            isMediaUploading={mediaUploadProgress}
            progress={mediaUploadProgressPercentage}
          />
        )}

        <div className="space-y-6">
          {courseCurriculumFormData.map((curriculumItem, index) => (
            <div
              key={index}
              className="border p-4 rounded-md bg-white shadow-sm"
            >
              {/* LECTURE HEADER ROW */}
              <div className="flex flex-col lg:flex-row gap-4 lg:items-center">
                <h3 className="font-semibold text-lg">Lecture {index + 1}</h3>

                {/* INPUT TITLE */}
                <Input
                  name={`title-${index + 1}`}
                  placeholder="Enter lecture title"
                  className="w-full lg:max-w-xs"
                  onChange={(event) => handleLectureTitleChange(event, index)}
                  value={courseCurriculumFormData[index]?.title}
                />

                {/* FREE PREVIEW TOGGLE */}
                <div className="flex items-center space-x-2">
                  <Switch
                    id={`freePreview-${index + 1}`}
                    onCheckedChange={(value) =>
                      handleLectureFreePreviewChange(value, index)
                    }
                    checked={courseCurriculumFormData[index]?.freePreview}
                  />
                  <Label htmlFor={`freePreview-${index + 1}`}>
                    Free Preview
                  </Label>
                </div>
              </div>

              {/* MEDIA SECTION */}
              <div className="mt-6">
                {courseCurriculumFormData[index]?.videoUrl ? (
                  <div className="flex flex-col sm:flex-row gap-4">
                    <div className="w-full sm:w-[350px] lg:w-[450px]">
                      <VideoPlayer
                        url={courseCurriculumFormData[index]?.videoUrl}
                        width="100%"
                        height="220px"
                      />
                    </div>

                    <div className="flex gap-3 sm:flex-col lg:flex-row sm:w-auto">
                      <Button
                        className="cursor-pointer"
                        onClick={() => handleLectureReplace(index)}
                      >
                        Replace Video
                      </Button>

                      <Button
                        className="bg-red-900 cursor-pointer"
                        onClick={() => handleLectureDelete(index)}
                      >
                        Delete Lecture
                      </Button>
                    </div>
                  </div>
                ) : (
                  <Input
                    type="file"
                    accept="video/*"
                    onChange={(event) =>
                      handleSingleLectureUpload(event, index)
                    }
                    className="mb-4"
                  />
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default CourseCurriculum;
