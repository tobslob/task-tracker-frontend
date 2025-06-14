import React from "react";

export type CardProps = React.HTMLAttributes<HTMLDivElement>;

export const Card: React.FC<CardProps> = ({ className = "", children, ...props }) => (
  <div className={`bg-white border rounded-md p-4 shadow-sm ${className}`} {...props}>
    {children}
  </div>
);
