import React from "react";

const Separator = ({ className = "", ...props }) => (
  <hr className={["border-t border-gray-200 my-2", className].join(" ")} {...props} />
);

export { Separator };


