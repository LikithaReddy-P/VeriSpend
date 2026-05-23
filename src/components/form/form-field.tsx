import { cn } from "@/lib/utils";
import { Label } from "@/components/ui/label";

type FormFieldProps = {
  label: string;
  htmlFor?: string;
  description?: string;
  error?: string;
  required?: boolean;
  children: React.ReactNode;
  className?: string;
};

export function FormField({
  label,
  htmlFor,
  description,
  error,
  required,
  children,
  className,
}: FormFieldProps) {
  return (
    <div className={cn("space-y-2", className)}>
      <Label htmlFor={htmlFor} className="text-foreground">
        {label}
        {required && <span className="text-destructive">*</span>}
      </Label>
      {description && (
        <p className="text-sm text-muted-foreground">{description}</p>
      )}
      {children}
      {error && (
        <p className="text-sm text-destructive" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
