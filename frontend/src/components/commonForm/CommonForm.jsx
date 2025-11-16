import { Button } from "../ui/button"
import FormControl from "./FormControl"

function CommonForm({
    handleSubmit,
    buttonText,
    formControls = [],
    formData,
    setFormData,
    isButtonDisabled = false
}) {
    return (
        <form onSubmit={handleSubmit}>
            <FormControl
                formControls={formControls}
                formData={formData}
                setFormData={setFormData}
            />
            <Button disabled={isButtonDisabled} type="submit" className='w-full mt-5'>{buttonText || "Submit"}</Button>
        </form>
    )
}

export default CommonForm