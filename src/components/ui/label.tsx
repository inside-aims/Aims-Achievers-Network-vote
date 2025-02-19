import * as React from "react";
import { cn } from "@/lib/utils"; // Ensure you have a utility function for classNames

export interface LabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {}

export const Label = React.forwardRef<HTMLLabelElement, LabelProps>(
  ({ className, ...props }, ref) => (
    <label ref={ref} className={cn("text-sm font-medium text-gray-300", className)} {...props} />
  )
);

Label.displayName = "Label";
