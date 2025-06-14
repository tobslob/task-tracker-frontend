import React from "react";

export type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement>;

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className = "", children, ...props }, ref) => (
    <button
      ref={ref}
      className={`px-3 py-1 border rounded ${className}`}
      {...props}
    >
      {children}
    </button>
  )
);
Button.displayName = "Button";
