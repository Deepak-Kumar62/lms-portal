import FormControl from "@/components/commonForm/FormControl";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { courseLandingPageFormControls } from "@/config";
import { useInstructorContext } from "@/contexts/InstructorContext";

const CourseLanding = () => {
  const { courseLandingFormData, setCourseLandingFormData } =
    useInstructorContext();

  return (
    <Card className="w-full shadow-md">
      <CardHeader className="pb-4">
        <CardTitle className="text-lg sm:text-xl md:text-2xl font-bold">
          Course Landing Page
        </CardTitle>
      </CardHeader>

      <CardContent className="p-3 sm:p-6">
        <div className="space-y-4">
          <FormControl
            formControls={courseLandingPageFormControls}
            formData={courseLandingFormData}
            setFormData={setCourseLandingFormData}
            className="w-full"
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default CourseLanding;
