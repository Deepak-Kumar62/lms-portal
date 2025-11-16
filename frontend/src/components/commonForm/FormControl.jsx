import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"



function FormControl({ formControls = [], formData, setFormData }) {
    function renderComponentByType(controlItem) {
        let element = null;
        const value = formData[controlItem.name] || ''

        switch (controlItem.componentType) {
            case 'input':
                element = <Input
                    id={controlItem.name}
                    name={controlItem.name}
                    placeholder={controlItem.placeholder}
                    type={controlItem.type}
                    value={value}
                    onChange={(event) => {
                        setFormData({ ...formData, [controlItem.name]: event.target.value })
                    }}
                />
                break;

            case 'select':
                element = <Select
                    onValueChange={(value) => setFormData(
                        { ...formData, [controlItem.name]: value }
                    )}

                    value={value}
                >
                    <SelectTrigger className="w-full">
                        <SelectValue placeholder={controlItem.label} />
                    </SelectTrigger>
                    <SelectContent>
                        {controlItem.options && controlItem.options.length > 0 ?
                            controlItem.options.map((optionItem) => (
                                <SelectItem key={optionItem.id} value={optionItem.id}>{optionItem.label}</SelectItem>
                            )) : null
                        }
                    </SelectContent>
                </Select>
                break;

            case 'textarea':
                element = <Textarea
                    id={controlItem.name}
                    name={controlItem.name}
                    placeholder={controlItem.placeholder}
                    value={value}
                    onChange={(event) => {
                        setFormData({ ...formData, [controlItem.name]: event.target.value })
                    }}
                />
                break;

            default:
                element = <Input
                    id={controlItem.name}
                    name={controlItem.name}
                    placeholder={controlItem.placeholder}
                    type={controlItem.type}
                    value={value}
                    onChange={(event) => {
                        setFormData({ ...formData, [controlItem.name]: event.target.value })
                    }}
                />
                break;
        }
        return element
    }

    return (
        <div className="flex flex-col gap-3">
            {
                formControls.map(controlItem => (
                    <div key={controlItem.name}>
                        <Label htmlFor={controlItem.name}>{controlItem.label}</Label>
                        {renderComponentByType(controlItem)}
                    </div>
                ))
            }
        </div>
    )
}

export default FormControl