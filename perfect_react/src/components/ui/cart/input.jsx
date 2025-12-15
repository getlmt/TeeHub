import React from "react";

const Input = ({ className = "", ...props }) => (
  <input className={["block w-full rounded-md border border-gray-300 px-3 py-2", className].join(" ")} {...props} />
);

export { Input };


