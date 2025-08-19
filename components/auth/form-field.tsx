import { Label } from "@/components/ui/label"

interface FormFieldProps {
    label: string
    htmlFor: string
    children: React.ReactNode
}

export function FormField({ label, htmlFor, children }: FormFieldProps) {
    return (
        <div className="space-y-2">
            <Label htmlFor={htmlFor}>{label}</Label>
            {children}
        </div>
    )
}
