import React from "react";

const Label = ({ htmlFor, children, className = "", ...props }) => (
  <label htmlFor={htmlFor} className={["text-sm font-medium text-gray-700", className].join(" ")} {...props}>
    {children}
  </label>
);

export { Label };


